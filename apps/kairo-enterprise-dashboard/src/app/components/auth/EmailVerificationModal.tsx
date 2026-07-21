"use client";

import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  ButtonClass,
  ButtonSize,
  Flex,
  Modal,
  ModalSize,
} from "@/app/components/ui";
import { OtpInput } from "@/app/components/ui/inputs";
import { xApiAuth } from "@/services/xApi";
import { isApiError, parseApiError } from "@/lib/utils";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@kairo/utils";

const RESEND_COOLDOWN_SECONDS = 60;
const OTP_LENGTH = 6;

const VerificationBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.5rem;
  padding: 0.5rem 0 1rem;
  text-align: center;

  .EmailVerificationModal__description {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 500;
    line-height: 1.5;
    color: ${(props) => props.theme.colors.text_02};
  }

  .EmailVerificationModal__email {
    color: ${(props) => props.theme.colors.text_01};
    font-weight: 600;
  }

  .EmailVerificationModal__otp {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .EmailVerificationModal__actions {
    width: 100%;
  }

  .EmailVerificationModal__resend {
    margin: 0;
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.text_02};
  }

  .EmailVerificationModal__countdown {
    font-variant-numeric: tabular-nums;
  }
`;

type EmailVerificationModalProps = {
  email: string;
  onClose: () => void;
  onVerified: (response: Record<string, unknown>) => void | Promise<void>;
};

export const EmailVerificationModal = ({
  email,
  onClose,
  onVerified,
}: EmailVerificationModalProps) => {
  const [otp, setOtp] = useState("");
  const [otpKey, setOtpKey] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return undefined;

    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const resetOtp = useCallback(() => {
    setOtp("");
    setOtpKey((current) => current + 1);
  }, []);

  const handleVerify = useCallback(
    async (code: string) => {
      if (code.length !== OTP_LENGTH || verifying) return;

      setVerifying(true);
      try {
        const response = (await xApiAuth.verifyEmail({
          email,
          code,
        })) as Record<string, unknown>;

        if (isApiError(response)) {
          throw response;
        }

        showSuccessNotification({
          message: "Email verified successfully.",
        });
        await onVerified(response);
      } catch (error) {
        showErrorNotification({
          message: parseApiError(
            error,
            "Invalid verification code. Please try again.",
          ),
        });
        resetOtp();
      } finally {
        setVerifying(false);
      }
    },
    [email, onVerified, resetOtp, verifying],
  );

  const handleOtpChange = useCallback(
    (value: string) => {
      setOtp(value);
      if (value.length === OTP_LENGTH) {
        void handleVerify(value);
      }
    },
    [handleVerify],
  );

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || resending) return;

    setResending(true);
    try {
      const response = (await xApiAuth.resendEmailVerification({
        email,
      })) as Record<string, unknown>;

      if (isApiError(response)) {
        throw response;
      }

      showSuccessNotification({
        message: "A new verification code has been sent to your email.",
      });
      resetOtp();
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      showErrorNotification({
        message: parseApiError(
          error,
          "Failed to resend verification code. Please try again.",
        ),
      });
    } finally {
      setResending(false);
    }
  }, [cooldown, email, resending, resetOtp]);

  const canResend = cooldown <= 0 && !resending && !verifying;

  return (
    <Modal
      title="Verify your email"
      onClose={onClose}
      size={ModalSize.SMALL}
      showModalHeader
      useDefaultCloseButton
      style={{ maxWidth: "28rem", paddingBottom: "1.5rem" }}
    >
      <VerificationBody>
        <p className="EmailVerificationModal__description">
          Enter the 6-digit code we sent to{" "}
          <span className="EmailVerificationModal__email">{email}</span>
        </p>

        <div className="EmailVerificationModal__otp">
          <OtpInput
            key={otpKey}
            length={OTP_LENGTH}
            autoFocus
            disabled={verifying}
            onChangeOTP={handleOtpChange}
            fullWidth
          />
        </div>

        <Flex
          direction="column"
          align="stretch"
          gap="0.75rem"
          className="EmailVerificationModal__actions"
        >
          <Button
            type="button"
            classes={[ButtonClass.SOLID]}
            size={ButtonSize.FULL}
            containerStyle={{ width: "100%" }}
            disabled={otp.length !== OTP_LENGTH || verifying}
            loading={verifying}
            onClick={() => void handleVerify(otp)}
            style={{ borderRadius: "0.765rem" }}
          >
            {verifying ? "Verifying..." : "Verify email"}
          </Button>

          <p className="EmailVerificationModal__resend">
            {canResend ? (
              <>
                Didn&apos;t get the code?{" "}
                <Button
                  type="button"
                  classes={[ButtonClass.TEXT_ONLY, ButtonClass.PADDING_0]}
                  disabled={resending}
                  loading={resending}
                  onClick={() => void handleResend()}
                >
                  Resend code
                </Button>
              </>
            ) : (
              <>
                Resend code in{" "}
                <span className="EmailVerificationModal__countdown">
                  {cooldown}s
                </span>
              </>
            )}
          </p>
        </Flex>
      </VerificationBody>
    </Modal>
  );
};

export default EmailVerificationModal;
