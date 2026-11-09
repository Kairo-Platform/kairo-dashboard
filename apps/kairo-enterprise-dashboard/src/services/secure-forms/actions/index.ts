import { z } from "zod";
import { createSecureFormService } from "..";
import type { SecureFormOrigin } from "../origin";

export type ActionFormType = "transfer_pin" | "business_setup";
export type ActionFormSession = {
  type: ActionFormType;
  stage: "PIN_AUTHORIZATION" | "BUSINESS_INFO" | "PROCESSING" | "DONE";
  expiresAt: string;
  origin?: SecureFormOrigin;
  data: {
    authorization_heading?: string;
    authorization_detail?: string;
    show_authorization_detail?: boolean;
    error_message?: string;
    show_error?: boolean;
  };
};
export const transferPinSchema = z.object({
  action: z.literal("submit"),
  screen: z.literal("PIN_AUTHORIZATION"),
  data: z.object({
    pin: z.string().regex(/^[0-9]{4}$/, "Enter your four-digit PIN."),
  }),
});
export const businessSetupSchema = z.object({
  action: z.literal("submit"),
  screen: z.literal("BUSINESS_INFO"),
  data: z.object({
    businessName: z
      .string()
      .trim()
      .min(2, "Enter your business name.")
      .max(255),
    businessType: z
      .string()
      .trim()
      .min(1, "Enter your business type.")
      .max(255),
    email: z.string().trim().email("Enter a valid business email.").max(255),
    address: z.string().trim().min(1, "Enter your business address.").max(500),
    tagline: z.string().trim().max(255).optional(),
    rcNumber: z.string().trim().max(255).optional(),
  }),
});
export const actionFormService = (type: ActionFormType) =>
  createSecureFormService<ActionFormSession>(type);
