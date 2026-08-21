import {
  fromBackendAutomation,
  fromBackendTemplate,
  toBackendAutomation,
  toBackendTemplate,
  toBackendTypeId,
  type BackendConversationType,
} from "@/services/Flow";
import { BUILT_IN_CONVERSATION_TYPES, CHANNEL_BRAND_COLORS } from "./resources";
import type {
  AutomationSettings,
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

export const createDefaultAutomation = (): AutomationSettings => ({
  retryEnabled: false,
  retryDuration: "",
  retryUnit: "",
  retryLimit: "",
  followUpEnabled: false,
  followUpType: "",
  followUpFrequency: "",
  followUpUnit: "",
  stopAutomation: [],
});

export const createEmptyButton = (): TemplateButton => ({
  id: crypto.randomUUID(),
  label: "",
  action: "",
  buttonType: "",
  payload: {},
});

export const createDefaultTemplate = (
  index: number,
  defaults?: TemplateDefaults,
): MessageTemplate => ({
  id: crypto.randomUUID(),
  name: `Template ${index}`,
  trigger: defaults?.trigger ?? "FIRST_TIME_USER",
  triggerConditions: defaults?.triggerCondition
    ? [defaults.triggerCondition]
    : [],
  intent: defaults?.intent ?? "",
  templateType: "interactive",
  message: "Hi {{first_name}}, welcome to {{business_name}}!",
  buttons: [
    {
      id: crypto.randomUUID(),
      label: "Get started",
      action:
        defaults?.quickReplyAction ??
        defaults?.buttonAction ??
        "OPEN_ONBOARDING",
      buttonType: defaults?.buttonType ?? "REPLY",
      payload: {
        replyText:
          defaults?.quickReplyAction ??
          defaults?.buttonAction ??
          "OPEN_ONBOARDING",
      },
    },
    createEmptyButton(),
  ],
  fallbackLanguage: defaults?.fallbackLanguage ?? "en",
  expanded: true,
});

export const createDefaultTypeConfig = (
  kind: "built-in" | "custom" = "built-in",
  status: ConversationStatus = "DRAFT",
  templateDefaults?: TemplateDefaults,
): ConversationTypeConfig => ({
  status,
  kind,
  templates: [createDefaultTemplate(1, templateDefaults)],
  automation: createDefaultAutomation(),
  backendAutomation: undefined,
  customTriggers: [],
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
  automation: {
    ...config.automation,
    stopAutomation: [...config.automation.stopAutomation],
  },
  backendAutomation: config.backendAutomation
    ? { ...config.backendAutomation }
    : undefined,
  customTriggers: config.customTriggers.map((option) => ({ ...option })),
  customVariables: config.customVariables.map((variable) => ({ ...variable })),
});

export const serializeTypeConfig = (config: ConversationTypeConfig) =>
  JSON.stringify({
    status: config.status,
    kind: config.kind,
    title: config.title,
    description: config.description,
    templates: config.templates.map(({ expanded: _expanded, ...template }) => ({
      ...template,
      triggerConditions: [...template.triggerConditions].sort(),
      buttons: template.buttons.map((button) => ({
        ...button,
        payload: { ...button.payload },
      })),
    })),
    automation: {
      ...config.automation,
      stopAutomation: [...config.automation.stopAutomation].sort(),
    },
    customTriggers: [...config.customTriggers]
      .map((option) => option.value)
      .sort(),
    customVariables: [...config.customVariables]
      .map((variable) => variable.token)
      .sort(),
  });

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
  automation: {
    ...config.automation,
    stopAutomation: [...config.automation.stopAutomation],
  },
  customTriggers: config.customTriggers.map((option) => ({ ...option })),
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
): ConversationTypeConfig {
  const mappedTemplates = (backendType.templates ?? []).map(
    (t) => fromBackendTemplate(t) as MessageTemplate,
  );

  return {
    status: backendType.active ? "ACTIVE" : "INACTIVE",
    kind,
    title: backendType.displayName,
    description: undefined,
    templates:
      mappedTemplates.length > 0
        ? mappedTemplates
        : [createDefaultTemplate(1, templateDefaults)],
    automation: fromBackendAutomation(backendType.automation),
    backendAutomation: backendType.automation
      ? { ...backendType.automation }
      : undefined,
    customTriggers: [],
    customVariables: [],
  };
}

export function toBackendConversationType(
  config: ConversationTypeConfig,
): BackendConversationType {
  return {
    active: config.status === "ACTIVE",
    custom: config.kind === "custom",
    templates: config.templates.map((t) => toBackendTemplate(t)),
    automation: toBackendAutomation(
      config.automation,
      config.backendAutomation,
    ),
    ...(config.kind === "custom" && config.title
      ? { displayName: config.title }
      : {}),
  };
}

export function toBackendConversationsMap(
  settings: Record<string, ConversationTypeConfig>,
): Record<string, BackendConversationType> {
  return Object.fromEntries(
    Object.entries(settings).map(([frontendId, config]) => [
      toBackendTypeId(frontendId),
      toBackendConversationType(config),
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
