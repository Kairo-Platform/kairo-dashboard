import { backOfficeBff } from "@/lib/bff/client";

export const backOfficeAuthService = {
  login: (data: Record<string, unknown>) =>
    backOfficeBff.request("auth/login", {
      method: "POST",
      body: data,
    }),
};

export const auth = backOfficeAuthService;
