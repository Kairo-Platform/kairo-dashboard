"use client";

import React from "react";
import FileCopyLineIcon from "remixicon-react-redux/FileCopyLineIcon";
import { useCopyToClipboard } from "@kairo/hooks";
import styled from "styled-components";
import { showErrorNotification, showNotification } from "@kairo/utils";
import { theme } from "@kairo/theme";

const StyledWrapper = styled.span`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  align-items: center;
`;

const IconButton = styled.button`
  height: 20px;
  display: flex;
  margin-top: 2px;
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
`;

export interface CopyTextProps {
  text?: string | number | null;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  iconColor?: string;
  successMessage?: string;
  customTheme?: typeof theme;
}

export const CopyText: React.FC<CopyTextProps> = ({
  text,
  children,
  className,
  style,
  iconColor,
  successMessage,
  customTheme = theme,
}) => {
  const [copy] = useCopyToClipboard();

  const copyText = async () => {
    try {
      if (typeof copy !== "function") {
        showErrorNotification({
          message: "Clipboard API not supported",
        } as any);
        return;
      }

      const copier = copy as (t: string) => Promise<string>;
      const copiedText = await copier(String(text ?? ""));
      showNotification({
        message: successMessage || `copied ${copiedText}`,
      } as any);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showErrorNotification({ message } as any);
    }
  };

  if (!text) return <>{children}</>;

  return (
    <StyledWrapper className={className} style={style}>
      {children}
      <IconButton
        type="button"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          copyText();
        }}
        aria-label={"Copy to clipboard"}
      >
        <FileCopyLineIcon
          color={iconColor || customTheme?.colors?.primaryColor}
          size={18}
        />
      </IconButton>
    </StyledWrapper>
  );
};

export default CopyText;
