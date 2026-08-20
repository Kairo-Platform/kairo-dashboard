import type {
  BackendConversationSchemaMeta,
  BackendGuardrailField,
  BackendSchemaOption,
  BackendSettingsSchema,
} from "./types";
import { fromBackendTypeId, toBackendTypeId } from "./mappers";

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

function resolveConversationSchemaTypeId(
  entry: BackendConversationSchemaMeta,
): string | undefined {
  const raw = entry.typeId ?? entry.type ?? entry.id;
  return typeof raw === "string" && raw.trim() ? raw : undefined;
}

function resolveConversationSchemaLabel(
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
  variables: BackendSettingsSchema["commonVariables"] | undefined,
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

export function getTemplateDefaultsFromSchema(
  conversationSchema?: BackendConversationSchemaMeta,
  flowSchema?: BackendSettingsSchema | null,
) {
  return {
    trigger: getSchemaDefaultValue(
      conversationSchema?.triggers,
      "FIRST_TIME_USER",
    ),
    triggerCondition: getSchemaDefaultValue(
      conversationSchema?.triggerConditions,
      "FIRST_TIME_USER",
    ),
    intent: getSchemaDefaultValue(conversationSchema?.intents, "WELCOME"),
    fallbackLanguage: getSchemaDefaultValue(flowSchema?.languages, "en"),
    buttonAction: getSchemaDefaultValue(
      flowSchema?.buttonActions,
      "OPEN_ONBOARDING",
    ),
    buttonType: getSchemaDefaultValue(flowSchema?.buttonTypes, "REPLY"),
    quickReplyAction: getSchemaDefaultValue(
      flowSchema?.buttonActions,
      "GET_STARTED",
    ),
  };
}

export function mergeBuiltInCatalogWithSchema<
  T extends {
    id: string;
    title: string;
    conversationsTitle: string;
    kind: string;
  },
>(
  builtInTypes: T[],
  schema: BackendSettingsSchema | null | undefined,
  existingCatalog: T[] = builtInTypes,
): T[] {
  const customTypes = existingCatalog.filter((entry) => entry.kind === "custom");
  const mergedBuiltIn = builtInTypes.map((meta) => {
    const schemaMeta = findConversationSchema(schema, meta.id);
    if (!schemaMeta) return meta;

    const schemaLabel = resolveConversationSchemaLabel(schemaMeta);
    if (!schemaLabel) return meta;

    return {
      ...meta,
      title: schemaLabel,
      conversationsTitle: `${schemaLabel} conversations`,
    };
  });
  return [...mergedBuiltIn, ...customTypes];
}
