/**
 * formats a string date from DD/MM/YYYY to date object
 *
 * @param {string|undefined|null} dateString e.g. "DD/MM/YYYY"
 * @return {Date|string|undefined|null} Date when valid, otherwise original input
 */
export const formatStringToDate = (
  dateString: string | null | undefined,
): Date | string | null | undefined => {
  if (dateString && dateString.includes("/")) {
    const [day, month, year] = dateString.split("/");
    if (day && month && year) return new Date([month, day, year].join("/"));
    return dateString;
  }
  return dateString;
};

export default formatStringToDate;
