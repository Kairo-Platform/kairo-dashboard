import type {
  BackendConversationSchemaMeta,
  BackendGuardrailField,
  BackendSchemaField,
  BackendSchemaOption,
  BackendSchemaVariable,
  BackendSettingsSchema,
  FlowTriggerCondition,
} from "./types";
import {
  fromBackendTypeId,
  toBackendTypeId,
} from "./mappers";

export type SchemaSelectOption = {
  label: string;
  value: string;
};

export type SchemaMessageVariable = {
  token: string;
  description: string;
  example?: string;
};

export function toSelectOptions(
  options: BackendSchemaOption[] | undefined,
  fallback: SchemaSelectOption[] = [],
): SchemaSelectOption[] {
  if (!Array.isArray(options) || options.length === 0) return fallback;
  return options.map((option) => ({
    label: option.label,
    value: option.value,
  }));
}

export function getSchemaDefaultValue(
  options: BackendSchemaOption[] | undefined,
  fallback = "",
): string {
  return options?.[0]?.value ?? fallback;
}

export function getSchemaOptionLabel(
  options: BackendSchemaOption[] | undefined,
  value: string,
  fallback = "",
): string {
  const match = options?.find((option) => option.value === value);
  return match?.label ?? fallback;
}

export function resolveConversationSchemaTypeId(
  entry: BackendConversationSchemaMeta,
): string | undefined {
  const raw = entry.typeId ?? entry.type ?? entry.id;
  return typeof raw === "string" && raw.trim() ? raw : undefined;
}

export function resolveConversationSchemaLabel(
  entry: BackendConversationSchemaMeta,
): string | undefined {
  const raw = entry.label ?? entry.name ?? entry.displayName;
  return typeof raw === "string" && raw.trim() ? raw : undefined;
}

export function findConversationSchema(
  schema: BackendSettingsSchema | null | undefined,
  frontendTypeId: string,
): BackendConversationSchemaMeta | undefined {
  if (!schema?.conversations?.length || !frontendTypeId) return undefined;

  const backendId = toBackendTypeId(frontendTypeId);
  return schema.conversations.find((entry) => {
    const entryTypeId = resolveConversationSchemaTypeId(entry);
    if (!entryTypeId) return false;
    return (
      entryTypeId === backendId ||
      entryTypeId === frontendTypeId ||
      fromBackendTypeId(entryTypeId) === frontendTypeId
    );
  });
}

export function toMessageVariables(
  variables: BackendSchemaVariable[] | undefined,
  fallback: SchemaMessageVariable[] = [],
): SchemaMessageVariable[] {
  if (!Array.isArray(variables) || variables.length === 0) return fallback;

  return variables.map((variable) => ({
    token: variable.token,
    description: variable.description,
    example: variable.sample,
  }));
}

export function getGuardrailField(
  guardrails: BackendGuardrailField[] | undefined,
  field: string,
): BackendGuardrailField | undefined {
  return guardrails?.find((entry) => entry.field === field);
}

export function getGuardrailOptions(
  guardrails: BackendGuardrailField[] | undefined,
  field: string,
  fallback: SchemaSelectOption[] = [],
): SchemaSelectOption[] {
  return toSelectOptions(
    getGuardrailField(guardrails, field)?.options,
    fallback,
  );
}

export function getAutomationField(
  automation: BackendSchemaField[] | undefined,
  field: string,
): BackendSchemaField | undefined {
  return automation?.find((entry) => entry.field === field);
}

export function getAutomationFieldOptions(
  automation: BackendSchemaField[] | undefined,
  field: string,
  fallback: SchemaSelectOption[] = [],
): SchemaSelectOption[] {
  return toSelectOptions(
    getAutomationField(automation, field)?.options,
    fallback,
  );
}

export const DEFAULT_AUTOMATION_TIME = "09:00";

export function normalizeAutomationTime(value: unknown): string {
  const time = typeof value === "string" ? value.trim() : "";
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
    ? time
    : DEFAULT_AUTOMATION_TIME;
}

function automationFieldDefault(field: BackendSchemaField): unknown {
  switch (field.kind) {
    case "TOGGLE":
      return false;
    case "MULTI_SELECT":
      return [];
    case "SELECT":
      return field.options[0]?.value ?? "";
    case "TIME":
      return DEFAULT_AUTOMATION_TIME;
    default:
      return undefined;
  }
}

export function getSchemaOptionValues(
  options: BackendSchemaOption[] | undefined,
): Set<string> {
  return new Set(
    (options ?? [])
      .map((option) => option.value)
      .filter((value) => typeof value === "string" && value.trim()),
  );
}

function sanitizeEnumValue(
  value: unknown,
  options: BackendSchemaOption[] | undefined,
  fallback = "",
): string {
  const normalized = String(value ?? "").trim();
  const allowed = getSchemaOptionValues(options);
  if (!allowed.size) return normalized || fallback;
  if (normalized && allowed.has(normalized)) return normalized;
  return fallback || options?.[0]?.value || "";
}

function sanitizeMultiSelectValue(
  value: unknown,
  field: BackendSchemaField,
): string[] {
  const selected = Array.isArray(value) ? value.map(String) : [];
  const allowed = getSchemaOptionValues(field.options);

  if (!allowed.size) {
    return field.allowsCustom ? selected.filter((entry) => entry.trim()) : [];
  }

  return selected.filter((entry) => allowed.has(entry));
}

