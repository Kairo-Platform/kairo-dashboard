"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styled from "styled-components";
import SecureFormBrand from "./SecureFormBrand";
import {
  formConversation,
  formReturnLink,
} from "@/services/secure-forms/origin";
import { Button, ButtonClass, ButtonSize } from "@kairo/ui";
import { FormInput, SelectInput } from "@kairo/ui/inputs";
import { secureOnboardingService as service } from "@/services/secure-forms/onboarding";
import {
  isNigerianPhone,
  personalSchema,
  phoneSchema,
  pinSchema,
  type SecureSession,
} from "@/services/secure-forms/onboarding/schema";

const Main = styled.main`
  min-height: 100dvh;
  padding: 32px 20px;
  background: ${({ theme }) => theme.colors.bgColor};
  color: ${({ theme }) => theme.colors.text_01};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  @media (min-width: 600px) {
    padding-top: 64px;
  }
`;
const Card = styled.section`
  width: 100%;
  max-width: 480px;
  padding: 28px 24px;
  background: ${({ theme }) => theme.colors.ui_07};
  border: 1px solid ${({ theme }) => theme.colors.dividerColor};
  border-radius: 20px;
  h1 {
    font-size: 26px;
    line-height: 1.3;
    margin: 20px 0 12px;
  }
  p {
    line-height: 1.6;
    margin-bottom: 20px;
  }
  form {
    display: grid;
    gap: 20px;
  }
  input {
    font-size: 16px;
  }
  a {
    color: ${({ theme }) => theme.colors.primaryColor};
  }
  small {
    display: block;
    color: ${({ theme }) => theme.colors.text_02};
    line-height: 1.6;
  }
`;
const LinkButton = styled.a`
  display: block;
  padding: 14px 20px;
  border-radius: 10px;
  text-align: center;
  background: ${({ theme }) => theme.colors.primaryColor};
  color: ${({ theme }) => theme.colors.white} !important;
  text-decoration: none;
  font-weight: 500;
  margin: 20px 0;
`;
const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.red};
  padding: 12px;
  background: ${({ theme }) => theme.colors.red_02};
  border-radius: 8px;
`;
const Check = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.5;
  input {
    margin-top: 5px;
  }
`;

