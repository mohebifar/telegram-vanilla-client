import mitt, { Emitter } from "mitt";
import Dexie, { IndexableType } from "dexie";
import db, { TelegramDatabaseTables } from "../utils/db";
import { TelegramClientProxy } from "../telegram-worker-proxy";
import { TelegramClient } from "../core/TelegramClient";

type CompoundKey = { [key: string]: IndexableType };
type PrimaryKey = CompoundKey | number | string;
type TableFields<Type> = Type extends Dexie.Table<infer X, any> ? X : never;
type TableKey<Type> = Type extends Dexie.Table<any, infer X> ? X : never;

export type ModelKey<T extends keyof TelegramDatabaseTables> = TableKey<
  TelegramDatabaseTables[T]
>;

export type ModelWithProxy<
  T extends keyof TelegramDatabaseTables = keyof TelegramDatabaseTables
> = Model<T> & TableFields<TelegramDatabaseTables[T]>;

export function ModelDecorator({
  tableName,
  primaryKey,
}: {
  tableName: string;
  primaryKey: string[];
}) {
  return function(modelClass: any) {
    modelClass.memoryCache = new Map<string, ModelWithProxy>();
    modelClass.table = db[tableName];
    modelClass.primaryKey = primaryKey;
    const fallbackGet = modelClass.get && modelClass.get.bind(modelClass);
    const fallbackBulkGet =
      modelClass.bulkGet && modelClass.bulkGet.bind(modelClass);

    modelClass.get = async function(id: PrimaryKey) {
      try {
        if (modelClass.isInMemory(id)) {
          return modelClass.getFromMemory(id);
        }

        const data = await modelClass.table.get(id as any);
        if (data) {
          const model = modelClass.makeProxy();
          model.assignValues(data);
          model.saveInMemory();
          return model;
        }

        if (fallbackGet) {
          return fallbackGet(id);
        }

        return undefined;
      } catch (e) {
        return undefined;
      }
    };

    modelClass.bulkGet = async function(
      ids: PrimaryKey[],
      skipDb = false,
      ...restArgs: any[]
    ) {
      const notFounds: PrimaryKey[] = [];
      const promise = ids.map((id) => {
        if (modelClass.isInMemory(id)) {
          return modelClass.getFromMemory(id);
        }
        if (!skipDb) {
          return (async () => {
            try {
              const data = await modelClass.table.get(id as any);
              if (data) {
                const model = modelClass.makeProxy();
                model.assignValues(data);
                model.saveInMemory();
                return model;
              }
            } catch {}

            notFounds.push(id);
            return undefined;
          })();
        }

        notFounds.push(id);
        return undefined;
      });

      const resultsPreFallback = (await Promise.all(promise)).filter(
        (v) => v !== undefined
      );

      if (notFounds.length > 0 && fallbackBulkGet) {
        const restResult =
          (await fallbackBulkGet(notFounds, skipDb, ...restArgs)) || [];
        return [...resultsPreFallback, ...restResult];
      }

      return resultsPreFallback;
    };

    modelClass.fromObject =
      modelClass.fromObject ||
      function(object: any, forceRecreate: boolean = false) {
        if (!forceRecreate) {
          const preparedValues = modelClass.prototype.prepareValues(object);
          if (modelClass.isInMemory(preparedValues)) {
            const model = modelClass.getFromMemory(preparedValues);
            model.assignValues(object);
            return model;
          }
        }

        const model = this.makeProxy();
        model.assignValues(object);
        return model;
      };

    modelClass.events = mitt();
  };
}

export class Model<
  T extends keyof TelegramDatabaseTables,
  Table extends TelegramDatabaseTables[T] = TelegramDatabaseTables[T],
  Fields extends TableFields<Table> = TableFields<Table>
> {
  ["constructor"]: typeof Model;

  static table: TelegramDatabaseTables[keyof TelegramDatabaseTables];
  static memoryCache: Map<string, ModelWithProxy>;
  static primaryKey: string[];
  static get: Function;
  static bulkGet: Function;
  static fromObject: Function;
  static tg: TelegramClientProxy | TelegramClient;
  static events: Emitter;

  public fields: Fields = {} as Fields;
  public _proxy: any;

  static getMemoryCacheKey(object: Model<any> | PrimaryKey) {
    if (typeof object === "string" || typeof object === "number") {
      return this.name + "_" + String(object).replace(/^_/, "");
    }

    const key =
      this.name +
      this.primaryKey.reduce(
        (key, property) =>
          key + "_" + property.split(".").reduce((o, i) => o[i], object),
        ""
      );

    return key;
  }

  static isInMemory(id: PrimaryKey) {
    return this.memoryCache.has(this.getMemoryCacheKey(id));
  }

  static getFromMemory(id: PrimaryKey) {
    return this.memoryCache.get(this.getMemoryCacheKey(id));
  }

  static makeProxy() {
    const obj = new this();
    const proxy = new Proxy(obj, {
      get: function(obj, prop) {
        if (prop in obj) {
          return typeof obj[prop] === "function"
            ? obj[prop].bind(obj)
            : obj[prop];
        }

        return obj.fields[prop];
      },
      has: function(obj, prop) {
        return prop in obj.fields || prop in obj;
      },
      set: function(obj, prop, value) {
        if (prop in obj) {
          obj[prop] = value;
        } else {
          obj.fields[prop] = value;
        }

        return true;
      },
    });
    obj._proxy = proxy;

    return proxy;
  }

  public assignValues(fields: any) {
    const values = this.prepareValues(fields);
    if (Object.keys(this.fields).length === 0) {
      this.fields = values;
      return;
    }

    Object.keys(values).forEach((key) => {
      this.fields[key] = values[key];
    });
  }

  protected prepareValues(fields: any) {
    return fields;
  }

  public save() {
    const gid = this.getGid();
    const isInMemory = this.constructor.memoryCache.has(gid);
    this.saveInMemory();

    const object = this.constructor.getFromMemory(this._proxy);

    const eventPayload = { object, gid };
    this.constructor.events.emit("saved", eventPayload);
    this.constructor.events.emit(
      isInMemory ? "updated" : "created",
      eventPayload
    );

    return this.saveInDb();
  }

  public destroy() {
    const gid = this.getGid();
    const object = this.constructor.getFromMemory(this._proxy);
    const eventPayload = { object, gid };

    this.constructor.events.emit("destroyed", eventPayload);
    return this.destroyInDb();
  }

  public saveInMemory() {
    this.constructor.memoryCache.set(
      this.constructor.getMemoryCacheKey(this.toJSON() as any),
      this._proxy
    );
  }

  public saveInDb() {
    return this.constructor.table.put(this.normalize() as any);
  }

  public destoryInMemory() {
    this.constructor.memoryCache.delete(
      this.constructor.getMemoryCacheKey(this.toJSON() as any)
    );
  }

  public destroyInDb() {
    // return this.constructor.table.delete(this.dbKey as never);
  }

  public toJSON() {
    return this.normalize();
  }

  public getGid() {
    return this.constructor.getMemoryCacheKey(this.toJSON() as any);
  }

  // private get dbKey() {
  //   const fields = this.normalize();
  //   return this.constructor.primaryKey.reduce(
  //     (obj, key) => ({
  //       ...obj,
  //       [key]: fields[key]
  //     }),
  //     {}
  //   );
  // }

  get tg() {
    return this.constructor.tg;
  }

  protected normalize() {
    return this.fields;
  }
}
