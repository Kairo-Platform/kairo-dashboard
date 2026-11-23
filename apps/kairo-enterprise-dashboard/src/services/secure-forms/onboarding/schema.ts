import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import type { SecureFormOrigin } from "../origin";

export function isNigerianPhone(value: string) {
  return /^(?:0[789]\d{9}|\+?234[789]\d{9})$/.test(
    value.replace(/[ ()-]/g, ""),
  );
}

export function normalizeWhatsAppPhone(input: string, countryCode?: string) {
  if (input.length > 32) return undefined;
  const value = input.trim().replace(/[ ()-]/g, "");
  if (!/^\+?[0-9]+$/.test(value)) return undefined;
  const code = countryCode?.trim().replace(/^\+/, "");
  if (code !== undefined && !/^[1-9][0-9]{0,2}$/.test(code)) return undefined;
  let candidate: string;
  if (value.startsWith("+")) candidate = value;
  else if (code !== undefined) {
    const full = parsePhoneNumberFromString(`+${value}`);
    candidate =
      full?.countryCallingCode === code && full.isValid()
        ? `+${value}`
        : `+${code}${value}`;
  } else if (/^0?[789][0-9]{9}$/.test(value)) {
    candidate = `+234${value.replace(/^0/, "")}`;
  } else if (value.length >= 11) candidate = `+${value}`;
  else return undefined;
  const phone = parsePhoneNumberFromString(candidate);
  if (
    !phone?.isValid() ||
    (code !== undefined && phone.countryCallingCode !== code)
  )
    return undefined;
  return phone.number;
}

export const phoneSchema = z
  .object({
    action: z.literal("phone"),
    countryCode: z
      .string()
      .trim()
      .regex(
        /^\+?[1-9][0-9]{0,2}$/,
        "Enter a valid country code, such as +234.",
      )
      .optional(),
    phone: z.string().trim().max(25),
    nigerianPhone: z.string().trim().max(25).optional(),
  })
  .superRefine((value, context) => {
    const phone = normalizeWhatsAppPhone(value.phone, value.countryCode);
    if (!phone) {
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid WhatsApp number matching the country code.",
      });
    } else if (
      !isNigerianPhone(phone) &&
      !isNigerianPhone(value.nigerianPhone ?? "")
    ) {
      context.addIssue({
        code: "custom",
        path: ["nigerianPhone"],
        message: "Enter the Nigerian phone number for your Kairo account.",
      });
    }
  })
  .transform((value) => ({
    ...value,
    phone: normalizeWhatsAppPhone(value.phone, value.countryCode)!,
  }));

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