export function sanitizeAutomationFieldValue(
  field: BackendSchemaField,
  value: unknown,
): unknown {
  switch (field.kind) {
    case "TOGGLE":
      return Boolean(value);
    case "SELECT":
      return sanitizeEnumValue(value, field.options);
    case "MULTI_SELECT":
      return sanitizeMultiSelectValue(value, field);
    case "TIME":
      return normalizeAutomationTime(value);
    default:
      return value;
  }
}

export function getDefaultAutomationFromSchema(
  schemaFields: BackendSchemaField[] | undefined,
): Record<string, unknown> {
  if (!schemaFields?.length) return {};

  return Object.fromEntries(
    schemaFields.map((field) => [
      field.field,
      sanitizeAutomationFieldValue(field, automationFieldDefault(field)),
    ]),
  );
}

export function initAutomationValues(
  existing: Record<string, unknown> | undefined,
  schemaFields: BackendSchemaField[] | undefined,
): Record<string, unknown> {
  const defaults = getDefaultAutomationFromSchema(schemaFields);
  if (!schemaFields?.length) return { ...(existing ?? {}) };

  return Object.fromEntries(
    schemaFields.map((field) => [
      field.field,
      sanitizeAutomationFieldValue(
        field,
        existing?.[field.field] ?? defaults[field.field],
      ),
    ]),
  );
}

export function buildBackendAutomation(
  automationValues: Record<string, unknown> | undefined,
  schemaFields: BackendSchemaField[] | undefined,
): Record<string, unknown> | undefined {
  if (!schemaFields?.length) {
    return undefined;
  }

  return Object.fromEntries(
    schemaFields.map((field) => [
      field.field,
      sanitizeAutomationFieldValue(field, automationValues?.[field.field]),
    ]),
  );
}

export function mergeConversationMessageVariables(
  flowSchema: BackendSettingsSchema | null | undefined,
  conversationSchema: BackendConversationSchemaMeta | undefined,
  customVariables: SchemaMessageVariable[] = [],
  flowVariables: SchemaMessageVariable[] = [],
): SchemaMessageVariable[] {
  const byToken = new Map<string, SchemaMessageVariable>();

  for (const variable of flowVariables) {
    byToken.set(variable.token, variable);
  }

  for (const variable of toMessageVariables(flowSchema?.commonVariables, [])) {
    byToken.set(variable.token, variable);
  }

  for (const variable of toMessageVariables(
    conversationSchema?.variables,
    [],
  )) {
    byToken.set(variable.token, variable);
  }

  for (const variable of customVariables) {
    byToken.set(variable.token, variable);
  }

  return Array.from(byToken.values());
}

export function getTriggerConditionOptions(
  conditions?: FlowTriggerCondition | FlowTriggerCondition[] | null,
): FlowTriggerCondition[] {
  if (!conditions) return [];
  if (Array.isArray(conditions)) return conditions;
  return conditions.kind === "GROUP" && conditions.operator === "OR"
    ? conditions.children
    : [conditions];
}

export function getConversationDefaultsFromSchema(
  conversationSchema?: BackendConversationSchemaMeta,
  flowSchema?: BackendSettingsSchema | null,
) {
  const defaultButtonAction = getSchemaDefaultValue(
    flowSchema?.buttonActions,
    "OPEN_ONBOARDING",
  );

  return {
    triggerConditions: getTriggerConditionOptions(conversationSchema?.triggerConditions),
    intent: getSchemaDefaultValue(conversationSchema?.intents, ""),
    fallbackLanguage: getSchemaDefaultValue(flowSchema?.languages, "en"),
    buttonAction: defaultButtonAction,
    buttonActionLabel: getSchemaOptionLabel(
      flowSchema?.buttonActions,
      defaultButtonAction,
      "",
    ),
    buttonType: getSchemaDefaultValue(flowSchema?.buttonTypes, "REPLY"),
    quickReplyAction: defaultButtonAction,
  };
}

export function mergeBuiltInCatalogWithSchema<
  T extends {
    id: string;
    title: string;
    description?: string;
    conversationsTitle: string;
    kind: string;
    icon?: string;
  },
>(
  builtInTypes: T[],
  schema: BackendSettingsSchema | null | undefined,
  existingCatalog: T[] = builtInTypes,
): T[] {
  const customTypes = existingCatalog.filter(
    (entry) => entry.kind === "custom",
  );

  if (!schema?.conversations?.length) {
    return [...builtInTypes, ...customTypes];
  }

  const fromSchema = schema.conversations.flatMap((entry) => {
    const entryTypeId = resolveConversationSchemaTypeId(entry);
    if (!entryTypeId) return [];

    const frontendId = fromBackendTypeId(entryTypeId);
    const builtIn =
      builtInTypes.find((meta) => meta.id === frontendId) ??
      builtInTypes.find((meta) => toBackendTypeId(meta.id) === entryTypeId);

    const label =
      resolveConversationSchemaLabel(entry) ?? builtIn?.title ?? frontendId;

    return [
      {
        ...(builtIn ??
          ({
            id: frontendId,
            title: label,
            description: entry.description ?? "",
            conversationsTitle: `${label} conversations`,
            kind: "built-in",
          } as T)),
        id: frontendId,
        title: label,
        description: entry.description ?? builtIn?.description ?? "",
        conversationsTitle: `${label} conversations`,
        kind: "built-in",
      } as T,
    ];
  });

  return [...fromSchema, ...customTypes];
}
