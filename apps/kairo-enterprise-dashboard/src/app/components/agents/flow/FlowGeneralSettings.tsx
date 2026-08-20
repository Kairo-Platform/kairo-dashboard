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
  Loading,
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
import { getOrgId } from "@/lib/auth/client";
import { parseApiError } from "@/lib/utils/parseApiError";
import {
  arrayToBooleanObject,
  booleanObjectToArray,
  CONVERSATION_MEMORY_KEY_MAP,
  ESCALATION_INTELLIGENCE_KEY_MAP,
  flow,
  getSchemaDefaultValue,
  PROACTIVE_ASSISTANCE_KEY_MAP,
  responseStyleFromBackend,
  responseStyleToBackend,
  toSelectOptions,
  type BackendSettings,
} from "@/services/Flow";
import { fetchFlowSchema, fetchFlowSettings, flowStore } from "@/app/store/flow";
import { showErrorNotification, showSuccessNotification } from "@kairo/utils";
import { useEntity } from "simpler-state";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import {
  formatKnowledgeDate,
} from "./helpers";
import {
  BEHAVIOR_DETECTION_OPTIONS,
  CONVERSATION_MEMORY_OPTIONS,
  ESCALATION_CONDITIONS_OPTIONS,
  ESCALATION_INTELLIGENCE_OPTIONS,
  FALLBACK_GUARDRAIL_OPTIONS,
  FALLBACK_LANGUAGE_OPTIONS,
  FALLBACK_MEMORY_UNIT_OPTIONS,
  FALLBACK_RESPONSE_STYLE_OPTIONS,
  FALLBACK_TONE_OPTIONS,
  GENERAL_SETTINGS_SECTIONS,
  GUARDRAIL_STATE_KEYS,
  PROACTIVE_ASSISTANCE_OPTIONS,
  REQUIRE_APPROVAL_OPTIONS,
  RESPONSE_RESTRICTIONS_OPTIONS,
  RESTRICTED_TOPICS_OPTIONS,
} from "./resources";
import type {
  FlowCheckboxOption,
  GeneralSettingsSection,
  KnowledgeItem,
} from "./types";

export type { GeneralSettingsSection };

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

  > aside {
    position: sticky;
    top: 1rem;
    align-self: start;
    height: fit-content;

    @media (max-width: ${({ theme }) => theme.breakpoint.lg}) {
      position: static;
    }
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
    justify-self: center;
    max-width: 32.5rem;
    width: 100%;

    &.is-knowledge {
      max-width: 41.5625rem;
    }
  }

  .FlowGeneralSettings__panelHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    top: 0;
    z-index: 1;
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
    background-color: ${({ theme }) => theme.colors.ui_07};

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
    background-color: ${({ theme }) => theme.colors.ui_07};
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
  options: FlowCheckboxOption[];
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
  languages: ["en"],
  voiceToText: false,
  conversationMemory: [
    "onboarding-progress",
    "preferred-language",
    "previous-interactions",
    "unfinished-actions",
  ],
  memoryDuration: "2",
  memoryUnit: "MONTHS",
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

