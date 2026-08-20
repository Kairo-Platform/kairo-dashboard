export type BackendButton = {
  label: string;
  action: string;
  type: string;
};

export type BackendTemplate = {
  id: string;
  name: string;
  trigger: string;
  triggerConditions: string[];
  intent: string;
  message: string;
  buttons: BackendButton[];
  fallbackLanguage: string;
};

export type BackendConversationType = {
  active: boolean;
  custom: boolean;
  templates: BackendTemplate[];
  automation?: Record<string, unknown>;
  displayName?: string;
};

export type BackendGeneralSetup = {
  tone: string;
  languages: string[];
  voiceToTextResponse: boolean;
};

export type BackendConversationMemory = {
  rememberOnboardingProgress: boolean;
  rememberPreferredLanguage: boolean;
  rememberPreviousInteractions: boolean;
  rememberUnfinishedActions: boolean;
};

export type BackendProactiveAssistance = {
  suggestNextActions: boolean;
  recommendOnboardingSteps: boolean;
  remindInactiveUsers: boolean;
  recommendWalletFunding: boolean;
};

export type BackendEscalationIntelligence = {
  detectFrustration: boolean;
  detectRepeatedConfusion: boolean;
  escalateUnresolvedIssues: boolean;
  escalateFinancialDisputes: boolean;
};

export type BackendAiBehaviour = {
  conversationMemory: BackendConversationMemory;
  memoryRetentionPeriod: { duration: number; unit: string };
  proactiveAssistance: BackendProactiveAssistance;
  escalationIntelligence: BackendEscalationIntelligence;
  responseStyle: string;
};

export type BackendGuardrails = {
  restrictedTopics: string[];
  escalationConditions: string[];
  requireApprovalFor: string[];
  responseRestrictions: string[];
  behaviorDetection: string[];
};

export type BackendSettings = {
  schemaVersion?: number;
  general: {
    setup: BackendGeneralSetup;
    aiBehaviour: BackendAiBehaviour;
    guardrails: BackendGuardrails;
    knowledgeBase: { items: unknown[] };
  };
  conversations: Record<string, BackendConversationType>;
};

export type BackendChannel = {
  webhookId: string;
  channel: string;
  externalId?: string;
  status: "CONNECTED" | "DISCONNECTED" | string;
};

export type BackendWhatsAppConnectRequest = {
  phoneNumberId: string;
  phoneNumber: string;
  whatsappBusinessAccountId: string;
  accessToken: string;
  appSecret: string;
  verifyToken?: string;
};

export type BackendWhatsAppConnectResponse = {
  status: string;
  webhookUrl: string;
  verifyToken: string;
  publicKey: string;
};

export type BackendChannelConfigEntry = {
  key: string;
  displayName: string;
  value: string;
  sensitive: boolean;
};

export type BackendChannelConfig = {
  channel: string;
  entries: BackendChannelConfigEntry[];
};

export type BackendSchemaOption = {
  value: string;
  label: string;
};

export type BackendGuardrailField = {
  field: string;
  label: string;
  kind: "MULTI_SELECT" | string;
  options: BackendSchemaOption[];
  allowsCustom: boolean;
};

export type BackendConversationSchemaMeta = {
  typeId?: string;
  type?: string;
  id?: string;
  label?: string;
  name?: string;
  displayName?: string;
  triggers?: BackendSchemaOption[];
  triggerConditions?: BackendSchemaOption[];
  intents?: BackendSchemaOption[];
  variables?: BackendSchemaOption[];
  automation?: BackendSchemaOption[];
};

export type BackendSettingsSchema = {
  tones: BackendSchemaOption[];
  responseStyles: BackendSchemaOption[];
  retentionUnits: BackendSchemaOption[];
  languages: BackendSchemaOption[];
  guardrails: BackendGuardrailField[];
  buttonActions: BackendSchemaOption[];
  buttonTypes: BackendSchemaOption[];
  commonVariables: { token: string; description: string; sample: string }[];
  conversations: BackendConversationSchemaMeta[];
};
