import { TLArg } from "./tlarg";
import { Usability } from "./methods";
import { snakeToCamelCase } from "../utils";
import { crc32 } from "crc";

// https://github.com/telegramdesktop/tdesktop/blob/4bf66cb6e93f3965b40084771b595e93d0b11bcd/Telegram/SourceFiles/codegen/scheme/codegen_scheme.py#L57-L62
const WHITELISTED_MISMATCHING_IDS = {
  // 0 represents any layer
  0: new Set([
    "channel", // Since layer 77, there seems to be no going back...
    "ipPortSecret",
    "accessPointRule",
    "help.configSimple"
  ])
};

export class TLObject {
  public fullname: string;
  public name: string;
  public namespace?: string;
  public id: number;
  public className: string;
  public realArgs: TLArg[];

  constructor(
    fullname: string,
    id: string,
    public args: TLArg[],
    public result: string,
    public isFunction: boolean,
    public usability: Usability,
    public friendly: boolean,
    public layer: number
  ) {
    this.fullname = fullname;

    if (fullname.includes(".")) {
      [this.namespace, this.name] = fullname.split(/\.(.+)/);
      this.className =
        this.namespace +
        "_" +
        snakeToCamelCase(this.name, this.isFunction ? "Request" : "");

      this.name = fullname.replace(/\.(.+)/, "_");
    } else {
      this.namespace = null;
      this.name = fullname;

      this.className = snakeToCamelCase(
        this.name,
        this.isFunction ? "Request" : ""
      );
    }

    this.id = null;

    if (!id) {
      this.id = this.inferId();
    } else {
      this.id = parseInt(id, 16);

      const whitelist = new Set([
        ...WHITELISTED_MISMATCHING_IDS[0],
        ...(WHITELISTED_MISMATCHING_IDS[layer] || [])
      ]);

      if (!whitelist.has(this.fullname)) {
        if (this.id !== this.inferId()) {
          throw new Error(`Invalid inferred ID for ${this.repr()}`);
        }
      }
    }

    this.realArgs = this.sortedArgs().filter(
      a => !(a.flagIndicator || a.genericDefinition)
    );
  }

  get innermostResult() {
    const index = this.result.indexOf("<");
    return index === -1 ? this.result : this.result.slice(index + 1, -1);
  }

  /**
   * Returns the arguments properly sorted and ready to plug-in
   * into a Python's method header (i.e., flags and those which
   * can be inferred will go last so they can default =None)
   */
  sortedArgs() {
    return this.args.slice().sort(x => (x.isFlag || x.canBeInferred ? 1 : -1));
  }

  repr(ignoreId = false) {
    let hexId;
    let args;

    if (this.id === null || ignoreId) {
      hexId = "";
    } else {
      hexId = `#${this.id.toString(16).padStart(8, "0")}`;
    }

    if (this.args.length) {
      args = ` ${this.args.map(arg => arg.toString()).join(" ")}`;
    } else {
      args = "";
    }

    return `${this.fullname}${hexId}${args} = ${this.result}`;
  }

  inferId() {
    const representation = this.repr(true)
      .replace(/(:|\?)bytes /g, "$1string ")
      .replace(/</g, " ")
      .replace(/>|{|}/g, "")
      .replace(/ \w+:flags\.\d+\?true/g, "");

    if (this.fullname === "inputMediaInvoice") {
      // eslint-disable-next-line no-empty
      if (this.fullname === "inputMediaInvoice") {
      }
    }

    return crc32(Buffer.from(representation, "utf8"));
  }
}
