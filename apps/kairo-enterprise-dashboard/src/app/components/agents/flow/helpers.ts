import {
  buildBackendAutomation,
  findConversationSchema,
  fromBackendTemplate,
  getDefaultAutomationFromSchema,
  initAutomationValues,
  normalizeTemplateForSave,
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
  MessageTemplate,
  MessageVariable,
  TemplateButton,
  TemplateDefaults,
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

export const createEmptyButton = (): TemplateButton => ({
  id: crypto.randomUUID(),
  label: "",
  action: "",
  buttonType: "",
  payload: {},
  labelCustomized: false,
});

export const createDefaultTemplate = (
  index: number,
  defaults?: TemplateDefaults,
): MessageTemplate => {
  const action =
    defaults?.quickReplyAction ??
    defaults?.buttonAction ??
    "OPEN_ONBOARDING";

  return {
    id: crypto.randomUUID(),
    name: `Template ${index}`,
    trigger: defaults?.trigger ?? "",
    triggerConditions: defaults?.triggerCondition
      ? [defaults.triggerCondition]
      : [],
    intent: defaults?.intent ?? "",
    templateType: defaults?.templateType ?? "",
    message: "Hi {{first_name}}, welcome to {{business_name}}!",
    buttons: [
      {
        id: crypto.randomUUID(),
        label:
          defaults?.buttonActionLabel ??
          getButtonActionLabel(action, []),
        action,
        buttonType: defaults?.buttonType ?? "REPLY",
        payload: {
          replyText: action,
        },
        labelCustomized: false,
      },
    ],
    fallbackLanguage: defaults?.fallbackLanguage ?? "en",
    expanded: true,
  };
};

export const createDefaultTypeConfig = (
  kind: "built-in" | "custom" = "built-in",
  status: ConversationStatus = "DRAFT",
  templateDefaults?: TemplateDefaults,
  conversationSchema?: BackendConversationSchemaMeta,
): ConversationTypeConfig => ({
  status,
  kind,
  templates: [createDefaultTemplate(1, templateDefaults)],
  templatesSeededForUi: true,
  automationValues: getDefaultAutomationFromSchema(conversationSchema?.automation),
  customTriggerConditions: [],
  customVariables: [],
});

export const createInitialSettingsMap = (): ConversationSettingsMap => {
  const map: ConversationSettingsMap = {};
  for (const type of BUILT_IN_CONVERSATION_TYPES) {
    map[type.id] = createDefaultTypeConfig("built-in", "DRAFT");
  }
  return map;
};

export const cloneTypeConfig = (
  config: ConversationTypeConfig,
): ConversationTypeConfig => ({
  ...config,
  templates: config.templates.map((template) => ({
    ...template,
    triggerConditions: [...template.triggerConditions],
    buttons: template.buttons.map((button) => ({
      ...button,
      payload: { ...button.payload },
    })),
  })),
  automationValues: cloneAutomationValues(config.automationValues),
  templatesSeededForUi: config.templatesSeededForUi,
  customTriggerConditions: config.customTriggerConditions.map((option) => ({
    ...option,
  })),
  customVariables: config.customVariables.map((variable) => ({ ...variable })),
});

export const NO_CONVERSATION_SETTINGS_CHANGES_ERROR = "No changes to save";

export const serializeTypeConfig = (config: ConversationTypeConfig) =>
  JSON.stringify({
    status: config.status,
    kind: config.kind,
    title: config.title,
    description: config.description,
    templatesSeededForUi: config.templatesSeededForUi ?? false,
    templates: config.templates.map(({ expanded: _expanded, ...template }) => ({
      ...template,
      triggerConditions: [...template.triggerConditions].sort(),
      buttons: template.buttons.map((button) => ({
        ...button,
        payload: { ...button.payload },
      })),
    })),
    automationValues: cloneAutomationValues(config.automationValues),
    customTriggerConditions: [...config.customTriggerConditions]
      .map((option) => option.value)
      .sort(),
    customVariables: [...config.customVariables]
      .map((variable) => variable.token)
      .sort(),
  });

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

export const toApiTypeConfig = (config: ConversationTypeConfig) => ({
  status: config.status,
  kind: config.kind,
  ...(config.title !== undefined ? { title: config.title } : {}),
  ...(config.description !== undefined
    ? { description: config.description }
    : {}),
  templates: config.templates.map(({ expanded: _expanded, ...template }) => ({
    ...template,
    buttons: template.buttons.map((button) => ({
      ...button,
      payload: { ...button.payload },
    })),
  })),
  automationValues: cloneAutomationValues(config.automationValues),
  customTriggerConditions: config.customTriggerConditions.map((option) => ({
    ...option,
  })),
  customVariables: config.customVariables.map((variable) => ({ ...variable })),
});

export const toConversationSettingsSavePayload = (
  settings: ConversationSettingsMap,
): ConversationSettingsSavePayload => ({
  settings: Object.fromEntries(
    Object.entries(settings).map(([id, config]) => [
      id,
      toApiTypeConfig(config),
    ]),
  ),
});

export function fromBackendConversationType(
  backendType: BackendConversationType,
  kind: "built-in" | "custom" = "built-in",
  templateDefaults?: TemplateDefaults,
  conversationSchema?: BackendConversationSchemaMeta,
): ConversationTypeConfig {
  const mappedTemplates = (backendType.templates ?? []).map(
    (t) => fromBackendTemplate(t) as MessageTemplate,
  );

  const hadBackendTemplates = (backendType.templates ?? []).length > 0;

  return {
    status: backendType.active ? "ACTIVE" : "INACTIVE",
    kind,
    title: backendType.displayName,
    description: undefined,
    templates:
      mappedTemplates.length > 0
        ? mappedTemplates
        : [createDefaultTemplate(1, templateDefaults)],
    templatesSeededForUi: !hadBackendTemplates,
    automationValues: initAutomationValues(
      backendType.automation,
      conversationSchema?.automation,
    ),
    customTriggerConditions: [],
    customVariables: [],
  };
}

export function toBackendConversationType(
  config: ConversationTypeConfig,
  conversationSchema?: BackendConversationSchemaMeta,
): BackendConversationType {
  const automation = buildBackendAutomation(
    config.automationValues,
    conversationSchema?.automation,
  );

  const templates = config.templatesSeededForUi
    ? []
    : config.templates.map((template) =>
        normalizeTemplateForSave(
          template,
          conversationSchema,
          config.customTriggerConditions,
        ),
      );

  return {
    active: config.status === "ACTIVE",
    custom: config.kind === "custom",
    templates,
    ...(automation !== undefined ? { automation } : {}),
    ...(config.kind === "custom" && config.title
      ? { displayName: config.title }
      : {}),
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
