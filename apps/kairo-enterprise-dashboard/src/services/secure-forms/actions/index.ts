import { z } from "zod";
import { createSecureFormService } from "..";
import type { SecureFormOrigin } from "../origin";

export type ActionFormType =
  | "transfer_pin"
  | "business_setup"
  | "dashboard_login";
export type ActionFormSession = {
  type: ActionFormType;
  stage:
    | "PIN_AUTHORIZATION"
    | "BUSINESS_INFO"
    | "PROCESSING"
    | "DONE"
    | "PASSWORD_SETUP"
    | "PASSCODE_SETUP"
    | "UNCERTAIN"
    | "UNAVAILABLE";
  expiresAt: string;
  credentialType?: "PASSWORD" | "PASSCODE";
  instructions?: string;
  message?: string;
  loginUrl?: string;
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

const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(1024)
  .regex(/[a-z]/, "Include a lowercase letter.")
  .regex(/[A-Z]/, "Include an uppercase letter.")
  .regex(/[0-9]/, "Include a digit.")
  .regex(/[@$!%*?&]/, "Include one of @$!%*?&.");
const passcode = z.string().regex(/^[0-9]{6}$/, "Enter a six-digit passcode.");
export const dashboardLoginSchema = z
  .discriminatedUnion("screen", [
    z
      .object({
        action: z.literal("submit"),
        screen: z.literal("PASSWORD_SETUP"),
        data: z
          .object({ password, confirmation: z.string().max(1024) })
          .strict(),
      })
      .strict(),
    z
      .object({
        action: z.literal("submit"),
        screen: z.literal("PASSCODE_SETUP"),
        data: z.object({ passcode, confirmation: z.string().max(6) }).strict(),
      })
      .strict(),
  ])
  .superRefine((value, context) => {
    const credential =
      value.screen === "PASSWORD_SETUP"
        ? value.data.password
        : value.data.passcode;
    if (credential !== value.data.confirmation)
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["data", "confirmation"],
        message: "The two entries don’t match. Please enter them again.",
      });
  });
