export type ReconciliationRunResponse = {
  runId: string;
  wsUrl: string;
};

export type ReconciliationStatus = {
  status: string;
  [key: string]: unknown;
};

export type ReconciliationDiscrepancy = {
  type: string;
  severity: string;
  reference: string;
  amountDetail: string;
  likelyCause: string;
  suggestedAction: string;
};

export type ReconciliationResult = {
  summary: string;
  inSync: boolean;
  matchedValue: string;
  matchedGroups: number;
  actionRequiredCount: number;
  informationalCount: number;
  unreadableRows: number;
  discrepancies: ReconciliationDiscrepancy[];
};

export type ReconciliationRunState = ReconciliationStatus | ReconciliationResult;
