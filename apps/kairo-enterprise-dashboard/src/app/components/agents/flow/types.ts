import type { ReactNode } from "react";

export type FlowCheckboxOption = {
  value: string;
  label: string;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type GeneralSettingsSection =
  | "setup"
  | "ai-behaviour"
  | "guardrails"
  | "knowledge";

export type KnowledgeItem = {
  id: string;
  type: "file" | "note";
  name: string;
  subtitle: string;
  dateAdded: string;
  content?: string;
};

export type GeneralSettingsNavSection = {
  id: GeneralSettingsSection;
  title: string;
  description: string;
  icon: string;
};

export type FlowChannel = {
  id: string;
  name: string;
  icon: string | ReactNode;
  isConnected: boolean;
  brandColor?: string;
};

export type FlowInfrastructure = {
  id: string;
  name: string;
  description?: string;
  isConnected: boolean;
};

export type ConversationStatus = "DRAFT" | "ACTIVE" | "INACTIVE";

export type BuiltInConversationTypeId =
  | "onboarding"
  | "welcome"
  | "checkup"
  | "birthday"
  | "reward"
  | "transaction"
  | "analytics"
  | "financial-advice"
  | "advertisement";

export type ConversationTypeId = BuiltInConversationTypeId | string;

export type MessageVariable = {
  token: string;
  description: string;
  example?: string;
};

export type TemplateButtonPayload = {
  url?: string;
  replyText?: string;
  phoneNumber?: string;
};

export type TemplateButton = {
  id: string;
  label: string;
  action: string;
  buttonType: string;
  payload: TemplateButtonPayload;
};

export type MessageTemplate = {
  id: string;
  name: string;
  trigger: string;
  triggerConditions: string[];
  intent: string;
  templateType: string;
  message: string;
  buttons: TemplateButton[];
  fallbackLanguage: string;
  expanded: boolean;
};

export type AutomationSettings = {
  retryEnabled: boolean;
  retryDuration: string;
  retryUnit: string;
  retryLimit: string;
  followUpEnabled: boolean;
  followUpType: string;
  followUpFrequency: string;
  followUpUnit: string;
  stopAutomation: string[];
};

export type ConversationTypeMeta = {
  id: ConversationTypeId;
  title: string;
  description: string;
  icon: string;
  conversationsTitle: string;
  kind: "built-in" | "custom";
};

export type ConversationTypeConfig = {
  status: ConversationStatus;
  kind: "built-in" | "custom";
  title?: string;
  description?: string;
  templates: MessageTemplate[];
  automation: AutomationSettings;
  backendAutomation?: Record<string, unknown>;
  customTriggers: SelectOption[];
  customVariables: MessageVariable[];
};

export type ConversationSettingsMap = Record<
  ConversationTypeId,
  ConversationTypeConfig
>;

export type TemplateDefaults = {
  trigger?: string;
  triggerCondition?: string;
  intent?: string;
  fallbackLanguage?: string;
  buttonAction?: string;
  buttonType?: string;
  quickReplyAction?: string;
};

export type ConversationSettingsSavePayload = {
  settings: Record<
    ConversationTypeId,
    {
      status: ConversationStatus;
      kind: "built-in" | "custom";
      title?: string;
      description?: string;
      templates: Omit<MessageTemplate, "expanded">[];
      automation: AutomationSettings;
      customTriggers: SelectOption[];
      customVariables: MessageVariable[];
    }
  >;
};

export type FlowConversationSettingsHandle = {
  getSavePayload: () => ConversationSettingsSavePayload;
  save: () => Promise<ConversationSettingsSavePayload>;
};
