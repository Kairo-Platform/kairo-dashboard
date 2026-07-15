export const isValidDate = (
  date: string | Date | number | null | undefined,
): boolean => {
  const d = new Date(date as string | Date | number);
  return !Number.isNaN(d.getTime());
};

export default isValidDate;
