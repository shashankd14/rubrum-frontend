export const toPascalCase = (str) => {
  return str
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
    .replace(/[_\-]+/g, " ") // replace underscores/dashes with space
    .replace(/\s+/g, " ") // normalize multiple spaces
    .split(" ")
    .map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
    )
    .join(" ");
};
