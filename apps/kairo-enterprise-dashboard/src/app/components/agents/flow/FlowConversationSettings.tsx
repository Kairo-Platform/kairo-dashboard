"use client";

import { Icon } from "@iconify/react";
import {
  Button,
  ButtonClass,
  ButtonSize,
  Flex,
  InitialsAvatar,
  Modal,
  ModalSize,
  Tabs,
  Tag,
  TagType,
} from "@kairo/ui";
import {
  CheckboxInput,
  FormInput,
  FormTextarea,
  SelectInput,
  SwitchInput,
  SwitchInputSize,
} from "@kairo/ui/inputs";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
// Local defaults / option catalogs for conversation settings UI
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

export type SelectOption = {
  label: string;
  value: string;
};

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
  customTriggers: SelectOption[];
  customVariables: MessageVariable[];
};

export type ConversationSettingsMap = Record<
  ConversationTypeId,
  ConversationTypeConfig
>;

export const STATUS_OPTIONS: SelectOption[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

export const TRIGGER_OPTIONS: SelectOption[] = [
  { label: "User signup", value: "user-signup" },
  { label: "KYC submitted", value: "kyc-submitted" },
  { label: "Wallet funded", value: "wallet-funded" },
];

export const TRIGGER_CONDITION_OPTIONS: SelectOption[] = [
  { value: "first-time-user", label: "First-time user" },
  { value: "referred-user", label: "Referred user" },
  { value: "kyc-incomplete", label: "KYC incomplete" },
];

export const INTENT_OPTIONS: SelectOption[] = [
  { label: "Onboarding", value: "onboarding" },
  { label: "Engagement", value: "engagement" },
  { label: "Support", value: "support" },
];

export const TEMPLATE_TYPE_OPTIONS: SelectOption[] = [
  { label: "Text", value: "text" },
  { label: "Interactive", value: "interactive" },
  { label: "Media", value: "media" },
];

export const BUTTON_ACTION_OPTIONS: SelectOption[] = [
  { label: "Open URL", value: "open-url" },
  { label: "Quick reply", value: "quick-reply" },
  { label: "Call phone", value: "call-phone" },
];

/** Payload options when button action is quick-reply */
export const QUICK_REPLY_PAYLOAD_OPTIONS: SelectOption[] = [
  { label: "Get started", value: "GET_STARTED" },
  { label: "Continue", value: "CONTINUE" },
  { label: "Yes", value: "YES" },
  { label: "No", value: "NO" },
  { label: "Learn more", value: "LEARN_MORE" },
  { label: "Talk to agent", value: "TALK_TO_AGENT" },
  { label: "Opt out", value: "OPT_OUT" },
];

export const BUTTON_TYPE_OPTIONS: SelectOption[] = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
];

export const FALLBACK_LANGUAGE_OPTIONS: SelectOption[] = [
  { label: "English", value: "english" },
  { label: "Igbo", value: "igbo" },
  { label: "Yoruba", value: "yoruba" },
  { label: "Hausa", value: "hausa" },
];

export const DEFAULT_MESSAGE_VARIABLES: MessageVariable[] = [
  {
    token: "{{first_name}}",
    description: "User's first name",
    example: "Chinedu",
  },
  {
    token: "{{business_name}}",
    description: "Business name",
    example: "Kairo",
  },
  {
    token: "{{wallet_balance}}",
    description: "Current wallet balance",
    example: "₦142,500.00",
  },
  {
    token: "{{last_transaction}}",
    description: "Last transaction amount",
    example: "₦15,000",
  },
  {
    token: "{{referral_code}}",
    description: "Referral code",
    example: "KAIRO20",
  },
];

export const TIME_UNIT_OPTIONS: SelectOption[] = [
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
  { label: "Months", value: "months" },
  { label: "Years", value: "years" },
];

export const RETRY_LIMIT_OPTIONS: SelectOption[] = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "5", value: "5" },
];

export const FOLLOW_UP_TYPE_OPTIONS: SelectOption[] = [
  { label: "KYC reminder", value: "kyc-reminder" },
  { label: "Wallet funding prompt", value: "wallet-funding-prompt" },
];

export const STOP_AUTOMATION_OPTIONS: SelectOption[] = [
  { value: "onboarding-completed", label: "Onboarding completed" },
  { value: "user-opts-out", label: "User opts out" },
  { value: "account-suspended", label: "Account suspended" },
  { value: "fraud-detected", label: "Fraud detected" },
];

export const BUILT_IN_CONVERSATION_TYPES: ConversationTypeMeta[] = [
  {
    id: "onboarding",
    title: "Onboarding",
    description: "New user registration flow",
    icon: "material-symbols:person-add-outline",
    conversationsTitle: "Onboarding conversations",
    kind: "built-in",
  },
  {
    id: "welcome",
    title: "Welcome",
    description: "Returning user greeting",
    icon: "tdesign:wave-bye",
    conversationsTitle: "Welcome conversations",
    kind: "built-in",
  },
  {
    id: "checkup",
    title: "Checkup",
    description: "Periodic engagement checkup",
    icon: "solar:heart-pulse-linear",
    conversationsTitle: "Checkup conversations",
    kind: "built-in",
  },
  {
    id: "birthday",
    title: "Birthday",
    description: "Birthday wishes & offers",
    icon: "mynaui:confetti",
    conversationsTitle: "Birthday conversations",
    kind: "built-in",
  },
  {
    id: "reward",
    title: "Reward",
    description: "Milestone & cashback alert",
    icon: "solar:gift-linear",
    conversationsTitle: "Reward conversations",
    kind: "built-in",
  },
  {
    id: "transaction",
    title: "Transaction",
    description: "Transaction event notifications",
    icon: "majesticons:coins-line",
    conversationsTitle: "Transaction conversations",
    kind: "built-in",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Spend insights alerts",
    icon: "solar:chart-2-linear",
    conversationsTitle: "Analytics conversations",
    kind: "built-in",
  },
  {
    id: "financial-advice",
    title: "Financial advice",
    description: "AI advice and guidance",
    icon: "mingcute:ai-fill",
    conversationsTitle: "Financial advice conversations",
    kind: "built-in",
  },
  {
    id: "advertisement",
    title: "Advertisement",
    description: "Promotional campaigns",
    icon: "solar:megaphone-linear",
    conversationsTitle: "Advertisement conversations",
    kind: "built-in",
  },
];

export const CUSTOM_CONVERSATION_ICON = "fluent:chat-32-regular";

export const COMMON_EMOJIS = [
  "😀",
  "😁",
  "😂",
  "🙂",
  "😉",
  "😍",
  "🙌",
  "👍",
  "🎉",
  "🔥",
  "💯",
  "✨",
  "🙏",
  "💪",
  "🤝",
  "💙",
  "🧡",
  "✅",
  "📌",
  "💬",
];

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

export const createDefaultTemplate = (index: number): MessageTemplate => ({
  id: crypto.randomUUID(),
  name: `Template ${index}`,
  trigger: "user-signup",
  triggerConditions: ["first-time-user"],
  intent: "onboarding",
  templateType: "interactive",
  message: "Hi {{first_name}}, welcome to {{business_name}}!",
  buttons: [
    {
      id: crypto.randomUUID(),
      label: "Get started",
      action: "quick-reply",
      buttonType: "primary",
      payload: { replyText: "GET_STARTED" },
    },
    createEmptyButton(),
  ],
  fallbackLanguage: "english",
  expanded: true,
});

