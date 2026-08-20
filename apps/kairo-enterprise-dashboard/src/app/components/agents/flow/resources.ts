import { ICONS } from "@kairo/lib/utils";
import type {
  ConversationTypeMeta,
  FlowChannel,
  FlowCheckboxOption,
  FlowInfrastructure,
  GeneralSettingsNavSection,
  MessageVariable,
  SelectOption,
} from "./types";

export const GENERAL_SETTINGS_SECTIONS: GeneralSettingsNavSection[] = [
  {
    id: "setup",
    title: "Setup",
    description: "Tell Flow how to reach your users.",
    icon: "hugeicons:configuration-02",
  },
  {
    id: "ai-behaviour",
    title: "AI behaviour",
    description: "How AI decides, and responds.",
    icon: "mingcute:ai-fill",
  },
  {
    id: "guardrails",
    title: "Guardrails",
    description: "Set the limits",
    icon: "material-symbols:rule-rounded",
  },
  {
    id: "knowledge",
    title: "Knowledge",
    description: "Teach AI to know more",
    icon: "iconoir:brain",
  },
];

export const FALLBACK_TONE_OPTIONS: SelectOption[] = [
  { label: "Professional", value: "PROFESSIONAL" },
  { label: "Friendly", value: "FRIENDLY" },
  { label: "Formal", value: "FORMAL" },
  { label: "Casual", value: "CASUAL" },
];

export const FALLBACK_LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "en", label: "English (Default)" },
  { value: "ig", label: "Igbo" },
  { value: "yo", label: "Yoruba" },
  { value: "ha", label: "Hausa" },
];

export const FALLBACK_RETENTION_UNIT_OPTIONS: SelectOption[] = [
  { label: "Days", value: "DAYS" },
  { label: "Weeks", value: "WEEKS" },
  { label: "Months", value: "MONTHS" },
  { label: "Years", value: "YEARS" },
];

export const FALLBACK_MEMORY_UNIT_OPTIONS = FALLBACK_RETENTION_UNIT_OPTIONS;
export const FALLBACK_TIME_UNIT_OPTIONS = FALLBACK_RETENTION_UNIT_OPTIONS;

export const FALLBACK_RESPONSE_STYLE_OPTIONS: SelectOption[] = [
  { label: "Short replies", value: "SHORT_REPLIES" },
  { label: "Conversational", value: "CONVERSATIONAL" },
  { label: "Detailed guidance", value: "DETAILED_GUIDANCE" },
];

export const FALLBACK_GUARDRAIL_OPTIONS: Record<string, FlowCheckboxOption[]> = {
  restrictedTopics: [
    { value: "INVESTMENT_ADVICE", label: "Investment advice" },
    { value: "LOAN_APPROVALS", label: "Loan approvals" },
  ],
  escalationConditions: [
    { value: "FRAUD_DETECTED", label: "Fraud detected" },
    { value: "HUMAN_AGENT", label: "User requests human agent" },
  ],
  requireApprovalFor: [
    { value: "REFUNDS", label: "Refund requests" },
    { value: "REVERSALS", label: "Transaction reversals" },
  ],
  responseRestrictions: [
    { value: "OFFENSIVE_LANGUAGE", label: "Prevent offensive language" },
    { value: "HALLUCINATED_ANSWERS", label: "Prevent hallucinated answers" },
  ],
  behaviorDetection: [
    {
      value: "SUSPICIOUS_PATTERNS",
      label: "Detect suspicious transaction patterns",
    },
    {
      value: "ACCOUNT_TAKEOVER",
      label: "Detect account takeover attempts",
    },
  ],
};

export const GUARDRAIL_STATE_KEYS = {
  restrictedTopics: "restrictedTopics",
  escalationConditions: "escalationConditions",
  requireApprovalFor: "requireApproval",
  responseRestrictions: "responseRestrictions",
  behaviorDetection: "behaviorDetection",
} as const;

export const CONVERSATION_MEMORY_OPTIONS: FlowCheckboxOption[] = [
  { value: "onboarding-progress", label: "Remember onboarding progress" },
  { value: "preferred-language", label: "Remember preferred language" },
  { value: "previous-interactions", label: "Remember previous interactions" },
  { value: "unfinished-actions", label: "Remember unfinished actions" },
];

export const PROACTIVE_ASSISTANCE_OPTIONS: FlowCheckboxOption[] = [
  { value: "suggest-next-actions", label: "Suggest next actions" },
  { value: "recommend-onboarding", label: "Recommend onboarding steps" },
  { value: "remind-inactive", label: "Remind inactive users" },
  { value: "recommend-funding", label: "Recommend wallet funding" },
];

