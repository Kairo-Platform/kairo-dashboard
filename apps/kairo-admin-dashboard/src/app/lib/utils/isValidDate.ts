/**
 * returns true if value can be parsed to a valid Date
 *
 * @param {string|Date|number|null|undefined} date a date input
 * @return {boolean} true when parsable to a valid Date, otherwise false
 */
export const isValidDate = (
  date: string | Date | number | null | undefined,
): boolean => {
  const d = new Date(date as any);
  return !Number.isNaN(d.getTime());
};

export default isValidDate;
