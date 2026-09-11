"use client";

import { FormTextarea } from "@kairo/ui/inputs";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import styled from "styled-components";
import type { MessageVariable } from "./types";
import {
  completeMessageVariable,
  getVariableCompletion,
  matchMessageVariables,
  splitMessagePlaceholders,
} from "./messageEditorHelpers";

const FlowMessageInputContainer = styled.div`
  position: relative;
  min-width: 0;

  && textarea {
    position: relative;
    z-index: 2;
    color: transparent;
    -webkit-text-fill-color: transparent;
    caret-color: ${({ theme }) => theme.colors.text_01};
    background: transparent;

    &::selection {
      background: ${({ theme }) => `${theme.colors.primaryColor}33`};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text_07};
      -webkit-text-fill-color: ${({ theme }) => theme.colors.text_07};
    }
  }

  .FlowMessageInput__highlight {
    position: absolute;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.text_01};
  }

  .FlowMessageInput__text {
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  .FlowMessageInput__variable {
    color: ${({ theme }) => theme.colors.primaryColor};
  }

  .FlowMessageInput__suggestions {
    position: absolute;
    z-index: 6;
    width: min(12rem, 100%);
    max-height: 10rem;
    overflow-y: auto;
    margin: 0;
    padding: 0.25rem;
    list-style: none;
    border: 1px solid ${({ theme }) => theme.colors.inputBorder};
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.colors.ui_07};
    box-shadow: 0 4px 12px #00000014;
  }

  .FlowMessageInput__suggestion {
    padding: 0.5rem 0.625rem;
    border-radius: 0.25rem;
    cursor: pointer;

    &[aria-selected="true"] {
      background: ${({ theme }) => `${theme.colors.primaryColor}14`};
    }

    span {
      display: block;
      color: ${({ theme }) => theme.colors.primaryColor};
      font-size: 0.875rem;
    }

    small {
      display: block;
      color: ${({ theme }) => theme.colors.text_02};
      font-size: 0.75rem;
    }
  }

  @media (forced-colors: active) {
    && textarea {
      color: CanvasText;
      -webkit-text-fill-color: CanvasText;
    }
    .FlowMessageInput__highlight {
      display: none;
    }
  }
`;

type FlowMessageInputProps = {
  name: string;
  value: string;
  variables: MessageVariable[];
  onChange: (message: string) => void;
};

export const FlowMessageInput = forwardRef<
  HTMLTextAreaElement,
  FlowMessageInputProps
