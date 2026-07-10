import humanize from "underscore.string/humanize";

export function parseApiError(
  error: unknown,
  fallback = "An error occurred",
): string {
  const errorObj = (error || {}) as any;
  const errors = errorObj?.errors;

  if (Array.isArray(errors) && errors.length > 0) {
    return errors.join(", ");
  }

  if (typeof errors === "string" && errors.trim()) {
    return errors;
  }

  if (typeof errorObj?.message === "string" && errorObj.message.trim()) {
    return humanize(errorObj.message);
  }

  return fallback;
}
