export const parseErrorsFromApi = (
  errorsObj: unknown = {},
): Record<string, { message: unknown }> => {
  if (!errorsObj || typeof errorsObj !== "object") return {};

  const parsedErrors: Record<string, { message: unknown }> = {};
  const source = errorsObj as Record<string, unknown>;
  for (const key in source) {
    parsedErrors[key] = { message: source[key] };
  }

  return parsedErrors;
};

export default parseErrorsFromApi;
