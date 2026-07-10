export const getRequiredFields = (
  formState: Record<string, any> = {},
  requires: string[] = [],
): Record<string, any> => {
  const requiredFields: Record<string, any> = {};
  for (const key of requires) {
    const field = formState[key];
    if (!field) continue;
    if (typeof field === "object" && !field?.value) continue;
    requiredFields[key] = typeof field === "object" ? field.value : field;
  }
  return requiredFields;
};

export default getRequiredFields;
