export const toPascalCase = (str) => {
  return str === undefined || str === null
    ? "-"
    : str
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

export const capitalizeFirstLetter = (val) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}