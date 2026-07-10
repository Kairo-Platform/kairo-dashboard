export const csvToArray = (
  csvText: string,
  delimiter = ",",
  omitFirstRow = false,
): string[][] => {
  if (!csvText) return [];

  return csvText
    .slice(omitFirstRow ? csvText.indexOf("\n") + 1 : 0)
    .split("\n")
    .map((element) => element.split(delimiter));
};
