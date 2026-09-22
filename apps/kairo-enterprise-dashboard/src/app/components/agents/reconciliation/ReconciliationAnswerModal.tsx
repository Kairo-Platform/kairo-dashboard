"use client";

import { Button, ButtonClass, Flex, Modal, ModalSize } from "@kairo/ui";
import { FormInput } from "@kairo/ui/inputs";
import { useState } from "react";
import styled from "styled-components";

const AnswerModalContent = styled.div`
  .AnswerModal__question {
    color: ${({ theme }) => theme.colors.text_02};
    line-height: 1.55;
  }
`;

type Props = {
  question: string;
  onSubmit: (answer: string) => Promise<void>;
};

export const ReconciliationAnswerModal = ({ question, onSubmit }: Props) => {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const value = answer.trim();
    if (!value) {
      setError("Enter the exact column name");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(value);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to send response",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="More information required"
      subtitle="Answer this question so Kairo can continue the reconciliation."
      size={ModalSize.MEDIUM}
      onClose={() => undefined}
      useDefaultCloseButton={false}
      Footer={() => (
        <Flex justify="end" style={{ marginTop: "1rem" }}>
          <Button
            classes={[ButtonClass.SOLID]}
            loading={submitting}
            disabled={submitting}
            onClick={() => void submit()}
          >
            Submit answer
          </Button>
        </Flex>
      )}
    >
      <AnswerModalContent>
        <Flex direction="column" gap="1rem">
          <p className="AnswerModal__question">{question}</p>
          <FormInput
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              if (error) setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") void submit();
            }}
            placeholder="Enter the exact column name"
            aria-label="Answer reconciliation question"
            autoFocus
            message={error ? { type: "error", content: error } : undefined}
          />
        </Flex>
      </AnswerModalContent>
    </Modal>
  );
};
