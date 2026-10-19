import type {
  FlowConversation,
  FlowConversationMessage,
} from "@/services/Flow/types";

export interface DashboardComparison {
  startDate: string | null;
  endDate: string;
  mode: "PREVIOUS_PERIOD" | "PREVIOUS_DAY_SNAPSHOT";
}

export type AnalyticsMetric =
  | "totalConversations"
  | "activeUsers"
  | "openConversations"
  | "aiOverallHealthScore"
  | "humanEscalationRate"
  | "conversationVolume"
  | "averageResponseTimeSeconds";

export type AgentFilter = "all" | "flow";
export interface AnalyticsPoint {
  timestamp: string;
  value: number | null;
  sampleCount?: number | null;
}
export interface DashboardAnalytics {
  agent: AgentFilter;
  startDate: string;
  endDate: string;
  timezone: string;
  interval: "hour" | "day";
  totalConversations: number;
  activeUsers: number;
  openConversations: number;
  aiOverallHealthScore: number | null;
  aiHealth?: {
    eligibleRequests: number;
    evaluatedRequests: number;
    coveragePercentage: number;
    minimumSamples: number;
    rubricVersion: string;
    scope: string;
    unavailableReason: string | null;
    sampledRequests: number;
    pendingEvaluations: number;
    failedEvaluations: number;
    unscorableRequests: number;
    samplePercent: number;
  } | null;
  humanEscalationRate: number | null;
  averageResponseTimeSeconds: number | null;
  conversationVolume: AnalyticsPoint[];
  averageResponseTime: AnalyticsPoint[];
  intentBreakdown: { intent: string; count: number }[] | null;
  unavailableMetrics: Record<string, string>;
  comparison?: DashboardComparison | null;
  percentageChanges?: Partial<Record<AnalyticsMetric, number | null>>;
}
export interface ConversationDetail {
  id: string;
  user: FlowConversation["user"];
  agent: "flow";
  messages: FlowConversationMessage[];
  lastMessageAt?: string | null;
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}
export interface DashboardUsersPage {
  items: {
    id: string;
    displayName?: string | null;
    channel: string;
    channelUserId: string;
    status: "ACTIVE" | "INACTIVE" | "UNKNOWN";
    onboardingStatus: string;
    createdAt: string;
  }[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  analytics: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    suspendedUsers: number;
    suspensionSupported: boolean;
    comparison?: DashboardComparison | null;
    percentageChanges?: Partial<
      Record<
        | "totalUsers"
        | "activeUsers"
        | "inactiveUsers"
        | "unknownUsers"
        | "suspendedUsers",
        number | null
      >
    >;
  };
}
