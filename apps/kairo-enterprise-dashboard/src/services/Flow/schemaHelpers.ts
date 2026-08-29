import type {
  BackendConversationSchemaMeta,
  BackendGuardrailField,
  BackendSchemaField,
  BackendSchemaOption,
  BackendSchemaVariable,
  BackendSettingsSchema,
  BackendTemplate,
} from "./types";
import {
  fromBackendTypeId,
  labelToBackendEnumValue,
  toBackendTemplate,
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
  return toSelectOptions(getGuardrailField(guardrails, field)?.options, fallback);
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
  return toSelectOptions(getAutomationField(automation, field)?.options, fallback);
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
      return "";
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
    return field.allowsCustom
      ? selected.filter((entry) => entry.trim())
      : [];
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
      return String(value ?? "").trim();
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
): SchemaMessageVariable[] {
  const byToken = new Map<string, SchemaMessageVariable>();

  for (const variable of toMessageVariables(flowSchema?.commonVariables, [])) {
    byToken.set(variable.token, variable);
  }

  for (const variable of toMessageVariables(conversationSchema?.variables, [])) {
    byToken.set(variable.token, variable);
  }

  for (const variable of customVariables) {
    byToken.set(variable.token, variable);
  }

  return Array.from(byToken.values());
}

export function getAllowedTriggerConditionValues(
  conversationSchema: BackendConversationSchemaMeta | undefined,
  customTriggerConditions: SchemaSelectOption[] = [],
): Set<string> {
  const allowed = getSchemaOptionValues(conversationSchema?.triggerConditions);
  for (const option of customTriggerConditions) {
    if (option.value.trim()) allowed.add(option.value);
  }
  return allowed;
}

export function createCustomTriggerConditionOption(
  label: string,
): SchemaSelectOption {
  return {
    label,
    value: labelToBackendEnumValue(label),
  };
}

type SaveableTemplate = {
  id: string;
  name: string;
  trigger: string;
  triggerConditions: string[];
  intent: string;
  message: string;
  buttons: {
    label: string;
    action: string;
    buttonType: string;
    payload?: Record<string, unknown>;
  }[];
  fallbackLanguage: string;
};

export function normalizeTemplateForSave(
  template: SaveableTemplate,
  conversationSchema?: BackendConversationSchemaMeta,
  customTriggerConditions: SchemaSelectOption[] = [],
): BackendTemplate {
  const allowedTriggers = getSchemaOptionValues(conversationSchema?.triggers);
  const allowedIntents = getSchemaOptionValues(conversationSchema?.intents);
  const allowedConditions = getAllowedTriggerConditionValues(
    conversationSchema,
    customTriggerConditions,
  );

  const trigger = sanitizeEnumValue(
    template.trigger,
    conversationSchema?.triggers,
    getSchemaDefaultValue(conversationSchema?.triggers, ""),
  );

  const intent =
    allowedIntents.size > 0
      ? sanitizeEnumValue(
          template.intent,
          conversationSchema?.intents,
          getSchemaDefaultValue(conversationSchema?.intents, ""),
        )
      : "";

  const triggerConditions = template.triggerConditions
    .filter((value) => value.trim() && allowedConditions.has(value))
    .filter((value, index, list) => list.indexOf(value) === index);

  const sanitizedTrigger =
    !allowedTriggers.size || allowedTriggers.has(trigger) ? trigger : "";

  return toBackendTemplate({
    ...template,
    trigger: sanitizedTrigger,
    intent,
    triggerConditions,
  });
}

export function getTemplateDefaultsFromSchema(
  conversationSchema?: BackendConversationSchemaMeta,
  flowSchema?: BackendSettingsSchema | null,
) {
  const defaultButtonAction = getSchemaDefaultValue(
    flowSchema?.buttonActions,
    "OPEN_ONBOARDING",
  );

  return {
    trigger: getSchemaDefaultValue(
      conversationSchema?.triggers,
      "",
    ),
    triggerCondition: getSchemaDefaultValue(
      conversationSchema?.triggerConditions,
      "",
    ),
    intent: getSchemaDefaultValue(conversationSchema?.intents, ""),
    templateType: getSchemaDefaultValue(conversationSchema?.templateTypes, ""),
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
  const customTypes = existingCatalog.filter((entry) => entry.kind === "custom");

  if (!schema?.conversations?.length) {
    return [...builtInTypes, ...customTypes];
  }

  const fromSchema = schema.conversations.flatMap((entry) => {
    const entryTypeId = resolveConversationSchemaTypeId(entry);
    if (!entryTypeId) return [];

    const frontendId = fromBackendTypeId(entryTypeId);
    const builtIn =
      builtInTypes.find((meta) => meta.id === frontendId) ??
      builtInTypes.find(
        (meta) => toBackendTypeId(meta.id) === entryTypeId,
      );

    const label =
      resolveConversationSchemaLabel(entry) ?? builtIn?.title ?? frontendId;

    return [
      {
        ...(builtIn ?? ({
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
