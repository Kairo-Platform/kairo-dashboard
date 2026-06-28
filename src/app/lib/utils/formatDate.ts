import dayjs from "dayjs";
import { isValidDate } from "./isValidDate";

export const DATE_FORMAT = "DD MMM YYYY";
export const DATE_TIME_FORMAT = "DD MMM YYYY h:mm:ss A";

/**
 * formats a date string
 *
 * @param {string|Date|number|null|undefined} date a valid date string or Date or timestamp
 * @param {string} [format='DD MMM YYYY'] e.g. "DD MMM YYYY"
 * @return {string|Date|number|null|undefined} formatted date string when valid, otherwise the original value
 */
export const formatDate = (
  date: string | Date | number | null | undefined,
  format = DATE_FORMAT,
): string | Date | number | null | undefined => {
  if (date && isValidDate(date)) return dayjs(date).format(format);
  return date;
};

export default formatDate;