export const createDefaultTypeConfig = (
  kind: "built-in" | "custom" = "built-in",
  status: ConversationStatus = "DRAFT",
): ConversationTypeConfig => ({
  status,
  kind,
  templates: [createDefaultTemplate(1)],
  automation: createDefaultAutomation(),
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

/** API-ready type config (strips UI-only fields like `expanded`). */
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

export type ConversationSettingsSavePayload = {
  settings: Record<ConversationTypeId, ReturnType<typeof toApiTypeConfig>>;
};

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


export type FlowConversationSettingsHandle = {
  /** Returns API-shaped settings map for the parent Save settings CTA. */
  getSavePayload: () => ConversationSettingsSavePayload;
  /** Commits local draft snapshot and returns the same payload. */
  save: () => ConversationSettingsSavePayload;
};

type CustomConversationForm = {
  name: string;
  description: string;
  enableOnCreate: boolean;
};

type CatalogModal = "trigger" | "variable" | null;

const EMPTY_CUSTOM_CONVERSATION_FORM: CustomConversationForm = {
  name: "",
  description: "",
  enableOnCreate: false,
};

const DESCRIPTION_WORD_LIMIT = 10;
const MESSAGE_WORD_LIMIT = 500;

const statusTagType = (status: ConversationStatus) => {
  if (status === "ACTIVE") return TagType.GREEN;
  if (status === "INACTIVE") return TagType.RED;
  return TagType.YELLOW;
};

const statusLabel = (status: ConversationStatus) =>
  STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;

const FlowConversationSettingsContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr);
  gap: 0;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoint.xl}) {
    grid-template-columns: 1fr;
  }

  > aside:first-of-type {
    position: sticky;
    top: 1rem;
    align-self: start;
    height: fit-content;
    border-right: 1px solid ${({ theme }) => theme.colors.gray_02};

    @media (max-width: ${({ theme }) => theme.breakpoint.xl}) {
      position: static;
    }
  }

  .FlowConversationSettings__navLabel {
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_02};
    margin-block: 1rem;
  }

  .FlowConversationSettings__nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-right: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoint.xl}) {
      border-right: none;
      padding-right: 0;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }
  }

  .FlowConversationSettings__navItem {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.625rem;
      height: 2.625rem;
      border-radius: 0.5rem;
      background-color: ${({ theme }) => theme.colors.gray_02};
      color: ${({ theme }) => theme.colors.text_01};
      flex-shrink: 0;
    }

    &-title {
      display: block;
      font-size: 0.9375rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text_01};
      line-height: 1.2rem;
    }

    &-description {
      display: block;
      font-size: 0.8125rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text_02};
      line-height: 1.25rem;
    }

    &-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray_05};
    }

    &.is-active {
      background-color: ${({ theme }) => `${theme.colors.orange}0D`};
      border-left: 3px solid ${({ theme }) => theme.colors.orange};
      border-radius: 0 0.5rem 0.5rem 0;
      padding-left: calc(1rem - 3px);

      .FlowConversationSettings__navItem-icon {
        background-color: ${({ theme }) => `${theme.colors.orange}14`};
        color: ${({ theme }) => theme.colors.orange};
      }

      .FlowConversationSettings__navItem-title {
        color: ${({ theme }) => theme.colors.orangeDark};
      }
    }
  }

  .FlowConversationSettings__addConversation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.8125rem 0.625rem;
    border: none;
    border-top: 1.5px solid ${({ theme }) => theme.colors.gray_02};
    background: transparent;
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowConversationSettings__fieldHint {
    margin: 0.25rem 0 0;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25rem;
    letter-spacing: -0.008125rem;
    color: ${({ theme }) => theme.colors.text_02};
  }

  .FlowConversationSettings__modalEditor {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 0.75rem;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.ui_07};
  }

  .FlowConversationSettings__modalEnable {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowConversationSettings__customSetup {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .FlowConversationSettings__workspace {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 27rem);
    min-width: 0;

    &.is-full-width {
      grid-template-columns: 1fr;
    }

    @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
      grid-template-columns: 1fr;
    }
  }

  .FlowConversationSettings__main {
    padding: 0 1.25rem 2rem;
    min-width: 0;
  }

  .FlowConversationSettings__conversationHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 0;
  }

  .FlowConversationSettings__conversationTitle {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.875rem;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowConversationSettings__conversationDescription {
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.colors.text_02};
  }

  .FlowConversationSettings__tabsWrapper {
    .tab-content {
      margin-top: 1.5rem;
    }
  }

  .FlowConversationSettings__automation {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 32.9375rem;
  }

  .FlowConversationSettings__automationCard {
    border: 1px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 1rem;
    padding: 1.125rem 1rem;
    background-color: ${({ theme }) => theme.colors.ui_07};
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
      font-size: 0.9375rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text_01};
    }

    &-sectionTitle {
      font-size: 0.9375rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text_01};
    }

    &-fields {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: ${({ theme }) => theme.breakpoint.md}) {
        grid-template-columns: 1fr;
      }
    }
  }

  .FlowConversationSettings__automationHint {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_02};
  }

  .FlowConversationSettings__sectionHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .FlowConversationSettings__sectionTitle {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.75rem;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowConversationSettings__ghostButton {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    height: 2rem;
    padding: 0 0.625rem;
    border: 1.5px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 2.25rem;
    background: ${({ theme }) => theme.colors.ui_07};
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_01};
    cursor: pointer;
  }

  .FlowConversationSettings__templateCard {
    border: 1px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 1.25rem;
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 2.125rem;
  }

  .FlowConversationSettings__templateHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
  }

  .FlowConversationSettings__templateTitleRow {
    display: flex;
    align-items: center;
    gap: 0.8125rem;
    font-size: 1.125rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowConversationSettings__checkboxCard {
    border: 1px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 1rem;
    padding: 1rem;
    background-color: ${({ theme }) => theme.colors.ui_07};

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-bottom: 0.75rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
      font-size: 0.9375rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text_01};
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    &-selectAll {
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.orange};
    }
  }

  .FlowConversationSettings__messageEditor {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .FlowConversationSettings__messageEditorHeader {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }

  .FlowConversationSettings__messageEditorTitle {
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowConversationSettings__messageEditorDescription {
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_02};
  }

  .FlowConversationSettings__messageEditorBody {
    display: grid;
    grid-template-columns: 7.75rem minmax(0, 1fr);
    border: 1px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 0.75rem;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.ui_07};

    @media (max-width: ${({ theme }) => theme.breakpoint.md}) {
      grid-template-columns: 1fr;
    }
  }

  .FlowConversationSettings__variables {
    padding: 0.6875rem 1rem 1rem 0.5rem;
    border-right: 1px solid ${({ theme }) => theme.colors.gray_02};

    @media (max-width: ${({ theme }) => theme.breakpoint.md}) {
      border-right: none;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
      padding: 1rem;
    }

    &-title {
      font-size: 0.9375rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text_01};
      margin-bottom: 1rem;
    }

    &-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    &-item {
      border: none;
      background: transparent;
      padding: 0;
      text-align: left;
      cursor: pointer;

      &-token {
        display: block;
        font-size: 0.8125rem;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.text_01};
        line-height: 1.125rem;
      }

      &-description {
        display: block;
        font-size: 0.8125rem;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.text_02};
        line-height: 1.125rem;
      }
    }
  }

  .FlowConversationSettings__editorPane {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .FlowConversationSettings__editorToolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
  }

  .FlowConversationSettings__editorTools {
    display: flex;
    align-items: center;
    gap: 1.125rem;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowConversationSettings__editorToolsGroup {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding-right: 1.25rem;
    border-right: 1px solid ${({ theme }) => theme.colors.gray_02};
  }

  .FlowConversationSettings__wordCount {
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_02};
    white-space: nowrap;
  }

  .FlowConversationSettings__editorInput {
    position: relative;
    border-top: 1.2px solid ${({ theme }) => theme.colors.gray_04};
    padding: 0.875rem 0.875rem 2rem 0.875rem;

    textarea {
      min-height: 16rem;
      border: none;
      padding: 0;
      resize: vertical;
      box-shadow: none;
    }
  }

  .FlowConversationSettings__emojiButton {
    position: absolute;
    left: 0.6875rem;
    bottom: 0.9375rem;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.text_02};
    cursor: pointer;
    display: inline-flex;
  }

  .FlowConversationSettings__buttonsSection {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .FlowConversationSettings__buttonsCard {
    border: 1px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 0.75rem;
    padding: 1.25rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .FlowConversationSettings__buttonRow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 10rem minmax(0, 1fr) minmax(0, 1fr) auto;
    gap: 1rem;
    align-items: end;

    @media (max-width: ${({ theme }) => theme.breakpoint.md}) {
      grid-template-columns: 1fr;
    }
  }

  .FlowConversationSettings__deleteButton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.8125rem;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.text_02};
    cursor: pointer;
  }

  .FlowConversationSettings__fallbackHint {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.25rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_02};
  }

  .FlowConversationSettings__preview {
    border-left: 1px solid ${({ theme }) => theme.colors.gray_02};
    padding: 1.4375rem 1.25rem 2rem;
    min-width: 0;
    position: sticky;
    top: 1rem;
    align-self: start;
    height: fit-content;

    @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
      position: static;
      border-left: none;
      border-top: 1px solid ${({ theme }) => theme.colors.gray_02};
      padding-top: 2rem;
    }
  }

  .FlowConversationSettings__previewHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowConversationSettings__phone {
    background: ${({ theme }) => theme.colors.gray_01};
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow: 0 4px 49.6px -27px rgba(38, 16, 4, 0.06);
    max-width: 23.4375rem;
    margin: 0 auto;
  }

  .FlowConversationSettings__phoneStatusBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowConversationSettings__phoneStatusIcons {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowConversationSettings__phoneHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem 0.875rem;
    background: ${({ theme }) => theme.colors.gray_02};
    box-shadow: 0 0.33px 0 0 ${({ theme }) => theme.colors.gray_03};
  }

  .FlowConversationSettings__phoneContact {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    min-width: 0;
  }

  .FlowConversationSettings__phoneAvatar {
    flex-shrink: 0;
    display: inline-flex;

    > div {
      width: 2.25rem;
      height: 2.25rem;
    }
  }

  .FlowConversationSettings__phoneName {
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text_01};
    line-height: 1.2;
  }

  .FlowConversationSettings__phoneSubtext {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.text_02};
    line-height: 1rem;
  }

  .FlowConversationSettings__phoneActions {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: ${({ theme }) => theme.colors.blue};
  }

  .FlowConversationSettings__phoneBody {
    min-height: 30rem;
    padding: 1rem 0.875rem 1.5rem;
    background-color: ${({ theme }) => theme.colors.gray_05};
  }

  .FlowConversationSettings__phoneDate {
    width: fit-content;
    margin: 0 auto 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.gray_02};
    box-shadow: 0 0.4px 0 0 ${({ theme }) => theme.colors.gray_03};
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text_02};
  }

  .FlowConversationSettings__phoneBubble {
    max-width: 80%;
    margin-right: auto;
    padding: 0;
    border-radius: 0.75rem;
    background: ${({ theme }) => theme.colors.ui_07};
    font-size: 0.9375rem;
    line-height: 1.35;
    color: ${({ theme }) => theme.colors.text_01};
    overflow: hidden;
    box-shadow: 0 1px 1px ${({ theme }) => theme.colors.gray_03};
  }

  .FlowConversationSettings__phoneBubbleText {
    padding: 0.625rem 0.75rem;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .FlowConversationSettings__phoneBubbleActions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid ${({ theme }) => theme.colors.gray_02};

    &--single {
      grid-template-columns: 1fr;
    }

    &--odd > :last-child {
      grid-column: 1 / -1;
    }
  }

  .FlowConversationSettings__phoneBubbleAction {
    padding: 0.625rem 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.primary};
    text-align: center;
    border-right: 1px solid ${({ theme }) => theme.colors.gray_02};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};

    &:nth-child(even) {
      border-right: none;
    }
  }

  .FlowConversationSettings__phoneBubbleActions--single
    .FlowConversationSettings__phoneBubbleAction,
  .FlowConversationSettings__phoneBubbleActions--odd
    > .FlowConversationSettings__phoneBubbleAction:last-child {
    border-right: none;
  }

  .FlowConversationSettings__phoneBubbleActions
    > .FlowConversationSettings__phoneBubbleAction:last-child {
    border-bottom: none;
  }

  .FlowConversationSettings__phoneBubbleActions:not(
      .FlowConversationSettings__phoneBubbleActions--odd
    ):not(.FlowConversationSettings__phoneBubbleActions--single)
    > .FlowConversationSettings__phoneBubbleAction:nth-last-child(-n + 2) {
    border-bottom: none;
  }

  .FlowConversationSettings__phoneBubbleMeta {
    margin-top: 0.25rem;
    font-size: 0.6875rem;
    color: ${({ theme }) => theme.colors.text_03};
    text-align: left;
  }

  .FlowConversationSettings__phoneComposer {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem;
    background: ${({ theme }) => theme.colors.gray_02};
    box-shadow: 0 -0.33px 0 0 ${({ theme }) => theme.colors.gray_03};
  }

  .FlowConversationSettings__phoneInput {
    flex: 1;
    height: 2rem;
    border: 0.5px solid ${({ theme }) => theme.colors.gray_04};
    border-radius: 1rem;
    background: ${({ theme }) => theme.colors.ui_07};
    opacity: 0.45;
  }

  .FlowConversationSettings__phoneHomeIndicator {
    height: 2.125rem;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      width: 8.375rem;
      height: 0.3125rem;
      border-radius: 6.25rem;
      background: ${({ theme }) => theme.colors.text_01};
    }
  }

  .FlowConversationSettings__headerActions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .FlowConversationSettings__templateName {
    font: inherit;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_01};
    white-space: nowrap;
  }

  .FlowConversationSettings__templateNameInput {
    border: none;
    background: transparent;
    font: inherit;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_01};
    padding: 0;
    width: max-content;
    max-width: 100%;
    field-sizing: content;

    &:focus {
      outline: none;
      border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
    }
  }

  .FlowConversationSettings__templateEditButton {
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.text_02};
    cursor: pointer;
    display: inline-flex;
    padding: 0.125rem;
    border-radius: 0.25rem;

    &:hover {
      color: ${({ theme }) => theme.colors.text_01};
    }
  }

  .FlowConversationSettings__templateToggle {
    border: none;
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    color: ${({ theme }) => theme.colors.text_01};
    transition: transform 0.15s ease;

    &.is-expanded {
      transform: rotate(180deg);
    }
  }

  .FlowConversationSettings__toolbarButton {
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    padding: 0;
  }

  .FlowConversationSettings__emojiPopover {
    position: absolute;
    left: 0.5rem;
    bottom: 2.5rem;
    z-index: 5;
    display: grid;
    grid-template-columns: repeat(5, 1.75rem);
    gap: 0.25rem;
    padding: 0.5rem;
    border-radius: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.gray_02};
    background: ${({ theme }) => theme.colors.ui_07};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .FlowConversationSettings__emojiOption {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.125rem;
    line-height: 1.75rem;
    border-radius: 0.375rem;

    &:hover {
      background: ${({ theme }) => theme.colors.gray_01};
    }
  }

  .FlowConversationSettings__templatesList {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`

type FlowConversationSettingsProps = {
  initialConversationType?: ConversationTypeId;
};

const handleSelectValue = (value: string | { value: string }): string =>
  value && typeof value === "object" && "value" in value
    ? String(value.value)
    : String(value ?? "");

const buttonPayloadPlaceholder = (action: string) => {
  if (action === "open-url") return "https://example.com";
  if (action === "call-phone") return "+2348000000000";
  return "Select reply";
};

const buttonPayloadValue = (button: TemplateButton) => {
  if (button.action === "open-url") return button.payload.url ?? "";
  if (button.action === "call-phone") return button.payload.phoneNumber ?? "";
  return button.payload.replyText ?? "";
};

const payloadFromAction = (
  action: string,
  value: string,
): TemplateButton["payload"] => {
  if (action === "open-url") return { url: value };
  if (action === "call-phone") return { phoneNumber: value };
  return { replyText: value };
};

export const FlowConversationSettings = forwardRef<
  FlowConversationSettingsHandle,
  FlowConversationSettingsProps
>(function FlowConversationSettings(
  { initialConversationType = "onboarding" },
  ref,
) {
  const [typeCatalog, setTypeCatalog] = useState<ConversationTypeMeta[]>(
    BUILT_IN_CONVERSATION_TYPES,
  );
  const [settings, setSettings] = useState(createInitialSettingsMap);
  const [savedSettings, setSavedSettings] = useState(() => {
    const initial = createInitialSettingsMap();
    const cloned: Record<string, ConversationTypeConfig> = {};
    for (const [id, config] of Object.entries(initial)) {
      cloned[id] = cloneTypeConfig(config);
    }
    return cloned;
  });
  const [activeTypeId, setActiveTypeId] = useState<ConversationTypeId>(
    initialConversationType,
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
    null,
  );
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null,
  );
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState<CustomConversationForm>(
    EMPTY_CUSTOM_CONVERSATION_FORM,
  );
  const [catalogModal, setCatalogModal] = useState<CatalogModal>(null);
  const [catalogLabel, setCatalogLabel] = useState("");
  const [catalogToken, setCatalogToken] = useState("");
  const [emojiOpenFor, setEmojiOpenFor] = useState<string | null>(null);
  const messageRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const nameInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const activeType =
    typeCatalog.find((type) => type.id === activeTypeId) ?? typeCatalog[0];
  const activeConfig =
    settings[activeTypeId] ?? createDefaultTypeConfig(activeType.kind);

  useImperativeHandle(ref, () => ({
    getSavePayload: () =>
      toConversationSettingsSavePayload(settingsRef.current),
    save: () => {
      const snapshot: Record<string, ConversationTypeConfig> = {};
      for (const [id, config] of Object.entries(settingsRef.current)) {
        snapshot[id] = cloneTypeConfig(config);
      }
      setSavedSettings(snapshot);
      return toConversationSettingsSavePayload(settingsRef.current);
    },
  }));

  const messageVariables = useMemo(
    () => [...DEFAULT_MESSAGE_VARIABLES, ...activeConfig.customVariables],
    [activeConfig.customVariables],
  );

  const triggerOptions = useMemo(
    () => [...TRIGGER_OPTIONS, ...activeConfig.customTriggers],
    [activeConfig.customTriggers],
  );

  const triggerConditionOptions = useMemo(
    () => [
      ...TRIGGER_CONDITION_OPTIONS,
      ...activeConfig.customTriggers.map((option) => ({
        value: option.value,
        label: option.label,
      })),
    ],
    [activeConfig.customTriggers],
  );

  const previewTemplate =
    activeConfig.templates.find((template) => template.id === previewTemplateId) ??
    activeConfig.templates.find((template) => template.expanded) ??
    activeConfig.templates[0];

  const previewMessage = interpolatePreviewMessage(
    previewTemplate?.message?.trim() || "Write a personalised message here....",
    messageVariables,
  );

  const previewButtons =
    previewTemplate?.templateType === "interactive"
      ? previewTemplate.buttons.filter((button) => button.label.trim())
      : [];

  const customDescriptionWordCount = countWords(customForm.description);
  const canAddCustomConversation =
    customForm.name.trim().length > 0 &&
    customDescriptionWordCount <= DESCRIPTION_WORD_LIMIT;

  const updateActiveConfig = (
    updater: (config: ConversationTypeConfig) => ConversationTypeConfig,
  ) => {
    setSettings((prev) => {
      const current =
        prev[activeTypeId] ?? createDefaultTypeConfig(activeType.kind);
      return {
        ...prev,
        [activeTypeId]: updater(cloneTypeConfig(current)),
      };
    });
  };

  const updateTemplateById = (
    templateId: string,
    updates: Partial<MessageTemplate>,
  ) => {
    updateActiveConfig((config) => ({
      ...config,
      templates: config.templates.map((template) =>
        template.id === templateId ? { ...template, ...updates } : template,
      ),
    }));
    if (updates.message !== undefined || updates.buttons !== undefined) {
      setPreviewTemplateId(templateId);
    }
  };

  const updateAutomation = (updates: Partial<AutomationSettings>) => {
    updateActiveConfig((config) => ({
      ...config,
      automation: { ...config.automation, ...updates },
    }));
  };

  const openAddCustomModal = () => {
    setCustomForm(EMPTY_CUSTOM_CONVERSATION_FORM);
    setShowAddCustomModal(true);
  };

  const closeAddCustomModal = () => {
    setShowAddCustomModal(false);
    setCustomForm(EMPTY_CUSTOM_CONVERSATION_FORM);
  };

  const handleAddCustomConversation = () => {
    if (!canAddCustomConversation) return;

    const title = customForm.name.trim();
    const description = customForm.description.trim() || "Custom conversation";
    const id = `cnv_custom_${crypto.randomUUID()}`;
    const status: ConversationStatus = customForm.enableOnCreate
      ? "ACTIVE"
      : "DRAFT";

    const meta: ConversationTypeMeta = {
      id,
      title,
      description,
      icon: CUSTOM_CONVERSATION_ICON,
      conversationsTitle: title,
      kind: "custom",
    };

    const config = createDefaultTypeConfig("custom", status);
    config.title = title;
    config.description = description;

    setTypeCatalog((prev) => [...prev, meta]);
    setSettings((prev) => ({ ...prev, [id]: config }));
    setSavedSettings((prev) => ({ ...prev, [id]: cloneTypeConfig(config) }));
    setActiveTypeId(id);
    setActiveTabIndex(0);
    setPreviewTemplateId(config.templates[0]?.id ?? null);
    closeAddCustomModal();
  };

  const handleSelectConversationType = (typeId: ConversationTypeId) => {
    setActiveTypeId(typeId);
    setActiveTabIndex(0);
    setEmojiOpenFor(null);
    setEditingTemplateId(null);
    const next = settings[typeId];
    setPreviewTemplateId(next?.templates[0]?.id ?? null);
  };

  const handleEnabledToggle = (enabled: boolean) => {
    updateActiveConfig((config) => ({
      ...config,
      status: enabled ? "ACTIVE" : "INACTIVE",
    }));
  };

  const handleAddTemplate = () => {
    const next = createDefaultTemplate(activeConfig.templates.length + 1);
    updateActiveConfig((config) => ({
      ...config,
      templates: [
        ...config.templates.map((template) => ({
          ...template,
          expanded: false,
        })),
        next,
      ],
    }));
    setPreviewTemplateId(next.id);
    setEditingTemplateId(null);
  };

  const toggleTemplateExpanded = (templateId: string) => {
    updateActiveConfig((config) => ({
      ...config,
      templates: config.templates.map((template) =>
        template.id === templateId
          ? { ...template, expanded: !template.expanded }
          : template,
      ),
    }));
    setPreviewTemplateId(templateId);
  };

  const startEditingTemplateName = (templateId: string) => {
    setEditingTemplateId(templateId);
    requestAnimationFrame(() => {
      const input = nameInputRefs.current[templateId];
      if (!input) return;
      input.focus();
      input.select();
    });
  };

  const updateTemplateButton = (
    templateId: string,
    buttonId: string,
    updates: Partial<TemplateButton>,
  ) => {
    const template = activeConfig.templates.find((item) => item.id === templateId);
    if (!template) return;
    updateTemplateById(templateId, {
      buttons: template.buttons.map((button) =>
        button.id === buttonId ? { ...button, ...updates } : button,
      ),
    });
  };

  const addTemplateButton = (templateId: string) => {
    const template = activeConfig.templates.find((item) => item.id === templateId);
    if (!template) return;
    updateTemplateById(templateId, {
      buttons: [...template.buttons, createEmptyButton()],
    });
  };

  const removeTemplateButton = (templateId: string, buttonId: string) => {
    const template = activeConfig.templates.find((item) => item.id === templateId);
    if (!template || template.buttons.length <= 1) return;
    updateTemplateById(templateId, {
      buttons: template.buttons.filter((button) => button.id !== buttonId),
    });
  };

  const insertAtCursor = (templateId: string, insertion: string) => {
    const textarea = messageRefs.current[templateId];
    const template = activeConfig.templates.find((item) => item.id === templateId);
    if (!template) return;

    if (!textarea) {
      updateTemplateById(templateId, {
        message: `${template.message}${template.message ? " " : ""}${insertion}`,
      });
      return;
    }

    const start = textarea.selectionStart ?? template.message.length;
    const end = textarea.selectionEnd ?? template.message.length;
    const next = `${template.message.slice(0, start)}${insertion}${template.message.slice(end)}`;
    updateTemplateById(templateId, { message: next });

    requestAnimationFrame(() => {
      const node = messageRefs.current[templateId];
      if (!node) return;
      const cursor = start + insertion.length;
      node.focus();
      node.setSelectionRange(cursor, cursor);
    });
  };

  const applyMarkdown = (
    templateId: string,
    wrapper: "*" | "_" | "~" | "```",
  ) => {
    const textarea = messageRefs.current[templateId];
    const template = activeConfig.templates.find((item) => item.id === templateId);
    if (!template) return;

    const start = textarea?.selectionStart ?? 0;
    const end = textarea?.selectionEnd ?? 0;
    const next = wrapWhatsAppMarkdown(template.message, start, end, wrapper);
    updateTemplateById(templateId, { message: next.value });

    requestAnimationFrame(() => {
      const node = messageRefs.current[templateId];
      if (!node) return;
      node.focus();
      node.setSelectionRange(next.cursorStart, next.cursorEnd);
    });
  };

  const openCatalogModal = (kind: "trigger" | "variable") => {
    setCatalogLabel("");
    setCatalogToken("");
    setCatalogModal(kind);
  };

  const closeCatalogModal = () => {
    setCatalogModal(null);
    setCatalogLabel("");
    setCatalogToken("");
  };

  const handleAddCatalogItem = () => {
    if (!catalogModal) return;
    const label = catalogLabel.trim();
    if (!label) return;

    if (catalogModal === "trigger") {
      const value = label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (!value) return;
      const option: SelectOption = { label, value };
      updateActiveConfig((config) => ({
        ...config,
        customTriggers: [...config.customTriggers, option],
      }));
      closeCatalogModal();
      return;
    }

    const tokenRaw = (catalogToken.trim() || label)
      .replace(/[{}]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();
    const token = `{{${tokenRaw}}}`;
    const variable: MessageVariable = {
      token,
      description: label,
      example: tokenRaw,
    };
    updateActiveConfig((config) => ({
      ...config,
      customVariables: [...config.customVariables, variable],
    }));
    closeCatalogModal();
  };

  const allStopAutomationSelected =
    activeConfig.automation.stopAutomation.length ===
    STOP_AUTOMATION_OPTIONS.length;

  const handleSelectAllStopAutomation = () => {
    updateAutomation({
      stopAutomation: allStopAutomationSelected
        ? []
        : STOP_AUTOMATION_OPTIONS.map((option) => option.value),
    });
  };

  const setMessageRef =
    (templateId: string) => (node: HTMLTextAreaElement | null) => {
      messageRefs.current[templateId] = node;
    };

  const renderMessageEditor = (template: MessageTemplate) => {
    const wordCount = countWords(template.message);
    const allTriggerConditionsSelected =
      template.triggerConditions.length === triggerConditionOptions.length;

    return (
      <div className="FlowConversationSettings__templateCard" key={template.id}>
        <div className="FlowConversationSettings__templateHeader">
          <div className="FlowConversationSettings__templateTitleRow">
            {editingTemplateId === template.id ? (
              <input
                ref={(node) => {
                  nameInputRefs.current[template.id] = node;
                }}
                className="FlowConversationSettings__templateNameInput"
                value={template.name}
                aria-label="Template name"
                onChange={(event) =>
                  updateTemplateById(template.id, { name: event.target.value })
                }
                onBlur={() => setEditingTemplateId(null)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === "Escape") {
                    setEditingTemplateId(null);
                  }
                }}
              />
            ) : (
              <span className="FlowConversationSettings__templateName">
                {template.name}
              </span>
            )}
            <button
              type="button"
              className="FlowConversationSettings__templateEditButton"
              aria-label="Edit template name"
              onClick={(event) => {
                event.stopPropagation();
                startEditingTemplateName(template.id);
              }}
            >
              <Icon icon="mi:edit" width={16} height={16} />
            </button>
          </div>
          <button
            type="button"
            className={`FlowConversationSettings__templateToggle${template.expanded ? " is-expanded" : ""
              }`}
            aria-label={template.expanded ? "Collapse template" : "Expand template"}
            aria-expanded={template.expanded}
            onClick={() => toggleTemplateExpanded(template.id)}
          >
            <Icon icon="iconamoon:arrow-down-2-light" width={24} height={24} />
          </button>
        </div>

        {template.expanded && (
          <>
            <SelectInput
              label="Trigger"
              placeholder="Select trigger"
              options={triggerOptions}
              value={template.trigger}
              onChange={(val: string | { value: string }) =>
                updateTemplateById(template.id, {
                  trigger: handleSelectValue(val),
                })
              }
            />

            <div className="FlowConversationSettings__checkboxCard">
              <div className="FlowConversationSettings__checkboxCard-header">
                <span>Trigger conditions</span>
                <div className="FlowConversationSettings__checkboxCard-actions">
                  <button
                    type="button"
                    className="FlowConversationSettings__ghostButton"
                    onClick={() => openCatalogModal("trigger")}
                  >
                    Add custom trigger
                  </button>
                  <button
                    type="button"
                    className="FlowConversationSettings__checkboxCard-selectAll"
                    onClick={() =>
                      updateTemplateById(template.id, {
                        triggerConditions: allTriggerConditionsSelected
                          ? []
                          : triggerConditionOptions.map((option) => option.value),
                      })
                    }
                  >
                    {allTriggerConditionsSelected ? "Clear" : "Select all"}
                  </button>
                </div>
              </div>
              <CheckboxInput
                name={`triggerConditions-${template.id}`}
                options={triggerConditionOptions}
                value={template.triggerConditions}
                onChange={(values) =>
                  updateTemplateById(template.id, {
                    triggerConditions: values,
                  })
                }
                direction="column"
              />
            </div>

            <SelectInput
              label="Intent"
              placeholder="Select intent"
              options={INTENT_OPTIONS}
              value={template.intent}
              onChange={(val: string | { value: string }) =>
                updateTemplateById(template.id, {
                  intent: handleSelectValue(val),
                })
              }
            />

            <SelectInput
              label="Template type"
              placeholder="Select type"
              options={TEMPLATE_TYPE_OPTIONS}
              value={template.templateType}
              onChange={(val: string | { value: string }) =>
                updateTemplateById(template.id, {
                  templateType: handleSelectValue(val),
                })
              }
            />

            <div className="FlowConversationSettings__messageEditor">
              <div className="FlowConversationSettings__messageEditorHeader">
                <div>
                  <p className="FlowConversationSettings__messageEditorTitle">
                    Message editor
                  </p>
                  <p className="FlowConversationSettings__messageEditorDescription">
                    Use {"{{variables}}"} and WhatsApp markdown (*bold*, _italic_,
                    ~strike~, monospace).
                  </p>
                </div>
                <button
                  type="button"
                  className="FlowConversationSettings__ghostButton"
                  style={{ minWidth: "fit-content" }}
                  onClick={() => openCatalogModal("variable")}
                >
                  <Icon icon="basil:plus-outline" width={16} height={16} />
                  Add custom variable
                </button>
              </div>

              <div className="FlowConversationSettings__messageEditorBody">
                <div className="FlowConversationSettings__variables">
                  <p className="FlowConversationSettings__variables-title">
                    Insert variable
                  </p>
                  <div className="FlowConversationSettings__variables-list">
                    {messageVariables.map((variable) => (
                      <button
                        key={variable.token}
                        type="button"
                        className="FlowConversationSettings__variables-item"
                        onClick={() =>
                          insertAtCursor(template.id, variable.token)
                        }
                      >
                        <span className="FlowConversationSettings__variables-item-token">
                          {variable.token}
                        </span>
                        <span className="FlowConversationSettings__variables-item-description">
                          {variable.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="FlowConversationSettings__editorPane">
                  <div className="FlowConversationSettings__editorToolbar">
                    <div className="FlowConversationSettings__editorTools">
                      <div className="FlowConversationSettings__editorToolsGroup">
                        <button
                          type="button"
                          className="FlowConversationSettings__toolbarButton"
                          aria-label="Bold"
                          onClick={() => applyMarkdown(template.id, "*")}
                        >
                          <Icon icon="octicon:bold-16" width={16} height={16} />
                        </button>
                        <button
                          type="button"
                          className="FlowConversationSettings__toolbarButton"
                          aria-label="Italic"
                          onClick={() => applyMarkdown(template.id, "_")}
                        >
                          <Icon icon="tabler:italic" width={16} height={16} />
                        </button>
                        <button
                          type="button"
                          className="FlowConversationSettings__toolbarButton"
                          aria-label="Strikethrough"
                          onClick={() => applyMarkdown(template.id, "~")}
                        >
                          <Icon
                            icon="material-symbols:format-strikethrough"
                            width={16}
                            height={16}
                          />
                        </button>
                        <button
                          type="button"
                          className="FlowConversationSettings__toolbarButton"
                          aria-label="Monospace"
                          onClick={() => applyMarkdown(template.id, "```")}
                        >
                          <Icon
                            icon="material-symbols:code"
                            width={16}
                            height={16}
                          />
                        </button>
                      </div>
                    </div>
                    <span className="FlowConversationSettings__wordCount">
                      {wordCount}/{MESSAGE_WORD_LIMIT} words
                    </span>
                  </div>

                  <div className="FlowConversationSettings__editorInput">
                    <FormTextarea
                      name={`message-${template.id}`}
                      value={template.message}
                      onChange={(event) =>
                        updateTemplateById(template.id, {
                          message: event.target.value,
                        })
                      }
                      onFocus={() => setPreviewTemplateId(template.id)}
                      placeholder="Write a personalised message here...."
                      rows={10}
                      ref={setMessageRef(template.id)}
                    />
                    {emojiOpenFor === template.id && (
                      <div className="FlowConversationSettings__emojiPopover">
                        {COMMON_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className="FlowConversationSettings__emojiOption"
                            onClick={() => {
                              insertAtCursor(template.id, emoji);
                              setEmojiOpenFor(null);
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      className="FlowConversationSettings__emojiButton"
                      aria-label="Insert emoji"
                      onClick={() =>
                        setEmojiOpenFor((current) =>
                          current === template.id ? null : template.id,
                        )
                      }
                    >
                      <Icon icon="mingcute:emoji-line" width={16} height={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="FlowConversationSettings__buttonsSection">
              <div className="FlowConversationSettings__sectionHeader">
                <p className="FlowConversationSettings__messageEditorTitle">
                  Button
                </p>
                <button
                  type="button"
                  className="FlowConversationSettings__ghostButton"
                  onClick={() => addTemplateButton(template.id)}
                >
                  <Icon icon="basil:plus-outline" width={16} height={16} />
                  Add button
                </button>
              </div>

              <div className="FlowConversationSettings__buttonsCard">
                {template.buttons.map((button, index) => (
                  <div
                    key={button.id}
                    className="FlowConversationSettings__buttonRow"
                  >
                    <FormInput
                      label={index === 0 ? "Button label" : undefined}
                      name={`button-label-${button.id}`}
                      value={button.label}
                      onChange={(event) =>
                        updateTemplateButton(template.id, button.id, {
                          label: event.target.value,
                        })
                      }
                      placeholder="Enter label"
                    />
                    <SelectInput
                      label={index === 0 ? "Action" : undefined}
                      placeholder="Select action"
                      options={BUTTON_ACTION_OPTIONS}
                      value={button.action}
                      onChange={(val: string | { value: string }) => {
                        const action = handleSelectValue(val);
                        const previous = buttonPayloadValue({
                          ...button,
                          action,
                        });
                        const nextValue =
                          action === "quick-reply"
                            ? previous ||
                            QUICK_REPLY_PAYLOAD_OPTIONS[0]?.value ||
                            "GET_STARTED"
                            : previous;
                        updateTemplateButton(template.id, button.id, {
                          action,
                          payload: payloadFromAction(action, nextValue),
                        });
                      }}
                    />
                    <SelectInput
                      label={index === 0 ? "Button type" : undefined}
                      placeholder="Select type"
                      options={BUTTON_TYPE_OPTIONS}
                      value={button.buttonType}
                      onChange={(val: string | { value: string }) =>
                        updateTemplateButton(template.id, button.id, {
                          buttonType: handleSelectValue(val),
                        })
                      }
                    />
                    {button.action === "quick-reply" ? (
                      <SelectInput
                        label={index === 0 ? "Payload" : undefined}
                        placeholder="Select reply"
                        options={QUICK_REPLY_PAYLOAD_OPTIONS}
                        value={buttonPayloadValue(button)}
                        onChange={(val: string | { value: string }) =>
                          updateTemplateButton(template.id, button.id, {
                            payload: payloadFromAction(
                              button.action,
                              handleSelectValue(val),
                            ),
                          })
                        }
                      />
                    ) : (
                      <FormInput
                        label={index === 0 ? "Payload" : undefined}
                        name={`button-payload-${button.id}`}
                        value={buttonPayloadValue(button)}
                        onChange={(event) =>
                          updateTemplateButton(template.id, button.id, {
                            payload: payloadFromAction(
                              button.action,
                              event.target.value,
                            ),
                          })
                        }
                        placeholder={buttonPayloadPlaceholder(button.action)}
                      />
                    )}
                    <button
                      type="button"
                      className="FlowConversationSettings__deleteButton"
                      aria-label="Delete button"
                      onClick={() =>
                        removeTemplateButton(template.id, button.id)
                      }
                    >
                      <Icon
                        icon="fluent:delete-12-regular"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SelectInput
                label="Fall back language"
                placeholder="Select language"
                options={FALLBACK_LANGUAGE_OPTIONS}
                value={template.fallbackLanguage}
                onChange={(val: string | { value: string }) =>
                  updateTemplateById(template.id, {
                    fallbackLanguage: handleSelectValue(val),
                  })
                }
              />
              <div className="FlowConversationSettings__fallbackHint">
                <Icon icon="si:warning-line" width={16} height={16} />
                Used when selected language is unavailable.
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <FlowConversationSettingsContainer>
      <aside>
        <p className="FlowConversationSettings__navLabel">Conversation types</p>
        <nav
          className="FlowConversationSettings__nav"
          aria-label="Conversation types"
        >
          {typeCatalog.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`FlowConversationSettings__navItem${activeTypeId === type.id ? " is-active" : ""
                }`}
              onClick={() => handleSelectConversationType(type.id)}
            >
              <span className="FlowConversationSettings__navItem-icon">
                <Icon icon={type.icon} width={20} height={20} />
              </span>
              <span className="FlowConversationSettings__navItem-text">
                <span className="FlowConversationSettings__navItem-title">
                  {type.title}
                </span>
                <span className="FlowConversationSettings__navItem-description">
                  {type.description}
                </span>
              </span>
            </button>
          ))}
          <button
            type="button"
            className="FlowConversationSettings__addConversation"
            onClick={openAddCustomModal}
          >
            <Icon icon="basil:plus-solid" width={16} height={16} />
            Add custom conversation
          </button>
        </nav>
      </aside>

      <div
        className={`FlowConversationSettings__workspace${activeTabIndex === 1 ? " is-full-width" : ""
          }`}
      >
        <div className="FlowConversationSettings__main">
          <div className="FlowConversationSettings__conversationHeader">
            <Flex align="flex-start" gap="0.75rem">
              <div>
                <h3 className="FlowConversationSettings__conversationTitle">
                  {activeType.kind === "custom"
                    ? activeType.title
                    : activeType.conversationsTitle}
                </h3>
                <p className="FlowConversationSettings__conversationDescription">
                  {activeType.description}
                </p>
              </div>
              <Tag
                type={statusTagType(activeConfig.status)}
                style={{ height: "1.5625rem" }}
              >
                {statusLabel(activeConfig.status)}
              </Tag>
            </Flex>
            <div className="FlowConversationSettings__headerActions">
              <SwitchInput
                size={SwitchInputSize.SMALL}
                value={activeConfig.status === "ACTIVE"}
                onChange={handleEnabledToggle}
                name="conversationActive"
              />
            </div>
          </div>

          <Tabs
            tabsWrapperClassName="FlowConversationSettings__tabsWrapper"
            activeTabIndex={activeTabIndex}
            onActiveTabChange={setActiveTabIndex}
            tabs={[
              {
                title: "Messaging setup",
                content: (
                  <>
                    <div className="FlowConversationSettings__sectionHeader">
                      <h4 className="FlowConversationSettings__sectionTitle">
                        Setup {activeType.title.toLowerCase()} template
                      </h4>
                      <button
                        type="button"
                        className="FlowConversationSettings__ghostButton"
                        onClick={handleAddTemplate}
                      >
                        <Icon icon="basil:plus-solid" width={16} height={16} />
                        Add template
                      </button>
                    </div>

                    <div className="FlowConversationSettings__templatesList">
                      {activeConfig.templates.map((template) =>
                        renderMessageEditor(template),
                      )}
                    </div>
                  </>
                ),
              },
              {
                title: "Automation",
                content: (
                  <div className="FlowConversationSettings__automation">
                    <div className="FlowConversationSettings__automationCard">
                      <div className="FlowConversationSettings__automationCard-header">
                        <span>Retry unanswered messages</span>
                        <SwitchInput
                          size={SwitchInputSize.SMALL}
                          value={activeConfig.automation.retryEnabled}
                          onChange={(value) =>
                            updateAutomation({ retryEnabled: value })
                          }
                          name="retryEnabled"
                        />
                      </div>

                      {activeConfig.automation.retryEnabled && (
                        <div className="FlowConversationSettings__automationCard-fields">
                          <p className="FlowConversationSettings__automationCard-sectionTitle">
                            Retry period
                          </p>
                          <div className="FlowConversationSettings__automationCard-row">
                            <FormInput
                              label="Duration"
                              name="retryDuration"
                              value={activeConfig.automation.retryDuration}
                              onChange={(event) =>
                                updateAutomation({
                                  retryDuration: event.target.value,
                                })
                              }
                              placeholder="Enter duration"
                            />
                            <SelectInput
                              label="Unit"
                              placeholder="Select unit"
                              options={TIME_UNIT_OPTIONS}
                              value={activeConfig.automation.retryUnit}
                              onChange={(val: string | { value: string }) =>
                                updateAutomation({
                                  retryUnit: handleSelectValue(val),
                                })
                              }
                            />
                          </div>
                          <SelectInput
                            label="Retry Limit"
                            placeholder="Enter limit"
                            options={RETRY_LIMIT_OPTIONS}
                            value={activeConfig.automation.retryLimit}
                            onChange={(val: string | { value: string }) =>
                              updateAutomation({
                                retryLimit: handleSelectValue(val),
                              })
                            }
                          />
                          <div className="FlowConversationSettings__automationHint">
                            <Icon icon="si:warning-line" width={16} height={16} />
                            This does not apply to WhatsApp; it only applies to
                            other social media channels.
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="FlowConversationSettings__automationCard">
                      <div className="FlowConversationSettings__automationCard-header">
                        <span>Automated Follow-Ups</span>
                        <SwitchInput
                          size={SwitchInputSize.SMALL}
                          value={activeConfig.automation.followUpEnabled}
                          onChange={(value) =>
                            updateAutomation({ followUpEnabled: value })
                          }
                          name="followUpEnabled"
                        />
                      </div>

                      {activeConfig.automation.followUpEnabled && (
                        <div className="FlowConversationSettings__automationCard-fields">
                          <SelectInput
                            label="Follow-up type"
                            placeholder="Select type"
                            options={FOLLOW_UP_TYPE_OPTIONS}
                            value={activeConfig.automation.followUpType}
                            onChange={(val: string | { value: string }) =>
                              updateAutomation({
                                followUpType: handleSelectValue(val),
                              })
                            }
                          />
                          <div className="FlowConversationSettings__automationCard-row">
                            <FormInput
                              label="Frequency"
                              name="followUpFrequency"
                              value={activeConfig.automation.followUpFrequency}
                              onChange={(event) =>
                                updateAutomation({
                                  followUpFrequency: event.target.value,
                                })
                              }
                              placeholder="Enter frequency"
                            />
                            <SelectInput
                              label="Unit"
                              placeholder="Select unit"
                              options={TIME_UNIT_OPTIONS}
                              value={activeConfig.automation.followUpUnit}
                              onChange={(val: string | { value: string }) =>
                                updateAutomation({
                                  followUpUnit: handleSelectValue(val),
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="FlowConversationSettings__checkboxCard">
                      <div className="FlowConversationSettings__checkboxCard-header">
                        <span>Stop automation when</span>
                        <button
                          type="button"
                          className="FlowConversationSettings__checkboxCard-selectAll"
                          onClick={handleSelectAllStopAutomation}
                        >
                          {allStopAutomationSelected ? "Clear" : "Select all"}
                        </button>
                      </div>
                      <CheckboxInput
                        name="stopAutomation"
                        options={STOP_AUTOMATION_OPTIONS}
                        value={activeConfig.automation.stopAutomation}
                        onChange={(values) =>
                          updateAutomation({ stopAutomation: values })
                        }
                        direction="column"
                      />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {activeTabIndex === 0 && (
          <aside className="FlowConversationSettings__preview">
            <div className="FlowConversationSettings__previewHeader">
              <span>Live preview</span>
              <Icon
                icon="fluent:window-column-one-fourth-left-20-regular"
                width={20}
                height={20}
              />
            </div>

            <div className="FlowConversationSettings__phone">
              <div className="FlowConversationSettings__phoneStatusBar">
                <span>9:41</span>
                <div className="FlowConversationSettings__phoneStatusIcons">
                  <Icon icon="mdi:signal-cellular-3" width={16} height={16} />
                  <Icon icon="mdi:wifi" width={16} height={16} />
                  <Icon icon="mdi:battery" width={18} height={18} />
                </div>
              </div>

              <div className="FlowConversationSettings__phoneHeader">
                <div className="FlowConversationSettings__phoneContact">
                  <Icon icon="mdi:chevron-left" width={20} height={20} />
                  <span className="FlowConversationSettings__phoneAvatar">
                    <InitialsAvatar
                      name="Kairo"
                      avatarUrl="/kairo-assets/kairo-icon-white.svg"
                    />
                  </span>
                  <div>
                    <p className="FlowConversationSettings__phoneName">Kairo</p>
                    <p className="FlowConversationSettings__phoneSubtext">
                      tap here for contact info
                    </p>
                  </div>
                </div>
                <div className="FlowConversationSettings__phoneActions">
                  <Icon icon="mdi:video-outline" width={20} height={20} />
                  <Icon icon="mdi:phone-outline" width={20} height={20} />
                </div>
              </div>

              <div className="FlowConversationSettings__phoneBody">
                <div className="FlowConversationSettings__phoneDate">Today</div>
                {previewTemplate?.message.trim() ? (
                  <div>
                    <div className="FlowConversationSettings__phoneBubble">
                      <div className="FlowConversationSettings__phoneBubbleText">
                        {previewMessage}
                      </div>
                      {previewButtons.length > 0 && (
                        <div
                          className={`FlowConversationSettings__phoneBubbleActions${previewButtons.length === 1
                              ? " FlowConversationSettings__phoneBubbleActions--single"
                              : ""
                            }${previewButtons.length > 1 &&
                              previewButtons.length % 2 === 1
                              ? " FlowConversationSettings__phoneBubbleActions--odd"
                              : ""
                            }`}
                        >
                          {previewButtons.map((button) => (
                            <div
                              key={button.id}
                              className="FlowConversationSettings__phoneBubbleAction"
                            >
                              {button.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="FlowConversationSettings__phoneBubbleMeta">
                      17:47
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="FlowConversationSettings__phoneComposer">
                <Icon icon="mdi:plus" width={18} height={18} color="#8e8e93" />
                <div className="FlowConversationSettings__phoneInput" />
                <Icon
                  icon="mdi:sticker-emoji"
                  width={18}
                  height={18}
                  color="#8e8e93"
                />
                <Icon
                  icon="mdi:camera-outline"
                  width={20}
                  height={20}
                  color="#8e8e93"
                />
                <Icon
                  icon="mdi:microphone-outline"
                  width={20}
                  height={20}
                  color="#8e8e93"
                />
              </div>

              <div className="FlowConversationSettings__phoneHomeIndicator">
                <span />
              </div>
            </div>
          </aside>
        )}
      </div>

      {showAddCustomModal && (
        <Modal
          title="Add custom conversation"
          onClose={closeAddCustomModal}
          size={ModalSize.MEDIUM}
          Footer={() => (
            <Flex
              gap="0.75rem"
              align="center"
              justify="flex-end"
              style={{ marginTop: "1rem" }}
            >
              <Button
                classes={[ButtonClass.OUTLINED]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={closeAddCustomModal}
              >
                Cancel
              </Button>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={handleAddCustomConversation}
                disabled={!canAddCustomConversation}
              >
                Add
              </Button>
            </Flex>
          )}
        >
          <Flex direction="column" gap="1rem">
            <FormInput
              label="Conversation name"
              name="customConversationName"
              placeholder="Enter conversation name"
              value={customForm.name}
              onChange={(event) =>
                setCustomForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />

            <div>
              <FormInput
                label="Description"
                name="customConversationDescription"
                placeholder="Enter description"
                value={customForm.description}
                onChange={(event) =>
                  setCustomForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
              />
              <p className="FlowConversationSettings__fieldHint">
                {DESCRIPTION_WORD_LIMIT} words max
                {customDescriptionWordCount > DESCRIPTION_WORD_LIMIT
                  ? ` · ${customDescriptionWordCount}/${DESCRIPTION_WORD_LIMIT}`
                  : ""}
              </p>
            </div>

            <Flex
              justify="space-between"
              align="center"
              gap="1rem"
              style={{ marginTop: "0.5rem" }}
              className="FlowConversationSettings__modalEnable"
            >
              <span>Enable conversation upon creation</span>
              <SwitchInput
                size={SwitchInputSize.SMALL}
                value={customForm.enableOnCreate}
                onChange={(value) =>
                  setCustomForm((prev) => ({
                    ...prev,
                    enableOnCreate: value,
                  }))
                }
                name="enableCustomConversation"
              />
            </Flex>
          </Flex>
        </Modal>
      )}

      {catalogModal && (
        <Modal
          title={
            catalogModal === "trigger"
              ? "Add custom trigger"
              : "Add custom variable"
          }
          onClose={closeCatalogModal}
          size={ModalSize.SMALL}
          Footer={() => (
            <Flex
              gap="0.75rem"
              align="center"
              justify="flex-end"
              style={{ marginTop: "1rem" }}
            >
              <Button
                classes={[ButtonClass.OUTLINED]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={closeCatalogModal}
              >
                Cancel
              </Button>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={handleAddCatalogItem}
                disabled={!catalogLabel.trim()}
              >
                Add
              </Button>
            </Flex>
          )}
        >
          <Flex direction="column" gap="1rem">
            <FormInput
              label={catalogModal === "trigger" ? "Trigger label" : "Description"}
              name="catalogLabel"
              placeholder={
                catalogModal === "trigger"
                  ? "e.g. Chargeback opened"
                  : "e.g. Support ticket id"
              }
              value={catalogLabel}
              onChange={(event) => setCatalogLabel(event.target.value)}
            />
            {catalogModal === "variable" && (
              <FormInput
                label="Token (optional)"
                name="catalogToken"
                placeholder="ticket_id"
                value={catalogToken}
                onChange={(event) => setCatalogToken(event.target.value)}
              />
            )}
          </Flex>
        </Modal>
      )}
    </FlowConversationSettingsContainer>
  );
});

export default FlowConversationSettings;
