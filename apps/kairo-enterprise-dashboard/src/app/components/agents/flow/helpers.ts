import {
  buildBackendAutomation,
  findConversationSchema,
  FlowTriggerCondition,
  getDefaultAutomationFromSchema,
  getTriggerConditionOptions,
  initAutomationValues,
  toBackendTypeId,
  type BackendConversationSchemaMeta,
  type BackendConversationType,
  type BackendSettingsSchema,
} from "@/services/Flow";
import { BUILT_IN_CONVERSATION_TYPES, CHANNEL_BRAND_COLORS } from "./resources";
import type {
  ConversationSettingsMap,
  ConversationSettingsSavePayload,
  ConversationStatus,
  ConversationTypeConfig,
  FlowChannel,
  MessageVariable,
  ConversationButton,
  ConversationDefaults,
} from "./types";

export const getChannelBrandColor = (channel: FlowChannel) =>
  channel.brandColor ?? CHANNEL_BRAND_COLORS[channel.id] ?? "#46AE70";

export const isWhatsAppChannel = (channel: FlowChannel | null) =>
  channel?.id === "whatsapp" || channel?.name.toLowerCase() === "whatsapp";

export const cloneAutomationValues = (
  values: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      Array.isArray(value) ? [...value] : value,
    ]),
  );

export const humanizeActionValue = (action: string): string =>
  action
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const getButtonActionLabel = (
  action: string,
  options: { label: string; value: string }[],
): string => {
  if (!action.trim()) return "";
  const match = options.find((option) => option.value === action);
  return match?.label ?? humanizeActionValue(action);
};

export const createEmptyButton = (): ConversationButton => ({
  id: crypto.randomUUID(),
  label: "",
  action: "",
  buttonType: "",
  payload: {},
  labelCustomized: false,
});

export const createDefaultTypeConfig = (
  kind: "built-in" | "custom" = "built-in",
  status: ConversationStatus = "DRAFT",
  defaults?: ConversationDefaults,
  conversationSchema?: BackendConversationSchemaMeta,
): ConversationTypeConfig => {
  const action = defaults?.buttonAction ?? "OPEN_ONBOARDING";
  return {
    status,
    kind,
    triggerConditions: (defaults?.triggerConditions ?? []).map((condition) => ({
      condition: structuredClone(condition),
      selected: true,
    })),
    intent: defaults?.intent ?? "",
    message: "Hi {{first_name}}, welcome to {{business_name}}!",
    buttons: [{
      id: crypto.randomUUID(),
      label: defaults?.buttonActionLabel ?? getButtonActionLabel(action, []),
      action,
      buttonType: defaults?.buttonType ?? "REPLY",
      payload: {},
      labelCustomized: false,
    }],
    fallbackLanguage: defaults?.fallbackLanguage ?? "en",
    automationValues: getDefaultAutomationFromSchema(conversationSchema?.automation),
    customVariables: [],
  };
};

export const createInitialSettingsMap = (): ConversationSettingsMap => {
  const map: ConversationSettingsMap = {};
  for (const type of BUILT_IN_CONVERSATION_TYPES) {
    map[type.id] = createDefaultTypeConfig("built-in", "DRAFT");
  }
  return map;
};

export const cloneTypeConfig = (config: ConversationTypeConfig): ConversationTypeConfig =>
  structuredClone(config);

export const NO_CONVERSATION_SETTINGS_CHANGES_ERROR = "No changes to save";

export const serializeTypeConfig = (config: ConversationTypeConfig) =>
  JSON.stringify(config);

export const hasConversationSettingsChanges = (
  current: ConversationSettingsMap,
  saved: ConversationSettingsMap,
): boolean => {
  const currentIds = Object.keys(current).sort();
  const savedIds = Object.keys(saved).sort();

  if (currentIds.join(",") !== savedIds.join(",")) {
    return true;
  }

  return currentIds.some(
    (id) => serializeTypeConfig(current[id]) !== serializeTypeConfig(saved[id]),
  );
};

export const toConversationSettingsSavePayload = (
  settings: ConversationSettingsMap,
  flowSchema?: BackendSettingsSchema | null,
): ConversationSettingsSavePayload => ({
  conversations: toBackendConversationsMap(settings, flowSchema),
});

export function fromBackendConversationType(
  backendType: BackendConversationType,
  kind: "built-in" | "custom" = "built-in",
  conversationDefaults?: ConversationDefaults,
  conversationSchema?: BackendConversationSchemaMeta,
): ConversationTypeConfig {
  const config = createDefaultTypeConfig(
    kind,
    backendType.active ? "ACTIVE" : "INACTIVE",
    conversationDefaults,
    conversationSchema,
  );
  const conditions = backendType.triggerConditions === undefined
    ? config.triggerConditions.map(({ condition }) => condition)
    : getTriggerConditionOptions(backendType.triggerConditions);
  return {
    ...config,
    title: backendType.displayName,
    triggerConditions: mergeTriggerConditionOptions(
      config.triggerConditions.map(({ condition }) => condition),
      conditions,
    ).map((condition) => ({
      condition,
      selected: conditions.some((selected) => triggerConditionKey(selected) === triggerConditionKey(condition)),
    })),
    intent: backendType.intent ?? config.intent,
    message: backendType.message ?? config.message,
    buttons: backendType.buttons?.map((button) => ({
      id: crypto.randomUUID(),
      label: button.label,
      action: button.action,
      buttonType: button.type,
      payload: { ...button.payload },
      labelCustomized: true,
    })) ?? config.buttons,
    fallbackLanguage: backendType.fallbackLanguage ?? config.fallbackLanguage,
    automationValues: initAutomationValues(
      backendType.automation,
      conversationSchema?.automation,
    ),
  };
}

