"use client";

import { Icon } from "@iconify/react";
import {
  ActionMenu,
  Button,
  ButtonClass,
  ButtonSize,
  ConfirmationModal,
  EmptyState,
  Flex,
  Modal,
} from "@kairo/ui";
import {
  CheckboxInput,
  FormInput,
  FormTextarea,
  SelectInput,
  SwitchInput,
  SwitchInputSize,
} from "@kairo/ui/inputs";
import { useMemo, useRef, useState } from "react";
import styled from "styled-components";

export type GeneralSettingsSection =
  | "setup"
  | "ai-behaviour"
  | "guardrails"
  | "knowledge";

type CheckboxOption = { value: string; label: string };

type KnowledgeItem = {
  id: string;
  type: "file" | "note";
  name: string;
  subtitle: string;
  dateAdded: string;
  content?: string;
};

const SECTIONS: {
  id: GeneralSettingsSection;
  title: string;
  description: string;
  icon: string;
}[] = [
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

const TONE_OPTIONS = [
  { label: "Professional", value: "professional" },
  { label: "Friendly", value: "friendly" },
  { label: "Formal", value: "formal" },
  { label: "Casual", value: "casual" },
];

const LANGUAGE_OPTIONS = [
  { value: "english", label: "English (Default)" },
  { value: "igbo", label: "Igbo" },
  { value: "yoruba", label: "Yoruba" },
  { value: "hausa", label: "Hausa" },
];

const MEMORY_UNIT_OPTIONS = [
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
  { label: "Months", value: "months" },
  { label: "Years", value: "years" },
];

const CONVERSATION_MEMORY_OPTIONS: CheckboxOption[] = [
  { value: "onboarding-progress", label: "Remember onboarding progress" },
  { value: "preferred-language", label: "Remember preferred language" },
  { value: "previous-interactions", label: "Remember previous interactions" },
  { value: "unfinished-actions", label: "Remember unfinished actions" },
];

const PROACTIVE_ASSISTANCE_OPTIONS: CheckboxOption[] = [
  { value: "suggest-next-actions", label: "Suggest next actions" },
  { value: "recommend-onboarding", label: "Recommend onboarding steps" },
  { value: "remind-inactive", label: "Remind inactive users" },
  { value: "recommend-funding", label: "Recommend wallet funding" },
];

const ESCALATION_INTELLIGENCE_OPTIONS: CheckboxOption[] = [
  { value: "detect-frustration", label: "Detect frustration" },
  { value: "detect-confusion", label: "Detect repeated confusion" },
  { value: "escalate-unresolved", label: "Escalate unresolved issues" },
  { value: "escalate-disputes", label: "Escalate financial disputes" },
];

const RESPONSE_STYLE_OPTIONS = [
  { key: "shortReplies", label: "Short replies" },
  { key: "conversational", label: "Conversational" },
  { key: "detailedGuidance", label: "Detailed guidance" },
] as const;

const RESTRICTED_TOPICS_OPTIONS: CheckboxOption[] = [
  { value: "investment-advice", label: "Investment advice" },
  { value: "loan-approvals", label: "Loan approvals" },
  { value: "legal-advice", label: "Legal advice" },
  { value: "political-content", label: "Political content" },
  { value: "sensitive-account", label: "Sensitive account details" },
  { value: "fraud-disputes", label: "Fraud dispute resolution" },
];

const ESCALATION_CONDITIONS_OPTIONS: CheckboxOption[] = [
  { value: "fraud-detected", label: "Fraud detected" },
  { value: "human-agent", label: "User requests human agent" },
  { value: "high-risk-tx", label: "High-risk transaction detected" },
];

const REQUIRE_APPROVAL_OPTIONS: CheckboxOption[] = [
  { value: "refunds", label: "Refund requests" },
  { value: "reversals", label: "Transaction reversals" },
  { value: "freezes", label: "Account freezes" },
  { value: "kyc-overrides", label: "KYC overrides" },
];

const RESPONSE_RESTRICTIONS_OPTIONS: CheckboxOption[] = [
  { value: "offensive-language", label: "Prevent offensive language" },
  { value: "hallucinated-answers", label: "Prevent hallucinated answers" },
  { value: "speculative-responses", label: "Avoid speculative responses" },
  {
    value: "factual-transaction-data",
    label: "Require factual transaction data",
  },
  { value: "unsupported-claims", label: "Restrict unsupported claims" },
];

const BEHAVIOR_DETECTION_OPTIONS: CheckboxOption[] = [
  {
    value: "suspicious-patterns",
    label: "Detect suspicious transaction patterns",
  },
  { value: "account-takeover", label: "Detect account takeover attempts" },
  { value: "panic-signals", label: "Detect panic or urgency signals" },
  {
    value: "social-engineering",
    label: "Detect social engineering attempts",
  },
];

const formatKnowledgeDate = (date: Date) => {
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

const FlowGeneralSettingsContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr);
  gap: 3rem;
  margin-top: 1.5rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .FlowGeneralSettings__navLabel {
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_02};
    margin-bottom: 1rem;
  }

  .FlowGeneralSettings__nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-right: 1rem;
    border-right: 1px solid ${({ theme }) => theme.colors.gray_02};

    @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
      border-right: none;
      padding-right: 0;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
      padding-bottom: 1rem;
    }
  }

  .FlowGeneralSettings__navItem {
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

      .FlowGeneralSettings__navItem-icon {
        background-color: ${({ theme }) => `${theme.colors.orange}14`};
        color: ${({ theme }) => theme.colors.orange};
      }

      .FlowGeneralSettings__navItem-title {
        color: ${({ theme }) => theme.colors.orangeDark};
      }
    }
  }

  .FlowGeneralSettings__panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 32.5rem;

    &.is-knowledge {
      max-width: 41.5625rem;
    }
  }

  .FlowGeneralSettings__panelHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: ${({ theme }) => theme.colors.white};
    padding-bottom: 0.5rem;

    &-content {
      min-width: 0;
    }

    &-title {
      font-size: 1.5rem;
      font-weight: 500;
      line-height: 2rem;
      color: ${({ theme }) => theme.colors.text_01};
    }

    &-description {
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1.25rem;
      color: ${({ theme }) => theme.colors.text_02};
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }
  }

  .FlowGeneralSettings__knowledgeHeader {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
  }

  .FlowGeneralSettings__checkboxCard,
  .FlowGeneralSettings__languageCard,
  .FlowGeneralSettings__memoryCard,
  .FlowGeneralSettings__responseStyleCard {
    border: 1px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 1rem;
    padding: 1rem;
    background-color: ${({ theme }) => theme.colors.white};

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0.75rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};
      font-size: 0.9375rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text_01};
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

  .FlowGeneralSettings__memoryCard {
    padding: 1.125rem 1rem;
  }

  .FlowGeneralSettings__memoryFields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .FlowGeneralSettings__responseStyleCard {
    &-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text_01};

      &:not(:last-child) {
        margin-bottom: 1rem;
      }
    }
  }

  .FlowGeneralSettings__toggleRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.gray_02};
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.white};
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowGeneralSettings__knowledgeTableHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text_02};
  }

  .FlowGeneralSettings__knowledgeList {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .FlowGeneralSettings__knowledgeRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray_02};

    &-main {
      display: flex;
      align-items: center;
      gap: 1.0625rem;
      min-width: 0;
    }

    &-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.625rem;
      border-radius: 0.75rem;
      background-color: ${({ theme }) => theme.colors.gray_02};
      flex-shrink: 0;
    }

    &-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    &-name {
      font-size: 0.9375rem;
      font-weight: 500;
      line-height: 1.5rem;
      color: ${({ theme }) => theme.colors.text_01};
    }

    &-subtitle {
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1.25rem;
      color: ${({ theme }) => theme.colors.text_02};
    }

    &-date {
      font-size: 0.9375rem;
      font-weight: 500;
      line-height: 1.3125rem;
      color: ${({ theme }) => theme.colors.text_03};
      white-space: nowrap;
      flex-shrink: 0;
    }
  }

  .FlowGeneralSettings__knowledgeEmpty {
    margin: 3rem auto;
  }

  .delete-action {
    color: ${({ theme }) => theme.colors.red_01};
  }
