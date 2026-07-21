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
import { useMemo, useState } from "react";
import styled from "styled-components";

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

type ConversationType = {
  id: ConversationTypeId;
  title: string;
  description: string;
  icon: string;
  conversationsTitle: string;
  isCustom?: boolean;
  enabled?: boolean;
  intent?: string;
  condition?: string;
  message?: string;
  action?: string;
  otherwise?: string;
};

type CustomConversationForm = {
  name: string;
  description: string;
  intent: string;
  condition: string;
  message: string;
  action: string;
  otherwise: string;
  enableOnCreate: boolean;
};

type TemplateButton = {
  id: string;
  label: string;
  action: string;
  buttonType: string;
};

type MessageTemplate = {
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

type MessageVariable = {
  token: string;
  description: string;
};

type AutomationSettings = {
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

const CONVERSATION_TYPES: ConversationType[] = [
  {
    id: "onboarding",
    title: "Onboarding",
    description: "New user registration flow",
    icon: "material-symbols:person-add-outline",
    conversationsTitle: "Onboarding conversations",
  },
  {
    id: "welcome",
    title: "Welcome",
    description: "Returning user greeting",
    icon: "tdesign:wave-bye",
    conversationsTitle: "Welcome conversations",
  },
  {
    id: "checkup",
    title: "Checkup",
    description: "New user registration flow",
    icon: "solar:heart-pulse-linear",
    conversationsTitle: "Checkup conversations",
  },
  {
    id: "birthday",
    title: "Birthday",
    description: "New user registration flow",
    icon: "mynaui:confetti",
    conversationsTitle: "Birthday conversations",
  },
  {
    id: "reward",
    title: "Reward",
    description: "Milestone & cashback alert",
    icon: "solar:gift-linear",
    conversationsTitle: "Reward conversations",
  },
  {
    id: "transaction",
    title: "Transaction",
    description: "Transaction event notifications",
    icon: "majesticons:coins-line",
    conversationsTitle: "Transaction conversations",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Transaction event notifications",
    icon: "solar:chart-2-linear",
    conversationsTitle: "Analytics conversations",
  },
  {
    id: "financial-advice",
    title: "Financial advice",
    description: "AI advice and guidance",
    icon: "mingcute:ai-fill",
    conversationsTitle: "Financial advice conversations",
  },
  {
    id: "advertisement",
    title: "Advertisement",
    description: "AI advice and guidance",
    icon: "solar:megaphone-linear",
    conversationsTitle: "Advertisement conversations",
  },
];

const TRIGGER_OPTIONS = [
  { label: "User signup", value: "user-signup" },
  { label: "KYC submitted", value: "kyc-submitted" },
  { label: "Wallet funded", value: "wallet-funded" },
];

const TRIGGER_CONDITION_OPTIONS = [
  { value: "first-time-user", label: "First-time user" },
  { value: "referred-user", label: "Referred user" },
  { value: "kyc-incomplete", label: "KYC incomplete" },
];

const INTENT_OPTIONS = [
  { label: "Onboarding", value: "onboarding" },
  { label: "Engagement", value: "engagement" },
  { label: "Support", value: "support" },
];

const TEMPLATE_TYPE_OPTIONS = [
  { label: "Text", value: "text" },
  { label: "Interactive", value: "interactive" },
  { label: "Media", value: "media" },
];

const BUTTON_ACTION_OPTIONS = [
  { label: "Open URL", value: "open-url" },
  { label: "Quick reply", value: "quick-reply" },
  { label: "Call phone", value: "call-phone" },
];

const BUTTON_TYPE_OPTIONS = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
];

const FALLBACK_LANGUAGE_OPTIONS = [
  { label: "English", value: "english" },
  { label: "Igbo", value: "igbo" },
  { label: "Yoruba", value: "yoruba" },
  { label: "Hausa", value: "hausa" },
];

const MESSAGE_VARIABLES: MessageVariable[] = [
  { token: "{{first_name}}", description: "User's first name" },
  { token: "{{business_name}}", description: "Business name" },
  { token: "{{wallet_balance}}", description: "Current wallet balance" },
  { token: "{{last_transaction}}", description: "Last transaction amount" },
  { token: "{{referral_code}}", description: "Referral code" },
];

const TIME_UNIT_OPTIONS = [
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
  { label: "Months", value: "months" },
  { label: "Years", value: "years" },
];

const RETRY_LIMIT_OPTIONS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "5", value: "5" },
];

