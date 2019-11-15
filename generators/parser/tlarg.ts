export const SYNONYMS = {
  InputUser: "InputPeer",
  InputChannel: "InputPeer",
  InputDialogPeer: "InputPeer",
  InputNotifyPeer: "InputPeer",
  InputMessage: "int"
};

/**
 * Initializes a new .tl argument
 * :param name: The name of the .tl argument
 * :param argType: The type of the .tl argument
 * :param genericDefinition: Is the argument a generic definition?
 *                           (i.e. {X:Type})
 */
export class TLArg {
  public isVector = false;
  public isFlag = false;
  public skipConstructorId = false;
  public flagIndex = -1;
  public cls: string = null;
  public name: string;
  public canBeInferred: boolean;

  public flagIndicator: boolean;
  public type: string;
  public isGeneric: boolean;
  public useVectorId: boolean;

  constructor(
    name: string,
    public argType: string,
    public genericDefinition: boolean
  ) {
    this.name = name === "self" ? "is_self" : name;

    // Default values

    // Special case: some types can be inferred, which makes it
    // less annoying to type. Currently the only type that can
    // be inferred is if the name is 'random_id', to which a
    // random ID will be assigned if left as None (the default)
    this.canBeInferred = name === "random_id";

    // The type can be an indicator that other arguments will be flags
    if (argType === "#") {
      this.flagIndicator = true;
      this.type = null;
      this.isGeneric = false;
    } else {
      this.flagIndicator = false;
      this.isGeneric = argType.startsWith("!");
      // Strip the exclamation mark always to have only the name
      this.type = argType.replace(/^!+/, "");

      // The type may be a flag (flags.IDX?REAL_TYPE)
      // Note that 'flags' is NOT the flags name; this
      // is determined by a previous argument
      // However, we assume that the argument will always be called 'flags'
      const flagMatch = this.type.match(/flags.(\d+)\?([\w<>.]+)/);

      if (flagMatch) {
        this.isFlag = true;
        this.flagIndex = Number(flagMatch[1]);
        // Update the type to match the exact type, not the "flagged" one
        [, , this.type] = flagMatch;
      }

      // Then check if the type is a Vector<REAL_TYPE>
      const vectorMatch = this.type.match(/[Vv]ector<([\w\d.]+)>/);

      if (vectorMatch) {
        this.isVector = true;

        // If the type's first letter is not uppercase, then
        // it is a constructor and we use (read/write) its ID.
        this.useVectorId = this.type.charAt(0) === "V";

        // Update the type to match the one inside the vector
        [, this.type] = vectorMatch;
      }

      // See use_vector_id. An example of such case is ipPort in
      // help.configSpecial
      if (
        /^[a-z]$/.test(
          this.type
            .split(".")
            .pop()
            .charAt(0)
        )
      ) {
        this.skipConstructorId = true;
      }
    }
  }

  typeHint() {
    let cls = this.type;

    if (cls.includes(".")) {
      [, cls] = cls.split(".");
    }

    const resultMap = {
      int: "int",
      long: "int",
      int128: "int",
      int256: "int",
      double: "float",
      string: "str",
      date: "Optional[datetime]", // None date = 0 timestamp
      bytes: "bytes",
      Bool: "bool",
      true: "bool"
    };

    let result = resultMap[cls] || `'Type${cls}'`;

    if (this.isVector) {
      result = `List[${result}]`;
    }

    if (this.isFlag && cls !== "date") {
      result = `Optional[${result}]`;
    }

    return result;
  }

  realType() {
    // Find the real type representation by updating it as required
    let realType = this.flagIndicator ? "#" : this.type;

    if (this.isVector) {
      if (this.useVectorId) {
        realType = `Vector<${realType}>`;
      } else {
        realType = `vector<${realType}>`;
      }
    }

    if (this.isGeneric) {
      realType = `!${realType}`;
    }

    if (this.isFlag) {
      realType = `flags.${this.flagIndex}?${realType}`;
    }

    return realType;
  }

  toString() {
    if (this.genericDefinition) {
      return `{${this.name}:${this.realType()}}`;
    } else {
      return `${this.name}:${this.realType()}`;
    }
  }

  toJson() {
    return {
      name: this.name.replace("is_self", "self"),
      type: this.realType().replace(/\bdate$/, "int")
    };
  }
}