export default function SecureOnboardingForm() {
  const [session, setSession] = useState<SecureSession | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const initial = useRef<Promise<SecureSession> | null>(null);
  const conversation = formConversation(session?.origin);
  const returnLink = formReturnLink(session?.origin);

  useEffect(() => {
    let mounted = true;
    if (!initial.current) {
      const token = new URLSearchParams(window.location.hash.slice(1)).get(
        "token",
      );
      // Remove the capability before requests, navigation or rendering other links.
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?type=onboarding`,
      );
      initial.current = (async () => {
        if (token) await service.exchange(token);
        return service.session();
      })();
    }
    void initial.current
      .then((value) => {
        if (mounted) setSession(value);
      })
      .catch(() => {
        if (mounted)
          setError(
            "This secure form could not be opened. Return to your Kairo conversation and request a new one.",
          );
      });
    const clear = () => {
      setFields({});
      setConsent(false);
    };
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
    };
    window.addEventListener("pagehide", clear);
    window.addEventListener("pageshow", restore);
    return () => {
      mounted = false;
      window.removeEventListener("pagehide", clear);
      window.removeEventListener("pageshow", restore);
    };
  }, []);

  useEffect(() => {
    if (session?.stage !== "VERIFY") return;
    let mounted = true;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void service
        .session()
        .then((value) => {
          if (mounted) {
            setSession(value);
            setError("");
          }
        })
        .catch(() => {
          if (mounted) {
            setError(
              `Verification expired. Return to ${conversation} to open a new form.`,
            );
            window.clearInterval(timer);
          }
        });
    }, 3000);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, [session?.stage, conversation]);

  useEffect(() => {
    if (session?.stage === "DONE") void service.close().catch(() => {});
  }, [session?.stage]);

  const change = (key: string, value: string) =>
    setFields((previous) => ({ ...previous, [key]: value }));
  const field = (
    key: string,
    label: string,
    options: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <FormInput
      key={key}
      id={key}
      name={key}
      label={label}
      aria-label={label}
      value={fields[key] ?? ""}
      autoComplete="off"
      onChange={(event) => change(key, event.target.value)}
      {...options}
    />
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!session || busy) return;
    setError("");
    let payload: unknown;
    if (session.stage === "PHONE") {
      const result = phoneSchema.safeParse({
        action: "phone",
        phone: fields.phone ?? "",
        nigerianPhone: fields.nigerianPhone,
      });
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "Check your phone number.");
        return;
      }
      payload = result.data;
    } else if (session.stage === "TERMS") {
      if (!consent) {
        setError("Please read and accept the terms to continue.");
        return;
      }
      payload = { action: "submit", screen: "TERMS", data: { consent: true } };
    } else if (session.stage === "PERSONAL_INFO") {
      const result = personalSchema.safeParse({
        ...fields,
        referral_code: session.referralCode || fields.referral_code || "",
        phone_number: fields.phone_number ?? session.nigerianPhone,
      });
      if (!result.success) {
        setError(
          result.error.issues[0]?.message ?? "Check your personal details.",
        );
        return;
      }
      if (
        session.phoneRequired &&
        !isNigerianPhone(result.data.phone_number ?? "")
      ) {
        setError("Enter a valid Nigerian phone number.");
        return;
      }
      payload = {
        action: "submit",
        screen: "PERSONAL_INFO",
        data: result.data,
      };
    } else if (session.stage === "PIN_SETUP") {
      const result = pinSchema.safeParse(fields);
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "Check your PIN.");
        return;
      }
      payload = { action: "submit", screen: "PIN_SETUP", data: result.data };
    } else return;
    setBusy(true);
    try {
      const next = await service.submit(payload);
      setFields({});
      setConsent(false);
      setSession(next);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Please try again.",
      );
      if (session.stage === "PIN_SETUP") setFields({});
      // A network interruption can hide a successful submission. Resume the saved step.
      try {
        const current = await service.session();
        if (current.stage !== session.stage) {
          setFields({});
          setSession(current);
          setError("");
        }
      } catch {
        /* Keep the original error; the user can reopen from their Kairo conversation. */
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Main>
      <Card aria-busy={busy}>
        <SecureFormBrand />
        {!session && (
          <>
            <h1>Secure signup</h1>
            {!error && <p>Opening your secure form…</p>}
          </>
        )}
        {session?.stage === "PHONE" && (
          <>
            <h1>
              {session.mode === "EXISTING"
                ? "Connect your Kairo account"
                : "Let’s get you started"}
            </h1>
            <p>
              Enter your WhatsApp number. You’ll approve the connection from
              WhatsApp to confirm it belongs to you.
            </p>
            <form onSubmit={submit} autoComplete="off">
              {field("phone", "WhatsApp number", {
                type: "tel",
                inputMode: "tel",
                placeholder: "+234…",
                required: true,
                maxLength: 25,
              })}
              {!!fields.phone && !isNigerianPhone(fields.phone) && (
                <>
                  <small>
                    For an international WhatsApp number, we also need the
                    Nigerian number{" "}
                    {session.mode === "EXISTING"
                      ? "you used to sign up with Kairo"
                      : "to create your account"}
                    .
                  </small>
                  {field("nigerianPhone", "Phone number (+234)", {
                    type: "tel",
                    inputMode: "tel",
                    required: true,
                    maxLength: 25,
                  })}
                </>
              )}
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.FULL}
                type="submit"
                disabled={busy}
              >
                {busy ? "Continuing…" : "Continue"}
              </Button>
            </form>
          </>
        )}
        {session?.stage === "VERIFY" && (
          <>
            <h1>Verify on WhatsApp</h1>
            <p>
              Open WhatsApp from {session.maskedPhone}, send the prefilled
              message, then tap Approve. Return to this page to continue.
            </p>
            {session.approvalExpired ? (
              <ErrorText>
                Verification expired. Return to {conversation} and request a new
                form.
              </ErrorText>
            ) : (
              <LinkButton href={session.verificationUrl} rel="noreferrer">
                Open WhatsApp to verify
              </LinkButton>
            )}
            <small>
              This page will continue when you return after approving.
            </small>
          </>
        )}
        {session?.stage === "TERMS" && (
          <>
            <h1>Before you continue</h1>
            <p>
              Please read our{" "}
              <a
                href="https://usekairo.co/terms-of-use"
                target="_blank"
                rel="noreferrer noopener"
              >
                Terms of Use
              </a>{" "}
              to understand how your Kairo account works.
            </p>
            <form onSubmit={submit}>
              <Check>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                />
                I have read and agree to the Terms of Use.
              </Check>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.FULL}
                type="submit"
                disabled={busy}
              >
                {busy ? "Continuing…" : "Continue"}
              </Button>
            </form>
          </>
        )}
        {session?.stage === "PERSONAL_INFO" && (
          <>
            <h1>Your personal details</h1>
            <p>
              To meet CBN requirements, we need your BVN and NIN to verify your
              identity and create your Kairo account.
            </p>
            <form onSubmit={submit} autoComplete="off">
              {field("first_name", "First name (optional)", { maxLength: 255 })}
              {field("last_name", "Last name (optional)", { maxLength: 255 })}
              {field("dob", "Date of birth", {
                type: "date",
                required: true,
                max: new Date().toISOString().slice(0, 10),
              })}
              <SelectInput
                name="gender"
                label="Gender"
                required
                placeholder="Select gender"
                value={fields.gender ?? ""}
                onChange={(value: string) => change("gender", value)}
                options={[
                  { label: "Female", value: "FEMALE" },
                  { label: "Male", value: "MALE" },
                ]}
              />
              {field("email", "Email address", {
                type: "email",
                inputMode: "email",
                required: true,
                maxLength: 255,
              })}
              {field("bvn", "BVN", {
                type: "password",
                inputMode: "numeric",
                pattern: "[0-9]{11}",
                minLength: 11,
                maxLength: 11,
                required: true,
              })}
              {field("nin", "NIN", {
                type: "password",
                inputMode: "numeric",
                pattern: "[0-9]{11}",
                minLength: 11,
                maxLength: 11,
                required: true,
              })}
              {session.phoneRequired && (
                <FormInput
                  id="phone_number"
                  label="Phone number (+234)"
                  aria-label="Phone number (+234)"
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="off"
                  maxLength={25}
                  value={fields.phone_number ?? session.nigerianPhone}
                  onChange={(event) =>
                    change("phone_number", event.target.value)
                  }
                />
              )}
              <FormInput
                id="referral_code"
                label="Referral code (optional)"
                aria-label="Referral code (optional)"
                maxLength={11}
                autoComplete="off"
                readOnly={!!session.referralCode}
                value={session.referralCode || fields.referral_code || ""}
                onChange={(event) =>
                  change("referral_code", event.target.value)
                }
              />
              <small>
                Kairo is NDPC-certified, and your data is protected in line with
                the NDPA 2023.
              </small>
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.FULL}
                type="submit"
                disabled={busy}
              >
                {busy ? "Checking details…" : "Continue"}
              </Button>
            </form>
          </>
        )}
        {session?.stage === "PIN_SETUP" && (
          <>
            <h1>Create your transaction PIN</h1>
            <p>
              Choose a four-digit PIN. Keep it private and enter it only in
              Kairo’s secure forms.
            </p>
            <form onSubmit={submit} autoComplete="off">
              {field("pin", "Transaction PIN", {
                type: "password",
                inputMode: "numeric",
                pattern: "[0-9]{4}",
                minLength: 4,
                maxLength: 4,
                required: true,
              })}
              {field("pin_confirmation", "Confirm PIN", {
                type: "password",
                inputMode: "numeric",
                pattern: "[0-9]{4}",
                minLength: 4,
                maxLength: 4,
                required: true,
              })}
              <Button
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.FULL}
                type="submit"
                disabled={busy}
              >
                {busy ? "Submitting…" : "Submit securely"}
              </Button>
            </form>
          </>
        )}
        {session?.stage === "DONE" && (
          <>
            <h1>
              {session.completed ? "You’re connected" : "Details submitted"}
            </h1>
            <p>
              {session.completed
                ? `Your existing Kairo account is now connected${session.origin?.displayName ? ` on ${session.origin.displayName}` : ""}. Return to ${conversation} to continue.`
                : `Return to ${conversation}. I’ll ask for the last four digits of the phone number linked to your BVN to finish signup.`}
            </p>
            {returnLink && (
              <LinkButton href={returnLink.href} rel="noreferrer">
                {returnLink.label}
              </LinkButton>
            )}
            <small>
              You can close this browser using the close or back button to
              return to your conversation.
            </small>
          </>
        )}
        {error && <ErrorText role="alert">{error}</ErrorText>}
        <small style={{ marginTop: 24 }}>
          Secure Kairo form. Your identity details and PIN are not saved in
          browser storage.
        </small>
      </Card>
    </Main>
  );
}