export const triggerConditionKey = (condition: FlowTriggerCondition): string =>
  JSON.stringify(condition);

export const mergeTriggerConditionOptions = (
  ...lists: FlowTriggerCondition[][]
): FlowTriggerCondition[] =>
  Array.from(
    new Map(
      lists.flat().map((condition) => [
        triggerConditionKey(condition),
        structuredClone(condition),
      ]),
    ).values(),
  );

export const toTriggerConditionTree = (
  conditions: FlowTriggerCondition[],
): FlowTriggerCondition | null => {
  if (!conditions.length) return null;
  if (conditions.length === 1) return structuredClone(conditions[0]);
  return { kind: "GROUP", operator: "OR", children: structuredClone(conditions) };
};

export function toBackendConversationType(
  config: ConversationTypeConfig,
  conversationSchema?: BackendConversationSchemaMeta,
  flowSchema?: BackendSettingsSchema | null,
): BackendConversationType {
  const automation = buildBackendAutomation(
    config.automationValues,
    conversationSchema?.automation,
  );
  return {
    active: config.status === "ACTIVE",
    custom: config.kind === "custom",
    triggerConditions: toTriggerConditionTree(
      config.triggerConditions.filter(({ selected }) => selected).map(({ condition }) => condition),
    ),
    ...(config.intent ? { intent: config.intent } : {}),
    message: config.message,
    buttons: config.buttons
      .filter((button) => button.label.trim() && button.action && button.buttonType)
      .map((button) => {
        const action = flowSchema?.buttonActions.find(
          (option) => option.value === button.action,
        );
        const fields = action?.payload === "NONE"
          ? []
          : action?.payloadFields ?? (button.action === "OPEN_LINK" ? [{ key: "url" }] : []);
        const payload = Object.fromEntries(
          fields.flatMap(({ key }) => {
            const value = button.payload[key];
            return value !== undefined ? [[key, value]] : [];
          }),
        );
        return {
          label: button.label.trim(),
          action: button.action,
          type: action?.type ?? button.buttonType,
          ...(fields.length ? { payload } : {}),
        };
      }),
    fallbackLanguage: config.fallbackLanguage,
    ...(automation !== undefined ? { automation } : {}),
    ...(config.kind === "custom" && config.title ? { displayName: config.title } : {}),
  };
}

export function toBackendConversationsMap(
  settings: Record<string, ConversationTypeConfig>,
  flowSchema?: BackendSettingsSchema | null,
): Record<string, BackendConversationType> {
  return Object.fromEntries(
    Object.entries(settings).map(([frontendId, config]) => [
      toBackendTypeId(frontendId),
      toBackendConversationType(
        config,
        findConversationSchema(flowSchema, frontendId),
        flowSchema,
      ),
    ]),
  );
}

export const interpolatePreviewMessage = (
  message: string,
  variables: MessageVariable[],
) => {
  let result = message;
  for (const variable of variables) {
    const sample = variable.example ?? variable.token.replace(/[{}]/g, "");
    result = result.split(variable.token).join(sample);
  }
  return result;
};

export const wrapWhatsAppMarkdown = (
  text: string,
  selectionStart: number,
  selectionEnd: number,
  wrapper: "*" | "_" | "~" | "```",
) => {
  const selected = text.slice(selectionStart, selectionEnd) || "text";
  const before = text.slice(0, selectionStart);
  const after = text.slice(selectionEnd);
  const wrapped =
    wrapper === "```"
      ? `${wrapper}${selected}${wrapper}`
      : `${wrapper}${selected}${wrapper}`;
  return {
    value: `${before}${wrapped}${after}`,
    cursorStart: before.length + wrapper.length,
    cursorEnd: before.length + wrapper.length + selected.length,
  };
};

export const countWords = (text: string) =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

export const formatKnowledgeDate = (date: Date) => {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = date.toLocaleString("en-GB", { month: "long" });
  return `${day}${suffix} ${month}, ${date.getFullYear()}`;
};

const formatConditionValue = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value !== "object") return String(value).replace(/_/g, " ").toLowerCase();
  const data = value as Record<string, unknown>;
  if (data.preset === "IN_DAYS") return `in ${data.amount} days`;
  if (data.preset === "DAYS_AGO") return `${data.amount} days ago`;
  if (data.preset) return formatConditionValue(data.preset);
  if ("from" in data || "to" in data) return `${formatConditionValue(data.from)} and ${formatConditionValue(data.to)}`;
  return Object.values(data).map(formatConditionValue).join(" ");
};

export const formatTriggerCondition = (condition: FlowTriggerCondition): string => {
  if (condition.kind === "GROUP") {
    return condition.children
      .map(formatTriggerCondition)
      .join(` ${condition.operator ?? "OR"} `);
  }
  const type = humanizeActionValue(condition.conditionType ?? "");
  const operator = (condition.conditionOperator ?? "").replace(/_/g, " ").toLowerCase();
  return [type, operator, formatConditionValue(condition.value)].filter(Boolean).join(" ");
};
