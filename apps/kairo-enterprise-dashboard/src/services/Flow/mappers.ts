import type {
  BackendConversationMemory,
  BackendEscalationIntelligence,
  BackendProactiveAssistance,
  BackendTemplate,
} from "./types";

// "financial-advice" → "financialAdvice"
export function toBackendTypeId(frontendId: string | null | undefined): string {
  if (!frontendId) return "";
  return frontendId.replace(/-([a-z])/g, (_, c: string) =>
    (c as string).toUpperCase(),
  );
}

// "financialAdvice" → "financial-advice"
export function fromBackendTypeId(backendId: string | null | undefined): string {
  if (!backendId) return "";
  return backendId.replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`);
}

export const CONVERSATION_MEMORY_KEY_MAP: Record<
  string,
  keyof BackendConversationMemory
> = {
  "onboarding-progress": "rememberOnboardingProgress",
  "preferred-language": "rememberPreferredLanguage",
  "previous-interactions": "rememberPreviousInteractions",
  "unfinished-actions": "rememberUnfinishedActions",
};

export const PROACTIVE_ASSISTANCE_KEY_MAP: Record<
  string,
  keyof BackendProactiveAssistance
> = {
  "suggest-next-actions": "suggestNextActions",
  "recommend-onboarding": "recommendOnboardingSteps",
  "remind-inactive": "remindInactiveUsers",
  "recommend-funding": "recommendWalletFunding",
};

export const ESCALATION_INTELLIGENCE_KEY_MAP: Record<
  string,
  keyof BackendEscalationIntelligence
> = {
  "detect-frustration": "detectFrustration",
  "detect-confusion": "detectRepeatedConfusion",
  "escalate-unresolved": "escalateUnresolvedIssues",
  "escalate-disputes": "escalateFinancialDisputes",
};

export function booleanObjectToArray<
  K extends Record<string, keyof T>,
  T extends Record<string, boolean>,
>(obj: T, keyMap: K): string[] {
  return (Object.entries(keyMap) as [string, keyof T][])
    .filter(([, backendKey]) => obj[backendKey])
    .map(([frontendValue]) => frontendValue);
}

export function arrayToBooleanObject<T extends Record<string, boolean>>(
  selected: string[],
  keyMap: Record<string, keyof T>,
  defaultFalse: T,
): T {
  const result = { ...defaultFalse };
  for (const value of selected) {
    const key = keyMap[value];
    if (key) (result[key] as boolean) = true;
  }
  return result;
}

// ISO language codes (e.g. "en") pass through unchanged; everything else → UPPER_SNAKE
export function toBackendEnum(value: string): string {
  if (/^[a-z]{2}(-[A-Z]{2})?$/.test(value)) return value;
  return value.toUpperCase().replace(/-/g, "_");
}

export function fromBackendEnum(value: string): string {
  if (/^[a-z]{2}(-[A-Z]{2})?$/.test(value)) return value;
  return value.toLowerCase().replace(/_/g, "-");
}

// Multi-checkbox responseStyle → single UPPER_CASE string; picks first active key
export function responseStyleToBackend(style: {
  shortReplies: boolean;
  conversational: boolean;
  detailedGuidance: boolean;
}): string {
  if (style.shortReplies) return "SHORT_REPLIES";
  if (style.conversational) return "CONVERSATIONAL";
  if (style.detailedGuidance) return "DETAILED_GUIDANCE";
  return "CONVERSATIONAL";
}

export function responseStyleFromBackend(value: string): {
  shortReplies: boolean;
  conversational: boolean;
  detailedGuidance: boolean;
} {
  return {
    shortReplies: value === "SHORT_REPLIES",
    conversational: value === "CONVERSATIONAL",
    detailedGuidance: value === "DETAILED_GUIDANCE",
  };
}

// Strips expanded, templateType, buttons[].payload; renames buttonType → type
export function toBackendTemplate(template: {
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
}): BackendTemplate {
  return {
    id: template.id,
    name: template.name,
    trigger: template.trigger,
    triggerConditions: template.triggerConditions,
    intent: template.intent,
    message: template.message,
    buttons: template.buttons.map((btn) => ({
      label: btn.label,
      action: btn.action,
      type: btn.buttonType,
    })),
    fallbackLanguage: template.fallbackLanguage,
  };
}

// Adds UI-only fields (expanded, templateType, buttons[].payload, buttons[].id)
export type FrontendAutomationSettings = {
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

export const createDefaultAutomation = (): FrontendAutomationSettings => ({
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

export function fromBackendAutomation(
  raw: Record<string, unknown> | undefined,
): FrontendAutomationSettings {
  if (!raw) return createDefaultAutomation();

  const stopRaw = raw.stopAutomation ?? raw.stopConditions;
  const retryPeriod = raw.retryPeriod as
    | { duration?: unknown; unit?: unknown }
    | undefined;
  const followUpPeriod = raw.followUpPeriod as
    | { duration?: unknown; unit?: unknown }
    | undefined;

  return {
    retryEnabled: Boolean(raw.retryEnabled),
    retryDuration: String(raw.retryDuration ?? retryPeriod?.duration ?? ""),
    retryUnit: String(raw.retryUnit ?? retryPeriod?.unit ?? ""),
    retryLimit: String(raw.retryLimit ?? ""),
    followUpEnabled: Boolean(raw.followUpEnabled),
    followUpType: String(raw.followUpType ?? ""),
    followUpFrequency: String(
      raw.followUpFrequency ?? followUpPeriod?.duration ?? "",
    ),
    followUpUnit: String(raw.followUpUnit ?? followUpPeriod?.unit ?? ""),
    stopAutomation: Array.isArray(stopRaw) ? stopRaw.map(String) : [],
  };
}

export function toBackendAutomation(
  settings: FrontendAutomationSettings,
): Record<string, unknown> {
  return {
    retryEnabled: settings.retryEnabled,
    retryDuration: settings.retryDuration,
    retryUnit: settings.retryUnit,
    retryLimit: settings.retryLimit,
    followUpEnabled: settings.followUpEnabled,
    followUpType: settings.followUpType,
    followUpFrequency: settings.followUpFrequency,
    followUpUnit: settings.followUpUnit,
    stopAutomation: settings.stopAutomation,
  };
}

export function fromBackendTemplate(t: BackendTemplate): {
  id: string;
  name: string;
  trigger: string;
  triggerConditions: string[];
  intent: string;
  templateType: string;
  message: string;
  buttons: {
    id: string;
    label: string;
    action: string;
    buttonType: string;
    payload: Record<string, unknown>;
  }[];
  fallbackLanguage: string;
  expanded: boolean;
} {
  return {
    id: t.id,
    name: t.name,
    trigger: t.trigger,
    triggerConditions: t.triggerConditions,
    intent: t.intent,
    templateType: "interactive",
    message: t.message,
    buttons: t.buttons.map((btn, i) => ({
      id: `${t.id}-btn-${i}`,
      label: btn.label,
      action: btn.action,
      buttonType: btn.type,
      payload: {},
    })),
    fallbackLanguage: t.fallbackLanguage,
    expanded: true,
  };
}