function fromBackendGeneral(
  general: BackendSettings["general"],
): EditableSettingsState {
  const { setup, aiBehaviour, guardrails } = general;

  const DEFAULT_MEM = {
    rememberOnboardingProgress: false,
    rememberPreferredLanguage: false,
    rememberPreviousInteractions: false,
    rememberUnfinishedActions: false,
  };
  const DEFAULT_PA = {
    suggestNextActions: false,
    recommendOnboardingSteps: false,
    remindInactiveUsers: false,
    recommendWalletFunding: false,
  };
  const DEFAULT_EI = {
    detectFrustration: false,
    detectRepeatedConfusion: false,
    escalateUnresolvedIssues: false,
    escalateFinancialDisputes: false,
  };

  return {
    tone: setup.tone ?? "",
    languages: setup.languages ?? ["en"],
    voiceToText: setup.voiceToTextResponse ?? false,
    conversationMemory: booleanObjectToArray(
      { ...DEFAULT_MEM, ...(aiBehaviour?.conversationMemory ?? {}) },
      CONVERSATION_MEMORY_KEY_MAP,
    ),
    memoryDuration: String(
      aiBehaviour?.memoryRetentionPeriod?.duration ?? "2",
    ),
    memoryUnit: aiBehaviour?.memoryRetentionPeriod?.unit ?? "MONTHS",
    proactiveAssistance: booleanObjectToArray(
      { ...DEFAULT_PA, ...(aiBehaviour?.proactiveAssistance ?? {}) },
      PROACTIVE_ASSISTANCE_KEY_MAP,
    ),
    escalationIntelligence: booleanObjectToArray(
      { ...DEFAULT_EI, ...(aiBehaviour?.escalationIntelligence ?? {}) },
      ESCALATION_INTELLIGENCE_KEY_MAP,
    ),
    responseStyle: responseStyleFromBackend(
      aiBehaviour?.responseStyle ?? "CONVERSATIONAL",
    ),
    restrictedTopics: guardrails?.restrictedTopics ?? [],
    escalationConditions: guardrails?.escalationConditions ?? [],
    requireApproval: guardrails?.requireApprovalFor ?? [],
    responseRestrictions: guardrails?.responseRestrictions ?? [],
    behaviorDetection: guardrails?.behaviorDetection ?? [],
  };
}

function fromBackendKnowledgeItems(
  general: BackendSettings["general"],
): KnowledgeItem[] {
  const items = general.knowledgeBase?.items;
  if (!Array.isArray(items)) return [];

  return items.map((item, index) => {
    const entry = (item ?? {}) as Record<string, unknown>;
    const type = entry.type === "file" ? "file" : "note";
    const name =
      typeof entry.name === "string" && entry.name.trim()
        ? entry.name
        : `Knowledge ${index + 1}`;
    const subtitle =
      typeof entry.subtitle === "string" && entry.subtitle.trim()
        ? entry.subtitle
        : type === "file"
          ? "File"
          : "Note";
    const dateAdded =
      typeof entry.dateAdded === "string" && entry.dateAdded.trim()
        ? entry.dateAdded
        : formatKnowledgeDate(new Date());
    const content =
      typeof entry.content === "string" ? entry.content : undefined;

    return {
      id:
        typeof entry.id === "string" && entry.id.trim()
          ? entry.id
          : crypto.randomUUID(),
      type,
      name,
      subtitle,
      dateAdded,
      content,
    };
  });
}

