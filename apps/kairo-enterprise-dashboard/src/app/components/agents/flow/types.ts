import { FlowTriggerCondition } from "@/services/Flow/types";
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

export type ConversationButtonPayload = {
  [key: string]: string | undefined;
};

export type ConversationButton = {
  id: string;
  label: string;
  action: string;
  buttonType: string;
  payload: ConversationButtonPayload;
  // When true, label is not auto-synced from the selected action
  labelCustomized?: boolean;
};

export type ConversationTriggerCondition = {
  condition: FlowTriggerCondition;
  selected: boolean;
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
  triggerConditions: ConversationTriggerCondition[];
  intent: string;
  message: string;
  buttons: ConversationButton[];
  fallbackLanguage: string;
  automationValues: Record<string, unknown>;
  customVariables: MessageVariable[];
};

export type ConversationSettingsMap = Record<
  ConversationTypeId,
  ConversationTypeConfig
>;

export type ConversationDefaults = {
  triggerConditions?: FlowTriggerCondition[];
  intent?: string;
  fallbackLanguage?: string;
  buttonAction?: string;
  buttonType?: string;
  buttonActionLabel?: string;
  quickReplyAction?: string;
};

export type ConversationSettingsSavePayload = {
  conversations: Record<string, import("@/services/Flow").BackendConversationType>;
};

export type FlowConversationSettingsHandle = {
  getSavePayload: () => ConversationSettingsSavePayload;
  hasUnsavedChanges: () => boolean;
  discardChanges: () => void;
  save: () => Promise<ConversationSettingsSavePayload>;
};