>(function FlowMessageInput(
  { name, value, variables, onChange },
  forwardedRef,
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const composingRef = useRef(false);
  const listId = useId();
  const [completion, setCompletion] =
    useState<ReturnType<typeof getVariableCompletion>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayStyle, setOverlayStyle] = useState<CSSProperties>({});
  const [scroll, setScroll] = useState({ top: 0, left: 0 });
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const matches = completion
    ? matchMessageVariables(variables, completion.query)
    : [];
  const selectedIndex = Math.min(activeIndex, Math.max(0, matches.length - 1));
  const open = Boolean(completion && matches.length);

  const setTextareaRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const measure = useCallback(() => {
    const textarea = textareaRef.current;
    const container = containerRef.current;
    if (!textarea || !container) return;
    const rect = textarea.getBoundingClientRect();
    const parent = container.getBoundingClientRect();
    const computed = getComputedStyle(textarea);
    const typography: CSSProperties = {
      fontFamily: computed.fontFamily,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      fontStyle: computed.fontStyle,
      fontVariant: computed.fontVariant,
      lineHeight: computed.lineHeight,
      letterSpacing: computed.letterSpacing,
      wordSpacing: computed.wordSpacing,
      textIndent: computed.textIndent,
      textTransform: computed.textTransform as CSSProperties["textTransform"],
      tabSize: computed.tabSize,
      wordBreak: computed.wordBreak as CSSProperties["wordBreak"],
    };
    setOverlayStyle({
      ...typography,
      left: rect.left - parent.left,
      top: rect.top - parent.top,
      width: textarea.clientWidth,
      height: textarea.clientHeight,
    });
    setScroll({ top: textarea.scrollTop, left: textarea.scrollLeft });

    if (
      document.activeElement !== textarea ||
      !getVariableCompletion(
        textarea.value,
        textarea.selectionStart,
        textarea.selectionEnd,
      )
    )
      return;

    // Mirror native textarea wrapping to locate the caret without changing its selection.
    const mirror = document.createElement("div");
    Object.assign(mirror.style, typography, {
      position: "fixed",
      visibility: "hidden",
      top: "0",
      left: "0",
      width: `${textarea.clientWidth}px`,
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
    });
    mirror.textContent = textarea.value.slice(0, textarea.selectionStart);
    const marker = document.createElement("span");
    marker.textContent =
      textarea.value.slice(textarea.selectionStart) || "\u200b";
    mirror.append(marker);
    document.body.append(mirror);
    const caret = marker.getClientRects()[0];
    const origin = mirror.getBoundingClientRect();
    const lineHeight =
      parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.2;
    const x = (caret?.left ?? origin.left) - origin.left - textarea.scrollLeft;
    const y = (caret?.top ?? origin.top) - origin.top - textarea.scrollTop;
    const popupHeight = Math.min(160, textarea.clientHeight);
    const top =
      y + lineHeight + popupHeight > textarea.clientHeight
        ? Math.max(0, y - popupHeight)
        : y + lineHeight;
    setPosition({
      left: Math.max(
        0,
        Math.min(rect.left - parent.left + x, container.clientWidth - 288),
      ),
      top:
        rect.top -
        parent.top +
        Math.max(0, Math.min(top, textarea.clientHeight - popupHeight)),
    });
    mirror.remove();
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, value, completion]);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const observer = new ResizeObserver(measure);
    observer.observe(textarea);
    return () => observer.disconnect();
  }, [measure]);
  useEffect(() => {
    const list = listRef.current;
    const option = list?.children[selectedIndex] as HTMLElement | undefined;
    if (!list || !option) return;
    if (option.offsetTop < list.scrollTop) {
      list.scrollTop = option.offsetTop;
    } else if (
      option.offsetTop + option.offsetHeight >
      list.scrollTop + list.clientHeight
    ) {
      list.scrollTop =
        option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [selectedIndex, completion?.query]);

  const updateCompletion = (textarea: HTMLTextAreaElement) => {
    if (composingRef.current) return;
    setCompletion(
      getVariableCompletion(
        textarea.value,
        textarea.selectionStart,
        textarea.selectionEnd,
      ),
    );
    setActiveIndex(0);
  };

  const insertVariable = (token: string) => {
    if (!completion) return;
    const result = completeMessageVariable(value, completion, token);
    onChange(result.message);
    setCompletion(null);
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      textarea?.focus();
      textarea?.setSelectionRange(result.cursor, result.cursor);
    });
  };

  return (
    <FlowMessageInputContainer ref={containerRef}>
      <FormTextarea
        ref={setTextareaRef}
        name={name}
        value={value}
        rows={10}
        placeholder="Write a personalised message here...."
        aria-label="Conversation message"
        aria-autocomplete="list"
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${selectedIndex}` : undefined}
        onChange={(event) => {
          onChange(event.target.value);
          updateCompletion(event.target);
        }}
        onSelect={(event) => updateCompletion(event.currentTarget)}
        onScroll={measure}
        onBlur={() => setCompletion(null)}
        onCompositionStart={() => {
          composingRef.current = true;
          setCompletion(null);
        }}
        onCompositionEnd={(event) => {
          composingRef.current = false;
          updateCompletion(event.currentTarget);
        }}
        onKeyDown={(event) => {
          if (!open || composingRef.current || event.nativeEvent.isComposing)
            return;
          if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey)
            return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex(
              (selectedIndex +
                (event.key === "ArrowDown" ? 1 : -1) +
                matches.length) %
                matches.length,
            );
          } else if (event.key === "Enter" || event.key === "Tab") {
            event.preventDefault();
            insertVariable(matches[selectedIndex].token);
          } else if (event.key === "Escape") {
            event.preventDefault();
            setCompletion(null);
          }
        }}
      />
      <div
        className="FlowMessageInput__highlight"
        style={overlayStyle}
        aria-hidden="true"
      >
        <div
          className="FlowMessageInput__text"
          style={{
            transform: `translate(${-scroll.left}px, ${-scroll.top}px)`,
          }}
        >
          {splitMessagePlaceholders(value).map((part, index) => (
            <span
              key={index}
              className={
                part.placeholder ? "FlowMessageInput__variable" : undefined
              }
            >
              {part.text}
            </span>
          ))}
          {"\u200b"}
        </div>
      </div>
      {open && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-label="Variable suggestions"
          className="FlowMessageInput__suggestions"
          style={position}
        >
          {matches.map((variable, index) => (
            <li
              key={variable.token}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className="FlowMessageInput__suggestion"
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => insertVariable(variable.token)}
            >
              <span>{variable.token}</span>
              <small>{variable.description}</small>
            </li>
          ))}
        </ul>
      )}
    </FlowMessageInputContainer>
  );
});
