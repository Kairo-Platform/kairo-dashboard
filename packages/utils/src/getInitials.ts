export const getInitials = (input: string | null | undefined): string => {
  if (!input) return "";

  const matches = input.match(/\b(\w)/g);
  if (!matches) return input.charAt(0) || "";

  return matches.join("").toUpperCase().slice(0, 2);
};

export default getInitials;