const FOLLOW_UP_TYPE_OPTIONS = [
  { label: "KYC reminder", value: "kyc-reminder" },
  { label: "Wallet funding prompt", value: "wallet-funding-prompt" },
];

const STOP_AUTOMATION_OPTIONS = [
  { value: "onboarding-completed", label: "Onboarding completed" },
  { value: "user-opts-out", label: "User opts out" },
  { value: "account-suspended", label: "Account suspended" },
  { value: "fraud-detected", label: "Fraud detected" },
];

const createDefaultAutomation = (): AutomationSettings => ({
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

const createEmptyButton = (): TemplateButton => ({
  id: crypto.randomUUID(),
  label: "",
  action: "",
  buttonType: "",
});

const createDefaultTemplate = (index: number): MessageTemplate => ({
  id: crypto.randomUUID(),
  name: `Template ${index}`,
  trigger: "",
  triggerConditions: [],
  intent: "",
  templateType: "",
  message: "",
  buttons: [createEmptyButton(), createEmptyButton()],
  fallbackLanguage: "",
  expanded: true,
});

const countWords = (text: string) =>
  text.trim() ? text.trim().split(/\s+/).length : 0;

const EMPTY_CUSTOM_CONVERSATION_FORM: CustomConversationForm = {
  name: "",
  description: "",
  intent: "",
  condition: "",
  message: "",
  action: "",
  otherwise: "",
  enableOnCreate: false,
};

const CUSTOM_CONVERSATION_ICON = "fluent:chat-32-regular";
const DESCRIPTION_WORD_LIMIT = 10;
const MESSAGE_WORD_LIMIT = 500;

const FlowConversationSettingsContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr);
  gap: 0;
  margin-top: 1.5rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoint.xl}) {
    grid-template-columns: 1fr;
  }

  .FlowConversationSettings__navLabel {
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_02};
    margin-bottom: 1rem;
  }

  .FlowConversationSettings__nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-right: 1rem;
    border-right: 1px solid ${({ theme }) => theme.colors.gray_02};

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
    grid-template-columns: 7.375rem minmax(0, 1fr);
    border: 1px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 0.75rem;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.ui_07};

    @media (max-width: ${({ theme }) => theme.breakpoint.md}) {
      grid-template-columns: 1fr;
    }
  }

  .FlowConversationSettings__variables {
    padding: 0.6875rem 1rem 1rem 0;
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
    grid-template-columns: minmax(0, 1fr) 10rem minmax(0, 1fr) auto;
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
    min-height: 25rem;
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
    padding: 0.625rem 0.75rem;
    border-radius: 0.75rem;
    background: ${({ theme }) => theme.colors.ui_07};
    font-size: 0.9375rem;
    line-height: 1.35;
    color: ${({ theme }) => theme.colors.text_01};
    white-space: pre-wrap;
    word-break: break-word;
    box-shadow: 0 1px 1px ${({ theme }) => theme.colors.gray_03};
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
`;

type FlowConversationSettingsProps = {
  initialConversationType?: ConversationTypeId;
};

export const FlowConversationSettings = ({
  initialConversationType = "onboarding",
}: FlowConversationSettingsProps) => {
  const [conversationTypes, setConversationTypes] =
    useState<ConversationType[]>(CONVERSATION_TYPES);
  const [activeTypeId, setActiveTypeId] =
    useState<ConversationTypeId>(initialConversationType);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    createDefaultTemplate(1),
  ]);
  const [automation, setAutomation] = useState<AutomationSettings>(
    createDefaultAutomation,
  );
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState<CustomConversationForm>(
    EMPTY_CUSTOM_CONVERSATION_FORM,
  );

  const activeType = useMemo(
    () =>
      conversationTypes.find((type) => type.id === activeTypeId) ??
      conversationTypes[0],
    [activeTypeId, conversationTypes],
  );

  const activeTemplate = templates[0];
  const isCustomType = Boolean(activeType?.isCustom);

  const customDescriptionWordCount = countWords(customForm.description);
  const customMessageWordCount = countWords(customForm.message);
  const canAddCustomConversation =
    customForm.name.trim().length > 0 &&
    customDescriptionWordCount <= DESCRIPTION_WORD_LIMIT &&
    customMessageWordCount <= MESSAGE_WORD_LIMIT;

  const updateCustomForm = (updates: Partial<CustomConversationForm>) => {
    setCustomForm((prev) => ({ ...prev, ...updates }));
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
    const description = customForm.description.trim();
    const newType: ConversationType = {
      id: crypto.randomUUID(),
      title,
      description: description || "Custom conversation",
      icon: CUSTOM_CONVERSATION_ICON,
      conversationsTitle: title,
      isCustom: true,
      enabled: customForm.enableOnCreate,
      intent: customForm.intent.trim(),
      condition: customForm.condition.trim(),
      message: customForm.message,
      action: customForm.action.trim(),
      otherwise: customForm.otherwise.trim(),
    };

    setConversationTypes((prev) => [...prev, newType]);
    setActiveTypeId(newType.id);
    setIsActive(customForm.enableOnCreate);
    setActiveTabIndex(0);
    closeAddCustomModal();
  };

  const updateActiveCustomType = (updates: Partial<ConversationType>) => {
    setConversationTypes((prev) =>
      prev.map((type) =>
        type.id === activeTypeId ? { ...type, ...updates } : type,
      ),
    );
  };

  const handleSelectConversationType = (type: ConversationType) => {
    setActiveTypeId(type.id);
    setIsActive(type.enabled ?? true);
    setActiveTabIndex(0);
  };

  const handleToggleActive = (checked: boolean) => {
    setIsActive(checked);
    if (isCustomType) {
      updateActiveCustomType({ enabled: checked });
    }
  };

  const handleSelectValue = (
    value: string | { value: string },
  ): string =>
    value && typeof value === "object" && "value" in value
      ? String(value.value)
      : String(value ?? "");

  const updateTemplate = (updates: Partial<MessageTemplate>) => {
    setTemplates((prev) =>
      prev.map((template, index) =>
        index === 0 ? { ...template, ...updates } : template,
      ),
    );
  };

  const updateTemplateButton = (
    buttonId: string,
    updates: Partial<TemplateButton>,
  ) => {
    updateTemplate({
      buttons: activeTemplate.buttons.map((button) =>
        button.id === buttonId ? { ...button, ...updates } : button,
      ),
    });
  };

  const addTemplateButton = () => {
    updateTemplate({
      buttons: [...activeTemplate.buttons, createEmptyButton()],
    });
  };

  const removeTemplateButton = (buttonId: string) => {
    if (activeTemplate.buttons.length <= 1) return;
    updateTemplate({
      buttons: activeTemplate.buttons.filter((button) => button.id !== buttonId),
    });
  };

  const insertVariable = (token: string) => {
    updateTemplate({
      message: `${activeTemplate.message}${activeTemplate.message ? " " : ""}${token}`,
    });
  };

  const allTriggerConditionsSelected =
    activeTemplate.triggerConditions.length ===
    TRIGGER_CONDITION_OPTIONS.length;

  const handleSelectAllTriggerConditions = () => {
    updateTemplate({
      triggerConditions: allTriggerConditionsSelected
        ? []
        : TRIGGER_CONDITION_OPTIONS.map((option) => option.value),
    });
  };

  const updateAutomation = (updates: Partial<AutomationSettings>) => {
    setAutomation((prev) => ({ ...prev, ...updates }));
  };

  const allStopAutomationSelected =
    automation.stopAutomation.length === STOP_AUTOMATION_OPTIONS.length;

  const handleSelectAllStopAutomation = () => {
    updateAutomation({
      stopAutomation: allStopAutomationSelected
        ? []
        : STOP_AUTOMATION_OPTIONS.map((option) => option.value),
    });
  };

  const previewMessage = isCustomType
    ? activeType.message?.trim() || "Write your personalized message here..."
    : activeTemplate.message.trim() ||
    "Write a personalised message here....";

  const wordCount = isCustomType
    ? countWords(activeType.message ?? "")
    : countWords(activeTemplate.message);

  return (
    <FlowConversationSettingsContainer>
      <aside>
        <p className="FlowConversationSettings__navLabel">Conversation types</p>
        <nav
          className="FlowConversationSettings__nav"
          aria-label="Conversation types"
        >
          {conversationTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              className={`FlowConversationSettings__navItem${activeTypeId === type.id ? " is-active" : ""
                }`}
              onClick={() => handleSelectConversationType(type)}
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
                  {isCustomType
                    ? activeType.title
                    : activeType.conversationsTitle}
                </h3>
                <p className="FlowConversationSettings__conversationDescription">
                  {activeType.description}
                </p>
              </div>
              {isActive && (
                <Tag type={TagType.GREEN} style={{ height: "1.5625rem" }}>
                  Active
                </Tag>
              )}
            </Flex>
            <SwitchInput
              size={SwitchInputSize.SMALL}
              value={isActive}
              onChange={handleToggleActive}
              name="conversationActive"
            />
          </div>

          <Tabs
            tabsWrapperClassName="FlowConversationSettings__tabsWrapper"
            activeTabIndex={activeTabIndex}
            onActiveTabChange={setActiveTabIndex}
            tabs={[
              {
                title: "Messaging setup",
                content: isCustomType ? (
                  <div className="FlowConversationSettings__customSetup">
                    <div className="FlowConversationSettings__templateCard">
                      <div className="FlowConversationSettings__templateHeader">
                        <div className="FlowConversationSettings__templateTitleRow">
                          <span>{activeType.title}</span>
                          <Icon icon="mi:edit" width={16} height={16} />
                        </div>
                      </div>

                      <FormInput
                        label="Intent"
                        name="customIntent"
                        placeholder="Enter intent"
                        value={activeType.intent ?? ""}
                        onChange={(event) =>
                          updateActiveCustomType({ intent: event.target.value })
                        }
                      />

                      <FormInput
                        label="Condition (If)"
                        name="customCondition"
                        placeholder="Enter condition"
                        value={activeType.condition ?? ""}
                        onChange={(event) =>
                          updateActiveCustomType({
                            condition: event.target.value,
                          })
                        }
                      />

                      <div className="FlowConversationSettings__editorPane">
                        <div className="FlowConversationSettings__editorToolbar">
                          <div className="FlowConversationSettings__editorTools">
                            <div className="FlowConversationSettings__editorToolsGroup">
                              <Icon icon="octicon:bold-16" width={16} height={16} />
                              <Icon icon="tabler:italic" width={16} height={16} />
                              <Icon
                                icon="flowbite:link-outline"
                                width={16}
                                height={16}
                              />
                            </div>
                            <Icon
                              icon="material-symbols:undo-rounded"
                              width={18}
                              height={18}
                            />
                            <Icon
                              icon="material-symbols:redo-rounded"
                              width={18}
                              height={18}
                            />
                          </div>
                          <span className="FlowConversationSettings__wordCount">
                            {wordCount}/{MESSAGE_WORD_LIMIT} words
                          </span>
                        </div>

                        <div className="FlowConversationSettings__editorInput">
                          <FormTextarea
                            name="customMessage"
                            value={activeType.message ?? ""}
                            onChange={(event) =>
                              updateActiveCustomType({
                                message: event.target.value,
                              })
                            }
                            placeholder="Write your personalized message here..."
                            rows={10}
                          />
                          <button
                            type="button"
                            className="FlowConversationSettings__emojiButton"
                            aria-label="Insert emoji"
                          >
                            <Icon
                              icon="mingcute:emoji-line"
                              width={16}
                              height={16}
                            />
                          </button>
                        </div>
                      </div>

                      <FormInput
                        label="Action"
                        name="customAction"
                        placeholder="Enter action"
                        value={activeType.action ?? ""}
                        onChange={(event) =>
                          updateActiveCustomType({ action: event.target.value })
                        }
                      />

                      <FormInput
                        label="Otherwise (Optional)"
                        name="customOtherwise"
                        placeholder="Enter reason"
                        value={activeType.otherwise ?? ""}
                        onChange={(event) =>
                          updateActiveCustomType({
                            otherwise: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="FlowConversationSettings__sectionHeader">
                      <h4 className="FlowConversationSettings__sectionTitle">
                        Setup {activeType.title.toLowerCase()} template
                      </h4>
                      <button type="button" className="FlowConversationSettings__ghostButton">
                        <Icon icon="basil:plus-solid" width={16} height={16} />
                        Add template
                      </button>
                    </div>

                    <div className="FlowConversationSettings__templateCard">
                      <div className="FlowConversationSettings__templateHeader">
                        <div className="FlowConversationSettings__templateTitleRow">
                          <span>{activeTemplate.name}</span>
                          <Icon icon="mi:edit" width={16} height={16} />
                        </div>
                        <button
                          type="button"
                          aria-label="Toggle template"
                          onClick={() =>
                            updateTemplate({ expanded: !activeTemplate.expanded })
                          }
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            transform: activeTemplate.expanded
                              ? "rotate(180deg)"
                              : "none",
                          }}
                        >
                          <Icon
                            icon="iconamoon:arrow-down-2-light"
                            width={24}
                            height={24}
                          />
                        </button>
                      </div>

                      {activeTemplate.expanded && (
                        <>
                          <SelectInput
                            label="Trigger"
                            placeholder="Select trigger"
                            options={TRIGGER_OPTIONS}
                            value={activeTemplate.trigger}
                            onChange={(val: string | { value: string }) =>
                              updateTemplate({ trigger: handleSelectValue(val) })
                            }
                          />

                          <div className="FlowConversationSettings__checkboxCard">
                            <div className="FlowConversationSettings__checkboxCard-header">
                              <span>Trigger conditions</span>
                              <div className="FlowConversationSettings__checkboxCard-actions">
                                <button
                                  type="button"
                                  className="FlowConversationSettings__ghostButton"
                                >
                                  Add custom trigger
                                </button>
                                <button
                                  type="button"
                                  className="FlowConversationSettings__checkboxCard-selectAll"
                                  onClick={handleSelectAllTriggerConditions}
                                >
                                  {allTriggerConditionsSelected ? "Clear" : "Select all"}
                                </button>
                              </div>
                            </div>
                            <CheckboxInput
                              name="triggerConditions"
                              options={TRIGGER_CONDITION_OPTIONS}
                              value={activeTemplate.triggerConditions}
                              onChange={(values) =>
                                updateTemplate({ triggerConditions: values })
                              }
                              direction="column"
                            />
                          </div>

                          <SelectInput
                            label="Intent"
                            placeholder="Select intent"
                            options={INTENT_OPTIONS}
                            value={activeTemplate.intent}
                            onChange={(val: string | { value: string }) =>
                              updateTemplate({ intent: handleSelectValue(val) })
                            }
                          />

                          <SelectInput
                            label="Template type"
                            placeholder="Select type"
                            options={TEMPLATE_TYPE_OPTIONS}
                            value={activeTemplate.templateType}
                            onChange={(val: string | { value: string }) =>
                              updateTemplate({ templateType: handleSelectValue(val) })
                            }
                          />

                          <div className="FlowConversationSettings__messageEditor">
                            <div className="FlowConversationSettings__messageEditorHeader">
                              <div>
                                <p className="FlowConversationSettings__messageEditorTitle">
                                  Message editor
                                </p>
                                <p className="FlowConversationSettings__messageEditorDescription">
                                  Use variables to personalize your message.
                                </p>
                              </div>
                              <button
                                type="button"
                                className="FlowConversationSettings__ghostButton"
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
                                  {MESSAGE_VARIABLES.map((variable) => (
                                    <button
                                      key={variable.token}
                                      type="button"
                                      className="FlowConversationSettings__variables-item"
                                      onClick={() => insertVariable(variable.token)}
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
                                      <Icon icon="octicon:bold-16" width={16} height={16} />
                                      <Icon icon="tabler:italic" width={16} height={16} />
                                      <Icon
                                        icon="flowbite:link-outline"
                                        width={16}
                                        height={16}
                                      />
                                    </div>
                                    <Icon
                                      icon="material-symbols:undo-rounded"
                                      width={18}
                                      height={18}
                                    />
                                    <Icon
                                      icon="material-symbols:redo-rounded"
                                      width={18}
                                      height={18}
                                    />
                                  </div>
                                  <span className="FlowConversationSettings__wordCount">
                                    {wordCount}/500 words
                                  </span>
                                </div>

                                <div className="FlowConversationSettings__editorInput">
                                  <FormTextarea
                                    name="message"
                                    value={activeTemplate.message}
                                    onChange={(event) =>
                                      updateTemplate({ message: event.target.value })
                                    }
                                    placeholder="Write a personalised message here...."
                                    rows={10}
                                  />
                                  <button
                                    type="button"
                                    className="FlowConversationSettings__emojiButton"
                                    aria-label="Insert emoji"
                                  >
                                    <Icon
                                      icon="mingcute:emoji-line"
                                      width={16}
                                      height={16}
                                    />
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
                                onClick={addTemplateButton}
                              >
                                <Icon icon="basil:plus-outline" width={16} height={16} />
                                Add button
                              </button>
                            </div>

                            <div className="FlowConversationSettings__buttonsCard">
                              {activeTemplate.buttons.map((button, index) => (
                                <div
                                  key={button.id}
                                  className="FlowConversationSettings__buttonRow"
                                >
                                  <FormInput
                                    label={index === 0 ? "Button label" : undefined}
                                    name={`button-label-${button.id}`}
                                    value={button.label}
                                    onChange={(event) =>
                                      updateTemplateButton(button.id, {
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
                                    onChange={(val: string | { value: string }) =>
                                      updateTemplateButton(button.id, {
                                        action: handleSelectValue(val),
                                      })
                                    }
                                  />
                                  <SelectInput
                                    label={index === 0 ? "Button type" : undefined}
                                    placeholder="Select type"
                                    options={BUTTON_TYPE_OPTIONS}
                                    value={button.buttonType}
                                    onChange={(val: string | { value: string }) =>
                                      updateTemplateButton(button.id, {
                                        buttonType: handleSelectValue(val),
                                      })
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="FlowConversationSettings__deleteButton"
                                    aria-label="Delete button"
                                    onClick={() => removeTemplateButton(button.id)}
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
                              value={activeTemplate.fallbackLanguage}
                              onChange={(val: string | { value: string }) =>
                                updateTemplate({
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
                          value={automation.retryEnabled}
                          onChange={(value) =>
                            updateAutomation({ retryEnabled: value })
                          }
                          name="retryEnabled"
                        />
                      </div>

                      {automation.retryEnabled && (
                        <div className="FlowConversationSettings__automationCard-fields">
                          <p className="FlowConversationSettings__automationCard-sectionTitle">
                            Retry period
                          </p>
                          <div className="FlowConversationSettings__automationCard-row">
                            <FormInput
                              label="Duration"
                              name="retryDuration"
                              value={automation.retryDuration}
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
                              value={automation.retryUnit}
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
                            value={automation.retryLimit}
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
                          value={automation.followUpEnabled}
                          onChange={(value) =>
                            updateAutomation({ followUpEnabled: value })
                          }
                          name="followUpEnabled"
                        />
                      </div>

                      {automation.followUpEnabled && (
                        <div className="FlowConversationSettings__automationCard-fields">
                          <SelectInput
                            label="Follow-up type"
                            placeholder="Select type"
                            options={FOLLOW_UP_TYPE_OPTIONS}
                            value={automation.followUpType}
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
                              value={automation.followUpFrequency}
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
                              value={automation.followUpUnit}
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
                        value={automation.stopAutomation}
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
                {(isCustomType
                  ? Boolean(activeType.message?.trim())
                  : Boolean(activeTemplate.message.trim())) ? (
                  <div>
                    <div className="FlowConversationSettings__phoneBubble">
                      {previewMessage}
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
                <Icon icon="mdi:sticker-emoji" width={18} height={18} color="#8e8e93" />
                <Icon icon="mdi:camera-outline" width={20} height={20} color="#8e8e93" />
                <Icon icon="mdi:microphone-outline" width={20} height={20} color="#8e8e93" />
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
          Footer={() =>
            <Flex gap="0.75rem" align="center" justify="flex-end" style={{ marginTop: "1rem" }}>
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
          }
        >
          <Flex direction="column" gap="1rem">
            <FormInput
              label="Conversation name"
              name="customConversationName"
              placeholder="Enter conversation name"
              value={customForm.name}
              onChange={(event) => updateCustomForm({ name: event.target.value })}
              required
            />

            <div>
              <FormInput
                label="Description"
                name="customConversationDescription"
                placeholder="Enter description"
                value={customForm.description}
                onChange={(event) =>
                  updateCustomForm({ description: event.target.value })
                }
              />
              <p className="FlowConversationSettings__fieldHint">
                {DESCRIPTION_WORD_LIMIT} words max
                {customDescriptionWordCount > DESCRIPTION_WORD_LIMIT
                  ? ` · ${customDescriptionWordCount}/${DESCRIPTION_WORD_LIMIT}`
                  : ""}
              </p>
            </div>

            <FormInput
              label="Intent"
              name="customConversationIntent"
              placeholder="Enter intent"
              value={customForm.intent}
              onChange={(event) =>
                updateCustomForm({ intent: event.target.value })
              }
            />

            <FormInput
              label="Condition (If)"
              name="customConversationCondition"
              placeholder="Enter condition"
              value={customForm.condition}
              onChange={(event) =>
                updateCustomForm({ condition: event.target.value })
              }
            />

            <div className="FlowConversationSettings__modalEditor">
              <div className="FlowConversationSettings__editorToolbar">
                <div className="FlowConversationSettings__editorTools">
                  <div className="FlowConversationSettings__editorToolsGroup">
                    <Icon icon="octicon:bold-16" width={16} height={16} />
                    <Icon icon="tabler:italic" width={16} height={16} />
                    <Icon icon="flowbite:link-outline" width={16} height={16} />
                  </div>
                  <Icon
                    icon="material-symbols:undo-rounded"
                    width={18}
                    height={18}
                  />
                  <Icon
                    icon="material-symbols:redo-rounded"
                    width={18}
                    height={18}
                  />
                </div>
                <span className="FlowConversationSettings__wordCount">
                  {customMessageWordCount}/{MESSAGE_WORD_LIMIT} words
                </span>
              </div>

              <div className="FlowConversationSettings__editorInput">
                <FormTextarea
                  name="customConversationMessage"
                  value={customForm.message}
                  onChange={(event) =>
                    updateCustomForm({ message: event.target.value })
                  }
                  placeholder="Write your personalized message here..."
                  rows={8}
                />
                <button
                  type="button"
                  className="FlowConversationSettings__emojiButton"
                  aria-label="Insert emoji"
                >
                  <Icon icon="mingcute:emoji-line" width={16} height={16} />
                </button>
              </div>
            </div>

            <FormInput
              label="Action"
              name="customConversationAction"
              placeholder="Enter action"
              value={customForm.action}
              onChange={(event) =>
                updateCustomForm({ action: event.target.value })
              }
            />

            <FormInput
              label="Otherwise (Optional)"
              name="customConversationOtherwise"
              placeholder="Enter reason"
              value={customForm.otherwise}
              onChange={(event) =>
                updateCustomForm({ otherwise: event.target.value })
              }
            />

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
                  updateCustomForm({ enableOnCreate: value })
                }
                name="enableCustomConversation"
              />
            </Flex>
          </Flex>
        </Modal>
      )}
    </FlowConversationSettingsContainer>
  );
};

export default FlowConversationSettings;
