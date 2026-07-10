"use client";

import React, { useRef } from "react";
import styled from "styled-components";
import { formFieldStatusMessageTypes } from "@kairo/utils";
import Flex from "../Flex";
import { Icon } from "@iconify/react";

const FileInputContainer = styled.div`
  flex-grow: 1;
  line-height: 20px;
  letter-spacing: 0.25px;
  // max-height: 4rem;
  position: relative;

  label {
    display: inline-block;
    font-size: ${(props) => props.theme.typography.fontSize.base};
    font-weight: ${(props) => props.theme.typography.fontWeight.medium};
    color: ${(props) => props.theme.colors.text_07};
    margin: 3px 0;
    padding: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .required-mark {
    color: ${(props) => props.theme.colors.red};
  }

  .FileInput__control {
    background: ${(props) => props.theme.colors.gray_05};
    border: 1px solid ${(props) => props.theme.colors.gray_05};
    border-radius: 8px;
    padding: 10px 14px 10px 14px;
    box-sizing: border-box;
    position: relative;
    transition: all 0.3s ease-out;

    &:focus-within,
    &:hover {
      background: ${(props) => props.theme.colors.gray_06};
    }

    input[type="file"] {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      z-index: 1;
      cursor: pointer;
    }

    .FileInput__name-icon {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .FileInput__title {
      font-weight: 500;
      color: ${(props) => props.theme.colors.primaryColor};
    }

    .FileInput__name {
      margin: 0;
      text-transform: capitalize;
      color: ${(props) => props.theme.colors.text_02};
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .FileInput__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.6rem;
      background-color: ${(props) => props.theme.colors.gray_03};
      width: 2.5rem;
      height: 2.5rem;
      padding: 0.5rem;
    }

    .FileInput__icon--file {
      background-color: ${(props) => props.theme.colors.primaryColor}10;
      color: ${(props) => props.theme.colors.primaryColor};
    }
  }

  .FileInput__TypeAndMessageContainer {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-top: 2px;
    font-size: 0.75rem;
    color: ${(p) => p.theme.colors.text_03};
  }

  .FileInput__TypeAndMessageContainer__fileType {
    color: ${(p) => p.theme.colors.text_04};
  }

  .FileInput__TypeAndMessageContainer__message {
    padding-left: 0.75rem;
    border-left: 1px solid ${(p) => p.theme.colors.gray_03};
    color: var(--ff-msg-color, ${(p) => p.theme.colors.tag.red.color});
  }

  .FileInput__message {
    position: absolute;
    left: 0;
    bottom: -1.5rem;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .FileInput__message--success {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.green.color}
    );
  }
  .FileInput__message--error {
    color: var(--ff-msg-color, ${(props) => props.theme.colors.tag.red.color});
  }
  .FileInput__message--warning {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.yellowDark.color}
    );
  }
  .FileInput__message--info {
    color: var(
      --ff-msg-color,
      ${(props) => props.theme.colors.tag.yellow.color}
    );
  }

  &[disabled] {
    opacity: 0.55;
    pointer-events: none;
  }
`;

export interface FileInputProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  files?: FileList | null;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  message?: {
    type?: keyof typeof formFieldStatusMessageTypes;
    content: string;
  };
  accept?: string;
  onClear?: () => void;
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  files,
  required,
  onChange,
  message,
  accept,
  onClear,
  ...rest
}) => {
  const file = files?.[0];
  const inputRef = useRef<HTMLInputElement | null>(null);

  const messageSpec = message
    ? formFieldStatusMessageTypes[
        (message.type as keyof typeof formFieldStatusMessageTypes) || "info"
      ] || null
    : null;

  const containerStyle = (
    messageSpec
      ? {
          ...(rest.style || {}),
          ["--ff-msg-color" as any]: messageSpec.color,
          ["--ff-msg-bg" as any]: messageSpec.backgroundColor,
        }
      : rest.style
  ) as React.CSSProperties;

  return (
    <FileInputContainer
      {...rest}
      style={containerStyle}
      data-disabled={(rest as any).disabled}
    >
      {label ? (
        <label>
          {label} {required && <span className="required-mark">*</span>}
        </label>
      ) : (
        <div className="spacer" />
      )}

      <div className="FileInput__control">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onChange}
          {...(rest as any)}
        />

        <div className="FileInput__name-icon">
          <Flex gap="1rem" align="center">
            {file ? (
              <span className="FileInput__icon FileInput__icon--file">
                <Icon icon="mdi:file-document-outline" width="20" height="20" />
              </span>
            ) : (
              <span className="FileInput__icon">
                <Icon
                  icon="material-symbols:upload-rounded"
                  width="20"
                  height="20"
                />
              </span>
            )}
            {!file ? (
              <Flex direction="column" gap="0.1rem">
                <span className="FileInput__title">Select file</span>

                <div className="FileInput__TypeAndMessageContainer">
                  {accept && (
                    <span className="FileInput__TypeAndMessageContainer__fileType">
                      {accept}
                    </span>
                  )}
                  {message && (
                    <span className="FileInput__TypeAndMessageContainer__message">
                      {message.content}
                    </span>
                  )}
                </div>
              </Flex>
            ) : (
              <span className="FileInput__name">{file.name}</span>
            )}
          </Flex>
          {file && (
            <button
              type="button"
              aria-label="clear file"
              className="FileInput__clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                try {
                  if (inputRef.current) inputRef.current.value = "";
                } catch {}
                onClear?.();
                if (onChange) {
                  onChange({ target: { files: null } } as any);
                }
              }}
            >
              <Icon icon="ic:round-close" width="20" height="20" />
            </button>
          )}
        </div>
      </div>
    </FileInputContainer>
  );
};

export default FileInput;
