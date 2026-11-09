"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styled from "styled-components";
import { Button, ButtonClass, ButtonSize } from "@kairo/ui";
import { FormInput } from "@kairo/ui/inputs";
import SecureFormBrand from "./SecureFormBrand";
import {
  actionFormService,
  businessSetupSchema,
  transferPinSchema,
  type ActionFormSession,
  type ActionFormType,
} from "@/services/secure-forms/actions";
import {
  formConversation,
  formReturnLink,
} from "@/services/secure-forms/origin";

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
    white-space: pre-line;
  }
  form {
    display: grid;
    gap: 20px;
  }
  input {
    font-size: 16px;
  }
  small {
    display: block;
    color: ${({ theme }) => theme.colors.text_02};
    line-height: 1.6;
  }
`;
const Footer = styled.small`
  margin-top: 2rem;
`;
const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.red};
  background: ${({ theme }) => theme.colors.red_02};
  padding: 12px;
  border-radius: 8px;
`;
const ReturnLink = styled.a`
  display: block;
  padding: 14px 20px;
  border-radius: 10px;
  text-align: center;
  background: ${({ theme }) => theme.colors.primaryColor};
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  font-weight: 500;
  margin: 20px 0;
`;
const businessFields = [
  ["businessName", "Business name", "Enter your registered or trading name"],
  [
    "businessType",
    "Business type",
    "For example, fashion, retail, or services",
  ],
  ["email", "Email", "Enter a business email address"],
  ["address", "Business address", "Enter your business address"],
  ["tagline", "Tagline (optional)", "Add a short description of your business"],
  [
    "rcNumber",
    "RC number (optional)",
    "Enter your registration number if available",
  ],
] as const;

export default function SecureActionForm({ type }: { type: ActionFormType }) {
  const [service] = useState(() => actionFormService(type));
  const [session, setSession] = useState<ActionFormSession | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const initial = useRef<Promise<ActionFormSession> | null>(null);
  const returnLink = formReturnLink(session?.origin);
  const conversation = formConversation(session?.origin);

  useEffect(() => {
    let mounted = true;
    if (!initial.current) {
      const token = new URLSearchParams(window.location.hash.slice(1)).get(
        "token",
      );
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?type=${type}`,
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
    const clear = () => setFields({});
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
  }, [service, type]);
  useEffect(() => {
    if (session?.stage === "DONE") void service.close().catch(() => {});
  }, [session?.stage, service]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (
      busy ||
      !session ||
      session.stage === "DONE" ||
      session.stage === "PROCESSING"
    )
      return;
    const parsed = (
      type === "transfer_pin" ? transferPinSchema : businessSetupSchema
    ).safeParse({ action: "submit", screen: session.stage, data: fields });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const next = await service.submit(parsed.data);
      setSession(next);
      if (type === "transfer_pin" || next.stage === "DONE") setFields({});
      if (next.data.show_error)
        setError(next.data.error_message || "Please check your details.");
    } catch (failure) {
      if (type === "transfer_pin") setFields({});
      setError(
        failure instanceof Error
          ? failure.message
          : "Unable to submit. Return to your conversation to check the status.",
      );
      // Read-only recovery: never automatically repeat a financial submission.
      try {
        const next = await service.session();
        setSession(next);
        if (["DONE", "PROCESSING"].includes(next.stage)) setError("");
      } catch {
        /* Keep original error. */
      }
    } finally {
      setBusy(false);
    }
  }
  const done = session?.stage === "DONE";
  return (
    <Main>
      <Card aria-busy={busy}>
        <SecureFormBrand />
        {!session && (
          <>
            <h1>Secure Kairo form</h1>
            {!error && <p>Opening your secure form…</p>}
          </>
        )}
        {session?.stage === "PIN_AUTHORIZATION" && (
          <>
            <h1>
              {session.data.authorization_heading || "Authorize securely"}
            </h1>
            {session.data.show_authorization_detail && (
              <p>{session.data.authorization_detail}</p>
            )}
            <form onSubmit={submit} autoComplete="off">
              <FormInput
                id="pin"
                name="pin"
                label="Transaction PIN"
                aria-label="Transaction PIN"
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4}"
                minLength={4}
                maxLength={4}
                required
                autoComplete="off"
                value={fields.pin ?? ""}
                onChange={(event) =>
                  setFields({
                    pin: event.target.value.replace(/[^0-9]/g, "").slice(0, 4),
                  })
                }
              />
              <small>
                Enter your four-digit PIN to authorize. Never send your PIN in
                chat.
              </small>
              <Button
                type="submit"
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.FULL}
                disabled={busy}
              >
                {busy ? "Authorizing…" : "Authorize"}
              </Button>
            </form>
          </>
        )}
        {session?.stage === "BUSINESS_INFO" && (
          <>
            <h1>Set up your business</h1>
            <form onSubmit={submit} autoComplete="off">
              {businessFields.map(([key, label, placeholder], index) => (
                <FormInput
                  key={key}
                  id={key}
                  name={key}
                  label={label}
                  aria-label={label}
                  placeholder={placeholder}
                  type={key === "email" ? "email" : "text"}
                  required={index < 4}
                  maxLength={key === "address" ? 500 : 255}
                  autoComplete="off"
                  value={fields[key] ?? ""}
                  onChange={(event) =>
                    setFields((previous) => ({
                      ...previous,
                      [key]: event.target.value,
                    }))
                  }
                />
              ))}
              <Button
                type="submit"
                classes={[ButtonClass.SOLID]}
                size={ButtonSize.FULL}
                disabled={busy}
              >
                {busy ? "Saving…" : "Continue"}
              </Button>
            </form>
          </>
        )}
        {session?.stage === "PROCESSING" && (
          <>
            <h1>Submission in progress</h1>
            <p>
              Return to {conversation} to check the outcome before trying again.
            </p>
          </>
        )}
        {done && (
          <>
            <h1>
              {type === "transfer_pin"
                ? "Authorization submitted"
                : "Business details saved"}
            </h1>
            <p>
              Return to {conversation} for the result and next steps.
            </p>
          </>
        )}
        {(done || session?.stage === "PROCESSING") &&
          returnLink && (
            <ReturnLink href={returnLink.href} rel="noreferrer">
              {returnLink.label}
            </ReturnLink>
          )}
        {error && <ErrorText role="alert">{error}</ErrorText>}
        <Footer>
          Secure Kairo form. No data is saved in browser storage. Your details
          are sent securely to Kairo.
        </Footer>
      </Card>
    </Main>
  );
}
