import { z } from "zod";
import type { SecureFormOrigin } from "../origin";

export function isNigerianPhone(value: string) {
  return /^(?:0[789]\d{9}|\+?234[789]\d{9})$/.test(
    value.replace(/[ ()-]/g, ""),
  );
}

export const phoneSchema = z
  .object({
    action: z.literal("phone"),
    phone: z
      .string()
      .trim()
      .max(25)
      .refine(
        (value) =>
          isNigerianPhone(value) ||
          /^\+?[1-9]\d{6,14}$/.test(value.replace(/[ ()-]/g, "")),
        "Enter your WhatsApp number with its country code.",
      ),
    nigerianPhone: z.string().trim().max(25).optional(),
  })
  .superRefine((value, context) => {
    if (
      !isNigerianPhone(value.phone) &&
      !isNigerianPhone(value.nigerianPhone ?? "")
    ) {
      context.addIssue({
        code: "custom",
        path: ["nigerianPhone"],
        message: "Enter the Nigerian phone number for your Kairo account.",
      });
    }
  });

export const personalSchema = z.object({
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter your date of birth.")
    .refine((value) => {
      const date = new Date(value);
      return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value &&
        date < new Date(new Date().toISOString().slice(0, 10))
      );
    }, "Enter a valid date of birth in the past."),
  bvn: z.string().regex(/^\d{11}$/, "BVN must contain 11 digits."),
  nin: z.string().regex(/^\d{11}$/, "NIN must contain 11 digits."),
  email: z.string().trim().max(255).email("Enter a valid email address."),
  gender: z.enum(["MALE", "FEMALE"], {
    errorMap: () => ({ message: "Select your gender." }),
  }),
  phone_number: z.string().trim().max(25).optional(),
  referral_code: z
    .string()
    .trim()
    .max(11, "Referral code must be 11 characters or fewer.")
    .optional(),
});

export const pinSchema = z
  .object({
    pin: z.string().regex(/^\d{4}$/, "Choose a four-digit PIN."),
    pin_confirmation: z
      .string()
      .regex(/^\d{4}$/, "Repeat your four-digit PIN."),
  })
  .refine((value) => value.pin === value.pin_confirmation, {
    path: ["pin_confirmation"],
    message: "The PINs do not match.",
  });

export const verificationCodeSchema = z.object({
  action: z.literal("verify_code"),
  code: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Enter the six-digit code sent to your WhatsApp."),
});

export const submissionSchema = z.union([
  verificationCodeSchema,
  z.object({ action: z.literal("resend_code") }),
  phoneSchema,
  z.object({
    action: z.literal("submit"),
    screen: z.literal("TERMS"),
    data: z.object({ consent: z.literal(true) }),
  }),
  z.object({
    action: z.literal("submit"),
    screen: z.literal("PERSONAL_INFO"),
    data: personalSchema,
  }),
  z.object({
    action: z.literal("submit"),
    screen: z.literal("PIN_SETUP"),
    data: pinSchema,
  }),
]);

export type SecureSession = {
  type: "onboarding";
  stage: "PHONE" | "VERIFY" | "TERMS" | "PERSONAL_INFO" | "PIN_SETUP" | "DONE";
  mode: "NEW" | "EXISTING";
  expiresAt: string;
  phoneRequired: boolean;
  referralCode: string;
  nigerianPhone: string;
  completed: boolean;
  maskedPhone?: string;
  codeDelivery?: "NOT_SENT" | "ACCEPTED" | "UNCONFIRMED";
  codeExpired?: boolean;
  codeLocked?: boolean;
  codeExpiresAt?: string;
  resendAvailableAt?: string;
  origin?: SecureFormOrigin;
};