function toBackendGeneral(
  s: EditableSettingsState,
  knowledgeItems: KnowledgeItem[],
): BackendSettings["general"] {
  const DEFAULT_MEM = {
    rememberOnboardingProgress: false,
    rememberPreferredLanguage: false,
    rememberPreviousInteractions: false,
    rememberUnfinishedActions: false,
  };
  const DEFAULT_PA = {
    suggestNextActions: false,
    recommendOnboardingSteps: false,
    remindInactiveUsers: false,
    recommendWalletFunding: false,
  };
  const DEFAULT_EI = {
    detectFrustration: false,
    detectRepeatedConfusion: false,
    escalateUnresolvedIssues: false,
    escalateFinancialDisputes: false,
  };

  return {
    setup: {
      tone: s.tone,
      languages: s.languages,
      voiceToTextResponse: s.voiceToText,
    },
    aiBehaviour: {
      conversationMemory: arrayToBooleanObject(
        s.conversationMemory,
        CONVERSATION_MEMORY_KEY_MAP,
        DEFAULT_MEM,
      ),
      memoryRetentionPeriod: {
        duration: Number(s.memoryDuration) || 2,
        unit: s.memoryUnit,
      },
      proactiveAssistance: arrayToBooleanObject(
        s.proactiveAssistance,
        PROACTIVE_ASSISTANCE_KEY_MAP,
        DEFAULT_PA,
      ),
      escalationIntelligence: arrayToBooleanObject(
        s.escalationIntelligence,
        ESCALATION_INTELLIGENCE_KEY_MAP,
        DEFAULT_EI,
      ),
      responseStyle: responseStyleToBackend(s.responseStyle),
    },
    guardrails: {
      restrictedTopics: s.restrictedTopics,
      escalationConditions: s.escalationConditions,
      requireApprovalFor: s.requireApproval,
      responseRestrictions: s.responseRestrictions,
      behaviorDetection: s.behaviorDetection,
    },
    knowledgeBase: {
      items: knowledgeItems.map((item) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        subtitle: item.subtitle,
        dateAdded: item.dateAdded,
        content: item.content ?? "",
      })),
    },
  };
}

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
  const [savedKnowledgeItems, setSavedKnowledgeItems] = useState<
    KnowledgeItem[]
  >([]);
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

  const [isSaving, setIsSaving] = useState(false);

  const { flowSettings, fetchingFlowSettings, flowSchema, fetchingFlowSchema } =
    useEntity(flowStore);

  useEffect(() => {
    fetchFlowSettings().catch(() => { });
    fetchFlowSchema().catch(() => { });
  }, []);

  useEffect(() => {
    if (!flowSettings?.general) return;
    const mapped = fromBackendGeneral(flowSettings.general);
    const mappedKnowledgeItems = fromBackendKnowledgeItems(flowSettings.general);
    applyEditableSettings(mapped, {
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
    setSavedSettings({
      ...mapped,
      languages: [...mapped.languages],
      conversationMemory: [...mapped.conversationMemory],
      proactiveAssistance: [...mapped.proactiveAssistance],
      escalationIntelligence: [...mapped.escalationIntelligence],
      responseStyle: { ...mapped.responseStyle },
      restrictedTopics: [...mapped.restrictedTopics],
      escalationConditions: [...mapped.escalationConditions],
      requireApproval: [...mapped.requireApproval],
      responseRestrictions: [...mapped.responseRestrictions],
      behaviorDetection: [...mapped.behaviorDetection],
    });
    setKnowledgeItems(mappedKnowledgeItems);
    setSavedKnowledgeItems(
      mappedKnowledgeItems.map((item) => ({ ...item })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowSettings]);

  const activeMeta = useMemo(
    () =>
      GENERAL_SETTINGS_SECTIONS.find((section) => section.id === activeSection) ?? GENERAL_SETTINGS_SECTIONS[0],
    [activeSection],
  );

  const toneOptions = useMemo(
    () => toSelectOptions(flowSchema?.tones, FALLBACK_TONE_OPTIONS),
    [flowSchema],
  );

  const languageOptions = useMemo(
    () => toSelectOptions(flowSchema?.languages, FALLBACK_LANGUAGE_OPTIONS),
    [flowSchema],
  );

  const memoryUnitOptions = useMemo(
    () => toSelectOptions(flowSchema?.retentionUnits, FALLBACK_MEMORY_UNIT_OPTIONS),
    [flowSchema],
  );

  const responseStyleOptions = useMemo(
    () =>
      toSelectOptions(flowSchema?.responseStyles, FALLBACK_RESPONSE_STYLE_OPTIONS),
    [flowSchema],
  );

  const selectedResponseStyle = useMemo(() => {
    if (responseStyle.shortReplies) return "SHORT_REPLIES";
    if (responseStyle.conversational) return "CONVERSATIONAL";
    if (responseStyle.detailedGuidance) return "DETAILED_GUIDANCE";
    return getSchemaDefaultValue(flowSchema?.responseStyles, "CONVERSATIONAL");
  }, [responseStyle, flowSchema]);

  const guardrailSections = useMemo(() => {
    if (!flowSchema?.guardrails?.length) {
      return [
        {
          field: "restrictedTopics",
          label: "Restricted topics",
          options: RESTRICTED_TOPICS_OPTIONS,
          selected: restrictedTopics,
          onChange: setRestrictedTopics,
        },
        {
          field: "escalationConditions",
          label: "Escalation conditions",
          options: ESCALATION_CONDITIONS_OPTIONS,
          selected: escalationConditions,
          onChange: setEscalationConditions,
        },
        {
          field: "requireApprovalFor",
          label: "Require approval for",
          options: REQUIRE_APPROVAL_OPTIONS,
          selected: requireApproval,
          onChange: setRequireApproval,
        },
        {
          field: "responseRestrictions",
          label: "Response restrictions",
          options: RESPONSE_RESTRICTIONS_OPTIONS,
          selected: responseRestrictions,
          onChange: setResponseRestrictions,
        },
        {
          field: "behaviorDetection",
          label: "Behavior detection",
          options: BEHAVIOR_DETECTION_OPTIONS,
          selected: behaviorDetection,
          onChange: setBehaviorDetection,
        },
      ];
    }

    const stateByField: Record<
      string,
      { selected: string[]; onChange: (values: string[]) => void }
    > = {
      restrictedTopics: { selected: restrictedTopics, onChange: setRestrictedTopics },
      escalationConditions: {
        selected: escalationConditions,
        onChange: setEscalationConditions,
      },
      requireApprovalFor: { selected: requireApproval, onChange: setRequireApproval },
      responseRestrictions: {
        selected: responseRestrictions,
        onChange: setResponseRestrictions,
      },
      behaviorDetection: { selected: behaviorDetection, onChange: setBehaviorDetection },
    };

    return flowSchema.guardrails.map((field) => {
      const stateKey =
        GUARDRAIL_STATE_KEYS[field.field as keyof typeof GUARDRAIL_STATE_KEYS];
      const fallback =
        FALLBACK_GUARDRAIL_OPTIONS[field.field as keyof typeof FALLBACK_GUARDRAIL_OPTIONS] ??
        [];
      const state = stateByField[field.field] ??
        stateByField[stateKey] ?? {
        selected: [],
        onChange: () => { },
      };

      return {
        field: field.field,
        label: field.label,
        options: toSelectOptions(field.options, fallback),
        selected: state.selected,
        onChange: state.onChange,
      };
    });
  }, [
    flowSchema,
    restrictedTopics,
    escalationConditions,
    requireApproval,
    responseRestrictions,
    behaviorDetection,
  ]);

  const isLoadingSettings = fetchingFlowSettings || fetchingFlowSchema;

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

  const allLanguageValues = languageOptions.map((option) => option.value);
  const allLanguagesSelected = languages.length === allLanguageValues.length;

  const handleSelectAllLanguages = () => {
    setLanguages(allLanguagesSelected ? [languageOptions[0]?.value ?? "en"] : allLanguageValues);
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

  const handleSaveSettingsChanges = async () => {
    const snapshot = {
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
    };

    const orgId = getOrgId();
    const knowledgeSnapshot = knowledgeItems.map((item) => ({ ...item }));

    if (!orgId) {
      setSavedSettings(snapshot);
      setSavedKnowledgeItems(knowledgeSnapshot);
      showSuccessNotification({ message: "Settings saved" });
      return;
    }

    setIsSaving(true);

    try {
      await flow.saveSettings(orgId, {
        general: toBackendGeneral(snapshot, knowledgeSnapshot),
      });
      setSavedSettings(snapshot);
      setSavedKnowledgeItems(knowledgeSnapshot);
      showSuccessNotification({ message: "Settings saved" });
    } catch (error) {
      showErrorNotification({
        message: parseApiError(error, "Failed to save settings"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const persistKnowledgeItems = async (
    nextItems: KnowledgeItem[],
    successMessage: string,
  ) => {
    const previousItems = savedKnowledgeItems.map((item) => ({ ...item }));
    setKnowledgeItems(nextItems);

    const orgId = getOrgId();
    if (!orgId) {
      setSavedKnowledgeItems(nextItems.map((item) => ({ ...item })));
      showSuccessNotification({ message: successMessage });
      return;
    }

    try {
      await flow.saveSettings(orgId, {
        general: toBackendGeneral(currentSettings, nextItems),
      });
      setSavedKnowledgeItems(nextItems.map((item) => ({ ...item })));
      showSuccessNotification({ message: successMessage });
    } catch (error) {
      setKnowledgeItems(previousItems);
      showErrorNotification({
        message: parseApiError(error, "Failed to save knowledge"),
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
    const name = file.name.replace(/\.[^/.]+$/, "");
    const nextItems = [
      ...knowledgeItems,
      {
        id: crypto.randomUUID(),
        type: "file" as const,
        name,
        subtitle: extension,
        dateAdded: formatKnowledgeDate(new Date()),
      },
    ];

    void persistKnowledgeItems(nextItems, "Knowledge file added");
    event.target.value = "";
  };

  const handleAddNote = () => {
    if (!noteTitle.trim()) return;

    const nextItems = [
      ...knowledgeItems,
      {
        id: crypto.randomUUID(),
        type: "note" as const,
        name: noteTitle.trim(),
        subtitle: "Note",
        dateAdded: formatKnowledgeDate(new Date()),
        content: noteContent,
      },
    ];

    setNoteTitle("");
    setNoteContent("");
    setShowAddNoteModal(false);
    void persistKnowledgeItems(nextItems, "Note added");
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

    const nextItems = knowledgeItems.map((item) =>
      item.id === selectedKnowledgeItem.id
        ? {
          ...item,
          name: editNoteTitle.trim(),
          content: editNoteContent,
        }
        : item,
    );

    closeEditNoteModal();
    void persistKnowledgeItems(nextItems, "Note updated");
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
    const nextItems = knowledgeItems.filter(
      (item) => item.id !== selectedKnowledgeItem.id,
    );
    closeDeleteKnowledgeModal();
    void persistKnowledgeItems(nextItems, "Knowledge deleted");
  };

  return (
    <FlowGeneralSettingsContainer>
      {isLoadingSettings ? (
        <Flex align="center" justify="center" style={{ height: "10rem" }}>
          <Loading>Loading settings ...</Loading>
        </Flex>
      ) : (
        <>
          <aside>
            <p className="FlowGeneralSettings__navLabel">General settings</p>
            <nav className="FlowGeneralSettings__nav" aria-label="General settings">
              {GENERAL_SETTINGS_SECTIONS.map((section) => (
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
                      disabled={isSaving}
                      onClick={handleCancelSettingsChanges}
                    >
                      <Icon icon="iconoir:cancel" width={20} height={20} />
                    </Button>
                    <Button
                      classes={[ButtonClass.SOLID]}
                      size={ButtonSize.WIDTH_140}
                      type="button"
                      disabled={isSaving}
                      loading={isSaving}
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
                  options={toneOptions}
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
                    options={languageOptions}
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
                      options={memoryUnitOptions}
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

                <SelectInput
                  label="Response style"
                  placeholder="Select response style"
                  options={responseStyleOptions}
                  value={selectedResponseStyle}
                  onChange={(val: string | { value: string }) => {
                    const value =
                      val && typeof val === "object" && "value" in val
                        ? String(val.value)
                        : String(val ?? "");
                    setResponseStyle(responseStyleFromBackend(value));
                  }}
                />
              </>
            )}

            {activeSection === "guardrails" && (
              <>
                {guardrailSections.map((section) => (
                  <CheckboxGroupCard
                    key={section.field}
                    title={section.label}
                    options={section.options}
                    selected={section.selected}
                    onChange={section.onChange}
                  />
                ))}
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
        </>
      )}
    </FlowGeneralSettingsContainer>
  );
};

export default FlowGeneralSettings;
