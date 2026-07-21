"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { Button, ButtonClass, Flex, Modal, ModalSize } from "@kairo/ui";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const AskKairoAIContainer = styled.div`
  display: inline-flex;
  position: relative;

  .AskKairoAI__iconButton {
    width: 2.5rem;
    height: 2.5rem;
    min-width: 2.5rem;
    padding: 0.625rem;
    border-radius: 2.5rem;
    color: ${(props) => props.theme.colors.white};
  }

  .AskKairoAI__chat {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-height: 22rem;
    height: 100%;
  }

  .AskKairoAI__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem 1rem 1.25rem;
    border-bottom: 1px solid ${(props) => props.theme.colors.gray_04};
    margin: -0.5rem -0.5rem 0;
    flex-shrink: 0;
  }

  .AskKairoAI__brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .AskKairoAI__brandIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 2.5rem;
    color: ${(props) => props.theme.colors.white};
    background: linear-gradient(
      133deg,
      ${(props) => props.theme.colors.orange} 8%,
      #ffa978 28%,
      #ff8c4a 62%,
      ${(props) => props.theme.colors.orange} 90%
    );
  }

  .AskKairoAI__brandName {
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.75rem;
    letter-spacing: -0.03375rem;
    color: ${(props) => props.theme.colors.black};
  }

  .AskKairoAI__close {
    appearance: none;
    border: none;
    background: transparent;
    color: ${(props) => props.theme.colors.text_03};
    cursor: pointer;
    display: inline-flex;
    padding: 0.25rem;
  }

  .AskKairoAI__messages {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex: 1;
    min-height: 12rem;
    overflow-y: auto;
    padding: 0.5rem 0.25rem;
  }

  .AskKairoAI__bubble {
    max-width: 75%;
    padding: 1rem 0.875rem;
    border-radius: 1rem;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25rem;
    letter-spacing: -0.008125rem;
    color: #3d3d3d;
    word-break: break-word;
  }

  .AskKairoAI__bubble--assistant {
    align-self: flex-start;
    background-color: ${(props) => props.theme.colors.gray_03};
    border-radius: 0 1rem 1rem 1rem;
  }

  .AskKairoAI__bubble--user {
    align-self: flex-end;
    background-color: #fff0e8;
    border-radius: 1rem 0 1rem 1rem;
  }

  .modal__footer {
    border-top: none !important;
  }

  .AskKairoAI__composer {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    min-height: 3.75rem;
    padding: 0.5rem 0.5rem 0.5rem 1.5rem;
    border: 1.2px solid ${(props) => props.theme.colors.gray_03};
    border-radius: 1.75rem;
    background-color: ${(props) => props.theme.colors.white};
    flex-shrink: 0;
  }

  .AskKairoAI__input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5rem;
    letter-spacing: -0.02rem;
    color: ${(props) => props.theme.colors.text_01};

    &::placeholder {
      color: ${(props) => props.theme.colors.text_03};
    }
  }

  .AskKairoAI__send {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    border-radius: 1.5rem;
    background-color: ${(props) => props.theme.colors.orange};
    color: ${(props) => props.theme.colors.white};
    cursor: pointer;
    flex-shrink: 0;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Welcome, I am Kairo connect agent. I'll guide you through linking your systems. What's your core banking platform?",
  },
];

export type AskKairoAIProps = {
  iconOnly?: boolean;
  buttonLabel?: string;
  className?: string;
};

export const AskKairoAI = ({
  iconOnly = false,
  buttonLabel = "Ask AI",
  className,
}: AskKairoAIProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSend = () => {
    const content = draft.trim();
    if (!content) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content,
      },
    ]);
    setDraft("");
  };

  return (
    <AskKairoAIContainer className={className}>
      <div ref={triggerRef}>
        {iconOnly ? (
          <Button
            type="button"
            classes={[ButtonClass.GRADIENT, ButtonClass.ICON_ONLY]}
            className="AskKairoAI__iconButton"
            onClick={openModal}
            aria-label={buttonLabel}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            style={{ height: "2.5rem", width: "2.5rem", borderRadius: "2.5rem" }}
          >
            <Icon icon="mingcute:ai-fill" width={20} height={20} />
          </Button>
        ) : (
          <Button
            type="button"
            classes={[ButtonClass.GRADIENT, ButtonClass.WITH_ICON]}
            style={{ height: "2.5rem" }}
            onClick={openModal}
            aria-label={buttonLabel}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
          >
            <Icon icon="mingcute:ai-fill" width={20} height={20} />
            {buttonLabel}
          </Button>
        )}
      </div>

      {isOpen && (
        <Modal
          useDefaultCloseButton={false}
          onClose={closeModal}
          size={ModalSize.MEDIUM}
          anchorRef={triggerRef}
          anchorPlacement="bottom-end"
          anchorOffset={12}
          showOverlay={false}
          Heading={() =>
            <div className="AskKairoAI__header">
              <div className="AskKairoAI__brand">
                <span className="AskKairoAI__brandIcon">
                  <Icon icon="mingcute:ai-fill" width={20} height={20} />
                </span>
                <span className="AskKairoAI__brandName">Kairo</span>
              </div>
              <button
                type="button"
                className="AskKairoAI__close"
                onClick={closeModal}
                aria-label="Close Ask Kairo AI"
              >
                <Icon icon="iconoir:cancel" width={24} height={24} />
              </button>
            </div>
          }
          Footer={() =>
            <Flex align="center" style={{ width: "100%" }}>
              <div className="AskKairoAI__composer">
                <input
                  className="AskKairoAI__input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask a question...."
                  aria-label="Ask a question"
                />
                <button
                  type="button"
                  className="AskKairoAI__send"
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  aria-label="Send message"
                >
                  <Icon icon="tabler:send" width={16} height={16} />
                </button>
              </div>
            </Flex>
          }
          style={{
            maxWidth: "39.25rem",
            width: "39.25rem",
            padding: "1rem",
            borderRadius: "1rem",
            backgroundColor: "#fdfdfd",
          }}
        >
          <div className="AskKairoAI__chat">
            <div className="AskKairoAI__messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`AskKairoAI__bubble AskKairoAI__bubble--${message.role}`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </AskKairoAIContainer>
  );
};

export default AskKairoAI;
