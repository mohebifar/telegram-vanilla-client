export const snakeToCamelCase = (name: string, suffix: string) => {
  const result = name.replace(/(?:^|_)([a-z])/g, (_, g) => g.toUpperCase());
  return result.replace(/_/g, "") + (suffix || "");
};

export const variableSnakeToCamelCase = (str: string) =>
  str.replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace("-", "")
      .replace("_", "")
  );
