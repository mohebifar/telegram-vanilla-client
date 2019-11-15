import fs from "fs";
import csvParse from "csv-parse/lib/sync";

export enum Usability {
  UNKNOWN = 0,
  USER = 1,
  BOT = 2,
  BOTH = 4
}

export class MethodInfo {
  public id: number;
  public usability: Usability;

  constructor(
    public name: string,
    usability: keyof Usability,
    public errors: string[],
    public friendly: boolean
  ) {
    this.name = name;
    this.errors = errors;
    this.friendly = friendly;

    if (usability.toUpperCase() in Usability) {
      this.usability = Usability[usability.toUpperCase()];
    } else {
      throw new Error(
        `Usability must be either user, bot, both or unknown, not ${usability}`
      );
    }
  }
}

/**
 * Parses the input CSV file with columns (method, usability, errors)
 * and yields `MethodInfo` instances as a result.
 */
export const parseMethods = function*(
  csvFile: string,
  friendlyCsvFile: string,
  errorsDict: Object
) {
  const rawToFriendly = {};
  const f1 = csvParse(fs.readFileSync(friendlyCsvFile, { encoding: "utf-8" }));

  for (const [ns, friendly, rawList] of f1.slice(1)) {
    for (const raw of rawList.split(" ")) {
      rawToFriendly[raw] = [ns, friendly];
    }
  }

  const f2 = csvParse(fs.readFileSync(csvFile, { encoding: "utf-8" })).slice(1);

  for (let line = 0; line < f2.length; line++) {
    let [method, usability, errors] = f2[line];

    // errors = errors
    //   .split(" ")
    //   .filter(Boolean)
    //   .map(x => {
    //     if (x && !(x in errorsDict)) {
    //       throw new Error(
    //         `Method ${method} references unknown errors ${errors}`
    //       );
    //     }

    //     return errorsDict[x];
    //   });

    const friendly = rawToFriendly[method];
    delete rawToFriendly[method];
    yield new MethodInfo(method, usability, [], friendly);
  }
};