export const ESCALATION_INTELLIGENCE_OPTIONS: FlowCheckboxOption[] = [
  { value: "detect-frustration", label: "Detect frustration" },
  { value: "detect-confusion", label: "Detect repeated confusion" },
  { value: "escalate-unresolved", label: "Escalate unresolved issues" },
  { value: "escalate-disputes", label: "Escalate financial disputes" },
];

export const RESTRICTED_TOPICS_OPTIONS =
  FALLBACK_GUARDRAIL_OPTIONS.restrictedTopics;
export const ESCALATION_CONDITIONS_OPTIONS =
  FALLBACK_GUARDRAIL_OPTIONS.escalationConditions;
export const REQUIRE_APPROVAL_OPTIONS =
  FALLBACK_GUARDRAIL_OPTIONS.requireApprovalFor;
export const RESPONSE_RESTRICTIONS_OPTIONS =
  FALLBACK_GUARDRAIL_OPTIONS.responseRestrictions;
export const BEHAVIOR_DETECTION_OPTIONS =
  FALLBACK_GUARDRAIL_OPTIONS.behaviorDetection;

export const STATUS_OPTIONS: SelectOption[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

export const FALLBACK_TRIGGER_OPTIONS: SelectOption[] = [
  { label: "First time user", value: "FIRST_TIME_USER" },
  { label: "KYC submitted", value: "KYC_SUBMITTED" },
  { label: "Wallet funded", value: "WALLET_FUNDED" },
];

export const FALLBACK_TRIGGER_CONDITION_OPTIONS: SelectOption[] = [
  { value: "FIRST_TIME_USER", label: "First-time user" },
  { value: "REFERRED_USER", label: "Referred user" },
  { value: "KYC_INCOMPLETE", label: "KYC incomplete" },
];

export const FALLBACK_INTENT_OPTIONS: SelectOption[] = [
  { label: "Welcome", value: "WELCOME" },
  { label: "Engagement", value: "ENGAGEMENT" },
  { label: "Support", value: "SUPPORT" },
];

export const TEMPLATE_TYPE_OPTIONS: SelectOption[] = [
  { label: "Text", value: "text" },
  { label: "Interactive", value: "interactive" },
  { label: "Media", value: "media" },
];

export const FALLBACK_BUTTON_ACTION_OPTIONS: SelectOption[] = [
  { label: "Open onboarding", value: "OPEN_ONBOARDING" },
  { label: "Open link", value: "OPEN_LINK" },
  { label: "Reply", value: "REPLY" },
];

export const FALLBACK_QUICK_REPLY_PAYLOAD_OPTIONS: SelectOption[] = [
  { label: "Get started", value: "GET_STARTED" },
  { label: "Continue", value: "CONTINUE" },
  { label: "Yes", value: "YES" },
  { label: "No", value: "NO" },
];

export const FALLBACK_BUTTON_TYPE_OPTIONS: SelectOption[] = [
  { label: "Reply", value: "REPLY" },
  { label: "URL", value: "URL" },
];

export const FALLBACK_MESSAGE_VARIABLES: MessageVariable[] = [
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

export const RETRY_LIMIT_OPTIONS: SelectOption[] = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "5", value: "5" },
];

export const FALLBACK_FOLLOW_UP_TYPE_OPTIONS: SelectOption[] = [
  { label: "KYC reminder", value: "KYC_REMINDER" },
  { label: "Wallet funding prompt", value: "WALLET_FUNDING_PROMPT" },
];

export const FALLBACK_STOP_AUTOMATION_OPTIONS: SelectOption[] = [
  { value: "ONBOARDING_COMPLETED", label: "Onboarding completed" },
  { value: "USER_OPTS_OUT", label: "User opts out" },
  { value: "ACCOUNT_SUSPENDED", label: "Account suspended" },
  { value: "FRAUD_DETECTED", label: "Fraud detected" },
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

export const CHANNEL_BRAND_COLORS: Record<string, string> = {
  whatsapp: "#1FAF38",
  telegram: "#2AABEE",
  instagram: "#C837AB",
  twitter: "#000000",
};

export const FALLBACK_CHANNELS: FlowChannel[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: ICONS.WHATSAPP,
    isConnected: false,
    brandColor: CHANNEL_BRAND_COLORS.whatsapp,
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: ICONS.TELEGRAM,
    isConnected: false,
    brandColor: CHANNEL_BRAND_COLORS.telegram,
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: ICONS.INSTAGRAM,
    isConnected: false,
    brandColor: CHANNEL_BRAND_COLORS.instagram,
  },
  {
    id: "twitter",
    name: "X/Twitter",
    icon: ICONS.TWITTER,
    isConnected: false,
    brandColor: CHANNEL_BRAND_COLORS.twitter,
  },
];

export const FALLBACK_INFRASTRUCTURES: FlowInfrastructure[] = [
  {
    id: "orange",
    name: "Orange",
    description: "Payment system",
    isConnected: false,
  },
];
