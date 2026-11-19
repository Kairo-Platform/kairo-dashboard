import { z } from "zod";
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

export function channelFormFields(
  config: BackendChannelConfig,
  values: ChannelFormValues,
) {
  const key = config.schema.variantKey;
  if (!key || !config.schema.variants?.length) return config.schema.fields;
  return (
    config.schema.variants.find((variant) => variant.value === values[key])
      ?.fields ?? []
  );
}

export function channelFormValues(
  config: BackendChannelConfig,
  variant?: string,
): ChannelFormValues {
  const saved = new Map(
    config.entries.map((entry) => [entry.key, entry.value]),
  );
  const key = config.schema.variantKey;
  const selected =
    variant ??
    (key ? saved.get(key) : undefined) ??
    config.schema.defaultVariant;
  const switching =
    variant &&
    variant !== (saved.get(key ?? "") ?? config.schema.defaultVariant);
  const fields =
    key && config.schema.variants?.length
      ? (config.schema.variants.find((item) => item.value === selected)
          ?.fields ?? [])
      : config.schema.fields;
  return {
    ...(key && selected ? { [key]: selected } : {}),
    ...Object.fromEntries(
      fields
        .filter((field) => field.visible)
        .map((field) => {
          const value =
            field.type === "password"
              ? ""
              : ((!switching ? saved.get(field.key) : undefined) ??
                field.defaultValue ??
                "");
          if (field.valueType === "boolean")
            return [field.key, value === "true"];
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
    ),
  };
}

function normalizeChannelPhoneNumber(value: string): string {
  if (!/^\+?[\d\s()-]+$/.test(value)) return value;
  const compact = value.replace(/[\s()-]/g, "");
  if (/^0\d{10}$/.test(compact)) return `+234${compact.slice(1)}`;
  if (/^[1-9]\d{6,14}$/.test(compact)) return `+${compact}`;
  return compact;
}

function normalizeChannelPhoneNumber(value: string): string {
  if (!/^\+?[\d\s()-]+$/.test(value)) return value;
  const compact = value.replace(/[\s()-]/g, "");
  if (/^0\d{10}$/.test(compact)) return `+234${compact.slice(1)}`;
  if (/^[1-9]\d{6,14}$/.test(compact)) return `+${compact}`;
  return compact;
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
    const trimmed = typeof raw === "boolean" ? raw : (raw ?? "").trim();
    const value =
      field.type === "tel" && typeof trimmed === "string"
        ? normalizeChannelPhoneNumber(trimmed)
        : trimmed;
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
        if (
          !z.string().regex(new RegExp(field.pattern)).safeParse(value).success
        )
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
