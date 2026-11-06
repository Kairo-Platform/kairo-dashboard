import type {
  BackendChannelConfig,
  ChannelFormField,
  ChannelFormValues,
  ChannelConnectRequest,
} from "./types";

export const channelInputTypes = new Set([
  "text",
  "password",
  "tel",
  "email",
  "url",
  "number",
  "date",
  "datetime-local",
  "time",
  "textarea",
  "select",
  "boolean",
]);

export function channelFormValues(
  config: BackendChannelConfig,
): ChannelFormValues {
  const saved = new Map(
    config.entries.map((entry) => [entry.key, entry.value]),
  );
  return Object.fromEntries(
    config.schema.fields
      .filter((field) => field.visible)
      .map((field) => {
        const value =
          field.type === "password"
            ? ""
            : (saved.get(field.key) ?? field.defaultValue ?? "");
        if (field.valueType === "boolean") return [field.key, value === "true"];
        if (field.type === "datetime-local" && value) {
          const date = new Date(value);
          if (Number.isFinite(date.getTime()))
            return [
              field.key,
              new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16),
            ];
        }
        return [field.key, value];
      }),
  );
}

export function channelFormPayload(
  fields: ChannelFormField[],
  values: ChannelFormValues,
) {
  const body: ChannelConnectRequest = {};
  const errors: Record<string, string> = {};
  for (const field of fields) {
    if (!field.visible || field.readOnly) continue;
    const raw = values[field.key];
    const value = typeof raw === "boolean" ? raw : (raw ?? "").trim();
    if (!channelInputTypes.has(field.type)) {
      errors[field.key] =
        "This input type is not supported by this dashboard version.";
      continue;
    }
    if (field.required && value === "") {
      errors[field.key] = `${field.label} is required`;
      continue;
    }
    if (field.type === "password" && field.hasValue && value === "") continue;
    if (typeof value === "boolean") {
      body[field.key] = value;
      continue;
    }
    if (value && field.pattern) {
      try {
        if (!new RegExp(field.pattern).test(value))
          errors[field.key] = `Enter a valid ${field.label.toLowerCase()}`;
      } catch {
        errors[field.key] = "This field has invalid validation settings.";
      }
    }
    if (field.maxLength && value.length > field.maxLength)
      errors[field.key] = `Use no more than ${field.maxLength} characters`;
    if (
      value &&
      field.type === "select" &&
      !field.options.some((option) => option.value === value)
    )
      errors[field.key] = "Choose an available option";
    if (
      value &&
      field.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    )
      errors[field.key] = "Enter a valid email";
    if (value && field.type === "url") {
      try {
        const url = new URL(value);
        if (!["https:", "http:"].includes(url.protocol)) throw new Error();
      } catch {
        errors[field.key] = "Enter a valid URL";
      }
    }
    if (field.type === "datetime-local") {
      if (!value) continue;
      const date = new Date(value);
      if (!Number.isFinite(date.getTime()))
        errors[field.key] = "Enter a valid date and time";
      else body[field.key] = date.toISOString();
    } else if (field.valueType === "number") {
      if (!value) continue;
      const number = Number(value);
      if (
        !Number.isFinite(number) ||
        Math.abs(number) > Number.MAX_SAFE_INTEGER
      )
        errors[field.key] = "Enter a valid number";
      else body[field.key] = number;
    } else body[field.key] = value;
  }
  return { body, errors };
}
