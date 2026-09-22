import { xApiBff } from "@/lib/bff/client";
import type {
  ReconciliationRunResponse,
  ReconciliationRunState,
} from "./types";

const RECONCILIATION_BASE = "v1/agents/reconciliation";

export const reconciliation = {
  run: (files: File[], apiKey: string) => {
    const body = new FormData();
    files.forEach((file, index) => {
      body.append(`file${String.fromCharCode(65 + index)}`, file);
    });
    return xApiBff.request<ReconciliationRunResponse>(
      `${RECONCILIATION_BASE}/run`,
      { method: "POST", body, headers: { "X-Api-Key": apiKey } },
    );
  },

  getResult: (runId: string, apiKey: string) =>
    xApiBff.request<ReconciliationRunState>(
      `${RECONCILIATION_BASE}/runs/${encodeURIComponent(runId)}`,
      { headers: { "X-Api-Key": apiKey } },
    ),
};