`;

type CheckboxGroupCardProps = {
  title: string;
  options: CheckboxOption[];
  selected: string[];
  onChange: (values: string[]) => void;
};

type EditableSettingsState = {
  tone: string;
  languages: string[];
  voiceToText: boolean;
  conversationMemory: string[];
  memoryDuration: string;
  memoryUnit: string;
  proactiveAssistance: string[];
  escalationIntelligence: string[];
  responseStyle: {
    shortReplies: boolean;
    conversational: boolean;
    detailedGuidance: boolean;
  };
  restrictedTopics: string[];
  escalationConditions: string[];
  requireApproval: string[];
  responseRestrictions: string[];
  behaviorDetection: string[];
};

const INITIAL_EDITABLE_SETTINGS: EditableSettingsState = {
  tone: "",
  languages: ["english"],
  voiceToText: false,
  conversationMemory: [
    "onboarding-progress",
    "preferred-language",
    "previous-interactions",
    "unfinished-actions",
  ],
  memoryDuration: "2",
  memoryUnit: "months",
  proactiveAssistance: ["suggest-next-actions"],
  escalationIntelligence: ["detect-frustration", "detect-confusion"],
  responseStyle: {
    shortReplies: false,
    conversational: true,
    detailedGuidance: false,
  },
  restrictedTopics: [],
  escalationConditions: [],
  requireApproval: [],
  responseRestrictions: [],
  behaviorDetection: [],
};

const sortStrings = (values: string[]) => [...values].sort();

const serializeEditableSettings = (settings: EditableSettingsState) =>
  JSON.stringify({
    ...settings,
    languages: sortStrings(settings.languages),
    conversationMemory: sortStrings(settings.conversationMemory),
    proactiveAssistance: sortStrings(settings.proactiveAssistance),
    escalationIntelligence: sortStrings(settings.escalationIntelligence),
    restrictedTopics: sortStrings(settings.restrictedTopics),
    escalationConditions: sortStrings(settings.escalationConditions),
    requireApproval: sortStrings(settings.requireApproval),
    responseRestrictions: sortStrings(settings.responseRestrictions),
    behaviorDetection: sortStrings(settings.behaviorDetection),
  });

const applyEditableSettings = (
  settings: EditableSettingsState,
  setters: {
    setTone: (value: string) => void;
    setLanguages: (value: string[]) => void;
    setVoiceToText: (value: boolean) => void;
    setConversationMemory: (value: string[]) => void;
    setMemoryDuration: (value: string) => void;
    setMemoryUnit: (value: string) => void;
    setProactiveAssistance: (value: string[]) => void;
    setEscalationIntelligence: (value: string[]) => void;
    setResponseStyle: (value: EditableSettingsState["responseStyle"]) => void;
    setRestrictedTopics: (value: string[]) => void;
    setEscalationConditions: (value: string[]) => void;
    setRequireApproval: (value: string[]) => void;
    setResponseRestrictions: (value: string[]) => void;
    setBehaviorDetection: (value: string[]) => void;
  },
) => {
  setters.setTone(settings.tone);
  setters.setLanguages([...settings.languages]);
  setters.setVoiceToText(settings.voiceToText);
  setters.setConversationMemory([...settings.conversationMemory]);
  setters.setMemoryDuration(settings.memoryDuration);
  setters.setMemoryUnit(settings.memoryUnit);
  setters.setProactiveAssistance([...settings.proactiveAssistance]);
  setters.setEscalationIntelligence([...settings.escalationIntelligence]);
  setters.setResponseStyle({ ...settings.responseStyle });
  setters.setRestrictedTopics([...settings.restrictedTopics]);
  setters.setEscalationConditions([...settings.escalationConditions]);
  setters.setRequireApproval([...settings.requireApproval]);
  setters.setResponseRestrictions([...settings.responseRestrictions]);
  setters.setBehaviorDetection([...settings.behaviorDetection]);
};

const CheckboxGroupCard = ({
  title,
  options,
  selected,
  onChange,
}: CheckboxGroupCardProps) => {
  const allSelected = selected.length === options.length;

  const handleSelectAll = () => {
    onChange(allSelected ? [] : options.map((option) => option.value));
  };

  return (
    <div className="FlowGeneralSettings__checkboxCard">
      <div className="FlowGeneralSettings__checkboxCard-header">
        <span>{title}</span>
        <button
          type="button"
          className="FlowGeneralSettings__checkboxCard-selectAll"
          onClick={handleSelectAll}
        >
          {allSelected ? "Clear" : "Select all"}
        </button>
      </div>
      <CheckboxInput
        name={title.replace(/\s+/g, "-").toLowerCase()}
        options={options}
        value={selected}
        onChange={onChange}
        direction="column"
      />
    </div>
  );
};

type FlowGeneralSettingsProps = {
  initialSection?: GeneralSettingsSection;
};

export const FlowGeneralSettings = ({
  initialSection = "setup",
}: FlowGeneralSettingsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] =
    useState<GeneralSettingsSection>(initialSection);

  const [tone, setTone] = useState(INITIAL_EDITABLE_SETTINGS.tone);
  const [languages, setLanguages] = useState<string[]>([
    ...INITIAL_EDITABLE_SETTINGS.languages,
  ]);
  const [voiceToText, setVoiceToText] = useState(
    INITIAL_EDITABLE_SETTINGS.voiceToText,
  );

  const [conversationMemory, setConversationMemory] = useState<string[]>([
    ...INITIAL_EDITABLE_SETTINGS.conversationMemory,
  ]);
  const [memoryDuration, setMemoryDuration] = useState(
    INITIAL_EDITABLE_SETTINGS.memoryDuration,
  );
  const [memoryUnit, setMemoryUnit] = useState(
    INITIAL_EDITABLE_SETTINGS.memoryUnit,
  );
  const [proactiveAssistance, setProactiveAssistance] = useState<string[]>([
    ...INITIAL_EDITABLE_SETTINGS.proactiveAssistance,
  ]);
  const [escalationIntelligence, setEscalationIntelligence] = useState<
    string[]
  >([...INITIAL_EDITABLE_SETTINGS.escalationIntelligence]);
  const [responseStyle, setResponseStyle] = useState({
    ...INITIAL_EDITABLE_SETTINGS.responseStyle,
  });

  const [restrictedTopics, setRestrictedTopics] = useState<string[]>([
    ...INITIAL_EDITABLE_SETTINGS.restrictedTopics,
  ]);
  const [escalationConditions, setEscalationConditions] = useState<string[]>([
    ...INITIAL_EDITABLE_SETTINGS.escalationConditions,
  ]);
  const [requireApproval, setRequireApproval] = useState<string[]>([
    ...INITIAL_EDITABLE_SETTINGS.requireApproval,
  ]);
  const [responseRestrictions, setResponseRestrictions] = useState<string[]>([
    ...INITIAL_EDITABLE_SETTINGS.responseRestrictions,
  ]);
  const [behaviorDetection, setBehaviorDetection] = useState<string[]>([
    ...INITIAL_EDITABLE_SETTINGS.behaviorDetection,
  ]);

  const [savedSettings, setSavedSettings] = useState<EditableSettingsState>(
    () => ({
      ...INITIAL_EDITABLE_SETTINGS,
      languages: [...INITIAL_EDITABLE_SETTINGS.languages],
      conversationMemory: [...INITIAL_EDITABLE_SETTINGS.conversationMemory],
      proactiveAssistance: [...INITIAL_EDITABLE_SETTINGS.proactiveAssistance],
      escalationIntelligence: [
        ...INITIAL_EDITABLE_SETTINGS.escalationIntelligence,
      ],
      responseStyle: { ...INITIAL_EDITABLE_SETTINGS.responseStyle },
      restrictedTopics: [...INITIAL_EDITABLE_SETTINGS.restrictedTopics],
      escalationConditions: [...INITIAL_EDITABLE_SETTINGS.escalationConditions],
      requireApproval: [...INITIAL_EDITABLE_SETTINGS.requireApproval],
      responseRestrictions: [
        ...INITIAL_EDITABLE_SETTINGS.responseRestrictions,
      ],
      behaviorDetection: [...INITIAL_EDITABLE_SETTINGS.behaviorDetection],
    }),
  );

  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [showDeleteKnowledgeModal, setShowDeleteKnowledgeModal] =
    useState(false);
  const [selectedKnowledgeItem, setSelectedKnowledgeItem] =
    useState<KnowledgeItem | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [editNoteTitle, setEditNoteTitle] = useState("");
  const [editNoteContent, setEditNoteContent] = useState("");

  const activeMeta = useMemo(
    () =>
      SECTIONS.find((section) => section.id === activeSection) ?? SECTIONS[0],
    [activeSection],
  );

  const currentSettings = useMemo<EditableSettingsState>(
    () => ({
      tone,
      languages,
      voiceToText,
      conversationMemory,
      memoryDuration,
      memoryUnit,
      proactiveAssistance,
      escalationIntelligence,
      responseStyle,
      restrictedTopics,
      escalationConditions,
      requireApproval,
      responseRestrictions,
      behaviorDetection,
    }),
    [
      tone,
      languages,
      voiceToText,
      conversationMemory,
      memoryDuration,
      memoryUnit,
      proactiveAssistance,
      escalationIntelligence,
      responseStyle,
      restrictedTopics,
      escalationConditions,
      requireApproval,
      responseRestrictions,
      behaviorDetection,
    ],
  );

  const hasUnsavedChanges =
    serializeEditableSettings(currentSettings) !==
    serializeEditableSettings(savedSettings);

  const showHeaderActions =
    activeSection !== "knowledge" && hasUnsavedChanges;

  const allLanguageValues = LANGUAGE_OPTIONS.map((option) => option.value);
  const allLanguagesSelected = languages.length === allLanguageValues.length;

  const handleSelectAllLanguages = () => {
    setLanguages(allLanguagesSelected ? ["english"] : allLanguageValues);
  };

  const handleSelectValue = (
    setter: (value: string) => void,
    val: string | { value: string },
  ) => {
    setter(
      val && typeof val === "object" && "value" in val
        ? String(val.value)
        : String(val ?? ""),
    );
  };

  const handleCancelSettingsChanges = () => {
    applyEditableSettings(savedSettings, {
      setTone,
      setLanguages,
      setVoiceToText,
      setConversationMemory,
      setMemoryDuration,
      setMemoryUnit,
      setProactiveAssistance,
      setEscalationIntelligence,
      setResponseStyle,
      setRestrictedTopics,
      setEscalationConditions,
      setRequireApproval,
      setResponseRestrictions,
      setBehaviorDetection,
    });
  };

  const handleSaveSettingsChanges = () => {
    setSavedSettings({
      ...currentSettings,
      languages: [...currentSettings.languages],
      conversationMemory: [...currentSettings.conversationMemory],
      proactiveAssistance: [...currentSettings.proactiveAssistance],
      escalationIntelligence: [...currentSettings.escalationIntelligence],
      responseStyle: { ...currentSettings.responseStyle },
      restrictedTopics: [...currentSettings.restrictedTopics],
      escalationConditions: [...currentSettings.escalationConditions],
      requireApproval: [...currentSettings.requireApproval],
      responseRestrictions: [...currentSettings.responseRestrictions],
      behaviorDetection: [...currentSettings.behaviorDetection],
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
    const name = file.name.replace(/\.[^/.]+$/, "");

    setKnowledgeItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "file",
        name,
        subtitle: extension,
        dateAdded: formatKnowledgeDate(new Date()),
      },
    ]);

    event.target.value = "";
  };

  const handleAddNote = () => {
    if (!noteTitle.trim()) return;

    setKnowledgeItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "note",
        name: noteTitle.trim(),
        subtitle: "Note",
        dateAdded: formatKnowledgeDate(new Date()),
        content: noteContent,
      },
    ]);

    setNoteTitle("");
    setNoteContent("");
    setShowAddNoteModal(false);
  };

  const closeAddNoteModal = () => {
    setNoteTitle("");
    setNoteContent("");
    setShowAddNoteModal(false);
  };

  const openEditNoteModal = (item: KnowledgeItem) => {
    if (item.type !== "note") return;
    setSelectedKnowledgeItem(item);
    setEditNoteTitle(item.name);
    setEditNoteContent(item.content ?? "");
    setShowEditNoteModal(true);
  };

  const closeEditNoteModal = () => {
    setEditNoteTitle("");
    setEditNoteContent("");
    setSelectedKnowledgeItem(null);
    setShowEditNoteModal(false);
  };

  const handleEditNote = () => {
    if (!selectedKnowledgeItem || !editNoteTitle.trim()) return;

    setKnowledgeItems((prev) =>
      prev.map((item) =>
        item.id === selectedKnowledgeItem.id
          ? {
            ...item,
            name: editNoteTitle.trim(),
            content: editNoteContent,
          }
          : item,
      ),
    );
    closeEditNoteModal();
  };

  const openDeleteKnowledgeModal = (item: KnowledgeItem) => {
    setSelectedKnowledgeItem(item);
    setShowDeleteKnowledgeModal(true);
  };

  const closeDeleteKnowledgeModal = () => {
    setSelectedKnowledgeItem(null);
    setShowDeleteKnowledgeModal(false);
  };

  const handleDeleteKnowledge = () => {
    if (!selectedKnowledgeItem) return;
    setKnowledgeItems((prev) =>
      prev.filter((item) => item.id !== selectedKnowledgeItem.id),
    );
    closeDeleteKnowledgeModal();
  };

  return (
    <FlowGeneralSettingsContainer>
      <aside>
        <p className="FlowGeneralSettings__navLabel">General settings</p>
        <nav className="FlowGeneralSettings__nav" aria-label="General settings">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`FlowGeneralSettings__navItem${activeSection === section.id ? " is-active" : ""
                }`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="FlowGeneralSettings__navItem-icon">
                <Icon icon={section.icon} width={20} height={20} />
              </span>
              <span className="FlowGeneralSettings__navItem-text">
                <span className="FlowGeneralSettings__navItem-title">
                  {section.title}
                </span>
                <span className="FlowGeneralSettings__navItem-description">
                  {section.description}
                </span>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <section
        className={`FlowGeneralSettings__panel${activeSection === "knowledge" ? " is-knowledge" : ""
          }`}
      >
        {activeSection === "knowledge" ? (
          <div className="FlowGeneralSettings__knowledgeHeader">
            <div className="FlowGeneralSettings__panelHeader-content">
              <h3 className="FlowGeneralSettings__panelHeader-title">
                {activeMeta.title}
              </h3>
              <p className="FlowGeneralSettings__panelHeader-description">
                {activeMeta.description}
              </p>
            </div>

            <ActionMenu
              positions={["bottom", "left"]}
              actionItemWidth="13.6875rem"
              children={
                <Button
                  classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
                  style={{ height: "2.5rem" }}
                >
                  Add
                  <Icon icon="iconamoon:arrow-down-2-light" width={20} height={20} />
                </Button>
              }
              actions={[
                {
                  title: "Upload",
                  onClick: () => fileInputRef.current?.click(),
                },
                {
                  title: "Add note",
                  onClick: () => setShowAddNoteModal(true),
                },
              ]}
            />
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileUpload}
            />
          </div>
        ) : (
          <div className="FlowGeneralSettings__panelHeader">
            <div className="FlowGeneralSettings__panelHeader-content">
              <h3 className="FlowGeneralSettings__panelHeader-title">
                {activeMeta.title}
              </h3>
              <p className="FlowGeneralSettings__panelHeader-description">
                {activeMeta.description}
              </p>
            </div>

            {showHeaderActions && (
              <div className="FlowGeneralSettings__panelHeader-actions">
                <Button
                  classes={[ButtonClass.ICON_ONLY, ButtonClass.OUTLINED]}
                  type="button"
                  onClick={handleCancelSettingsChanges}
                >
                  <Icon icon="iconoir:cancel" width={20} height={20} />
                </Button>
                <Button
                  classes={[ButtonClass.SOLID]}
                  size={ButtonSize.WIDTH_140}
                  type="button"
                  onClick={handleSaveSettingsChanges}
                >
                  Save changes
                </Button>
              </div>
            )}
          </div>
        )}

        {activeSection === "setup" && (
          <>
            <SelectInput
              label="Tone"
              placeholder="Select tone"
              options={TONE_OPTIONS}
              value={tone}
              onChange={(val: string | { value: string }) =>
                handleSelectValue(setTone, val)
              }
            />

            <div className="FlowGeneralSettings__languageCard">
              <div className="FlowGeneralSettings__languageCard-header">
                <span>Language</span>
                <button
                  type="button"
                  className="FlowGeneralSettings__languageCard-selectAll"
                  onClick={handleSelectAllLanguages}
                >
                  {allLanguagesSelected ? "Clear" : "Select all"}
                </button>
              </div>
              <CheckboxInput
                name="languages"
                options={LANGUAGE_OPTIONS}
                value={languages}
                onChange={setLanguages}
                direction="column"
              />
            </div>

            <div className="FlowGeneralSettings__toggleRow">
              <span>Voice to text response</span>
              <SwitchInput
                size={SwitchInputSize.SMALL}
                value={voiceToText}
                onChange={setVoiceToText}
                name="voiceToText"
              />
            </div>
          </>
        )}

        {activeSection === "ai-behaviour" && (
          <>
            <CheckboxGroupCard
              title="Conversation Memory"
              options={CONVERSATION_MEMORY_OPTIONS}
              selected={conversationMemory}
              onChange={setConversationMemory}
            />

            <div className="FlowGeneralSettings__memoryCard">
              <p
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  marginBottom: "1rem",
                }}
              >
                Memory retention period
              </p>
              <div className="FlowGeneralSettings__memoryFields">
                <FormInput
                  label="Duration"
                  name="memoryDuration"
                  value={memoryDuration}
                  onChange={(e) => setMemoryDuration(e.target.value)}
                  placeholder="2"
                />
                <SelectInput
                  label="Unit"
                  placeholder="Select unit"
                  options={MEMORY_UNIT_OPTIONS}
                  value={memoryUnit}
                  onChange={(val: string | { value: string }) =>
                    handleSelectValue(setMemoryUnit, val)
                  }
                />
              </div>
            </div>

            <CheckboxGroupCard
              title="Proactive Assistance"
              options={PROACTIVE_ASSISTANCE_OPTIONS}
              selected={proactiveAssistance}
              onChange={setProactiveAssistance}
            />

            <CheckboxGroupCard
              title="Escalation Intelligence"
              options={ESCALATION_INTELLIGENCE_OPTIONS}
              selected={escalationIntelligence}
              onChange={setEscalationIntelligence}
            />

            <div className="FlowGeneralSettings__responseStyleCard">
              <div className="FlowGeneralSettings__responseStyleCard-header">
                <span>Response style</span>
              </div>
              {RESPONSE_STYLE_OPTIONS.map((option) => (
                <div
                  key={option.key}
                  className="FlowGeneralSettings__responseStyleCard-row"
                >
                  <span>{option.label}</span>
                  <SwitchInput
                    size={SwitchInputSize.SMALL}
                    value={responseStyle[option.key]}
                    onChange={(checked) =>
                      setResponseStyle((prev) => ({
                        ...prev,
                        [option.key]: checked,
                      }))
                    }
                    name={option.key}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {activeSection === "guardrails" && (
          <>
            <CheckboxGroupCard
              title="Restricted topics"
              options={RESTRICTED_TOPICS_OPTIONS}
              selected={restrictedTopics}
              onChange={setRestrictedTopics}
            />

            <CheckboxGroupCard
              title="Escalation conditions"
              options={ESCALATION_CONDITIONS_OPTIONS}
              selected={escalationConditions}
              onChange={setEscalationConditions}
            />

            <CheckboxGroupCard
              title="Require approval for"
              options={REQUIRE_APPROVAL_OPTIONS}
              selected={requireApproval}
              onChange={setRequireApproval}
            />

            <CheckboxGroupCard
              title="Response restrictions"
              options={RESPONSE_RESTRICTIONS_OPTIONS}
              selected={responseRestrictions}
              onChange={setResponseRestrictions}
            />

            <CheckboxGroupCard
              title="Behavior detection"
              options={BEHAVIOR_DETECTION_OPTIONS}
              selected={behaviorDetection}
              onChange={setBehaviorDetection}
            />
          </>
        )}

        {activeSection === "knowledge" &&
          (knowledgeItems.length === 0 ? (
            <EmptyState
              className="FlowGeneralSettings__knowledgeEmpty"
              title="No knowledge added yet."
              message="Added knowledge will be listed here"
              icon={<Icon icon="fluent:brain-32-filled" width={30} height={30} />}
            />
          ) : (
            <>
              <div className="FlowGeneralSettings__knowledgeTableHeader">
                <span>Name</span>
                <span>Date added</span>
              </div>
              <div className="FlowGeneralSettings__knowledgeList">
                {knowledgeItems.map((item) => (
                  <div key={item.id} className="FlowGeneralSettings__knowledgeRow">
                    <div className="FlowGeneralSettings__knowledgeRow-main">
                      <span className="FlowGeneralSettings__knowledgeRow-icon">
                        <Icon
                          icon={
                            item.type === "file"
                              ? "basil:document-solid"
                              : "clarity:note-solid"
                          }
                          width={30}
                          height={30}
                          color={item.type === "file" ? "#3B82F6" : "#F59E0B"}
                        />
                      </span>
                      <div className="FlowGeneralSettings__knowledgeRow-text">
                        <span className="FlowGeneralSettings__knowledgeRow-name">
                          {item.name}
                        </span>
                        <span className="FlowGeneralSettings__knowledgeRow-subtitle">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <Flex align="center" gap="0.5rem">
                      <span className="FlowGeneralSettings__knowledgeRow-date">
                        {item.dateAdded}
                      </span>
                      <ActionMenu
                        positions={["bottom", "left"]}
                        actionItemWidth="13.6875rem"
                        children={
                          <Button
                            classes={[ButtonClass.ICON_ONLY]}
                            style={{ height: "2.5rem" }}
                          >
                            <Icon icon="pepicons-pencil:dots-y" width={20} height={20} />
                          </Button>
                        }
                        actions={[
                          {
                            title: "Edit",
                            hidden: item.type === "file",
                            onClick: () => openEditNoteModal(item),
                          },
                          {
                            title: "Delete",
                            classes: "delete-action",
                            onClick: () => openDeleteKnowledgeModal(item),
                          },
                        ]}
                      />
                    </Flex>
                  </div>
                ))}
              </div>
            </>
          ))}

      </section>

      {showAddNoteModal && (
        <Modal title="Add note" onClose={closeAddNoteModal}>
          <Flex direction="column" gap="1.5rem">
            <FormInput
              label="Title"
              name="noteTitle"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Enter title"
            />
            <FormTextarea
              label="Note"
              name="noteContent"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write something here....."
              rows={12}
            />
            <Flex justify="flex-end" gap="0.75rem" style={{ marginTop: "1.5rem" }}>
              <Button
                classes={[ButtonClass.OUTLINED]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={closeAddNoteModal}
              >
                Cancel
              </Button>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={handleAddNote}
                disabled={!noteTitle.trim()}
              >
                Add
              </Button>
            </Flex>
          </Flex>
        </Modal>
      )}

      {showEditNoteModal && selectedKnowledgeItem && (
        <Modal title="Edit note" onClose={closeEditNoteModal}>
          <Flex direction="column" gap="1.5rem">
            <FormInput
              label="Title"
              name="editNoteTitle"
              value={editNoteTitle}
              onChange={(e) => setEditNoteTitle(e.target.value)}
              placeholder="Enter title"
            />
            <FormTextarea
              label="Note"
              name="editNoteContent"
              value={editNoteContent}
              onChange={(e) => setEditNoteContent(e.target.value)}
              placeholder="Write something here....."
              rows={12}
            />
            <Flex justify="flex-end" gap="0.75rem" style={{ marginTop: "1.5rem" }}>
              <Button
                classes={[ButtonClass.OUTLINED]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={closeEditNoteModal}
              >
                Cancel
              </Button>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.WIDTH_140}
                type="button"
                onClick={handleEditNote}
                disabled={!editNoteTitle.trim()}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        </Modal>
      )}

      {showDeleteKnowledgeModal && selectedKnowledgeItem && (
        <ConfirmationModal
          title="Delete knowledge"
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          confirmButtonClasses={[ButtonClass.SOLID_RED]}
          onClose={closeDeleteKnowledgeModal}
          onCancel={closeDeleteKnowledgeModal}
          onConfirm={handleDeleteKnowledge}
        >
          <p style={{ textAlign: "center", margin: 0 }}>
            Are you sure you want to delete{" "}
            <strong>{selectedKnowledgeItem.name}</strong>? This action cannot be
            undone.
          </p>
        </ConfirmationModal>
      )}
    </FlowGeneralSettingsContainer>
  );
};

export default FlowGeneralSettings;
