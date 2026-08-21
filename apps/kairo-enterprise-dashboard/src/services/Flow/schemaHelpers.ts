import type {
  BackendConversationSchemaMeta,
  BackendGuardrailField,
  BackendSchemaField,
  BackendSchemaOption,
  BackendSchemaVariable,
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
      "FIRST_TIME_USER",
    ),
    triggerCondition: getSchemaDefaultValue(
      conversationSchema?.triggerConditions,
      "",
    ),
    intent: getSchemaDefaultValue(conversationSchema?.intents, ""),
    fallbackLanguage: getSchemaDefaultValue(flowSchema?.languages, "en"),
    buttonAction: defaultButtonAction,
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
