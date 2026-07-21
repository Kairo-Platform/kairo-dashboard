"use client";

import React from "react";
import Image from "next/image";
import styled from "styled-components";
import clsx from "clsx";
import closeIcon from "./icons/close.svg";

const ModalContainer = styled.div<{ $anchored?: boolean; $showOverlay?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  padding: ${(props) => (props.$anchored ? "0" : "1rem")};
  pointer-events: ${(props) => (props.$anchored ? "none" : "auto")};

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .modal {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 0;
    position: absolute;
    left: 50%;
    top: 12%;
    transform: translateX(-50%);
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.07);
    background-color: ${(props) => props.theme.colors.ui_07};
    border-radius: 24px;
    animation-name: fadeIn;
    animation-duration: 0.3s;
    z-index: 4;
    max-height: calc(100dvh - 18%);
    pointer-events: auto;
  }

  .modal--anchored {
    left: auto;
    top: auto;
    transform: none;
    max-width: min(39.25rem, calc(100vw - 2rem));
    max-height: none;
    box-shadow: 0px 4px 24.8px rgba(38, 16, 4, 0.06);
    border: 1px solid ${(props) => props.theme.colors.gray_02};
  }

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    .modal:not(.modal--anchored) {
      top: 2rem;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 2rem);
      max-height: calc(100vh - 3rem);
      max-height: calc(100svh - 3rem);
    }

    .modal--anchored {
      max-width: calc(100vw - 2rem);
    }
  }

  .modal__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: ${(props) => (props.$showOverlay ? 0.35 : 0)};
    cursor: pointer;
    appearance: none;
    outline: none;
    border: 0;
    z-index: -1;
    pointer-events: auto;
  }

  .modal__header {
    width: 100%;
    display: none;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 1.5rem 0;
    & > div:first-child {
      flex-grow: 1;
    }
  }

  .showModalHeader {
    display: flex;
  }

  .modal__btn--close {
    appearance: none;
    outline: none;
    border: 0;
    background-color: transparent;
    width: 24px;
    height: 24px;
    border-radius: 24px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:focus,
    &:hover {
      cursor: pointer;
      background-color: ${(props) => props.theme.colors.gray_02};
    }
  }

  .modal__title {
    font-weight: semibold;
    font-size: 24px;
    line-height: 25px;
    letter-spacing: 0.25px;
    color: ${(props) => props.theme.colors.text_01};
  }

  .modal__subtitle {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: ${(props) => props.theme.colors.text_02};
  }

  .modal__body {
    flex: 1 1 auto;
    min-height: 0;
    padding: 0 1.5rem 1.5rem;
    overflow-y: auto;
  }

  .modal__body--with-footer {
    padding: 0 1.5rem;
  }

  .modal__footer {
    width: 100%;
    padding: 0 1.5rem 1.5rem;
    border-top: 1px solid ${(props) => props.theme.colors.gray_03};
  }

  .modal--large {
    max-width: ${(props) => props.theme.breakpoint.lg};
  }
  .modal--medium {
    max-width: 40rem;
  }
  .modal--small {
    max-width: 30rem;
  }

  .top-right {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`;

export const ModalSize = {
  FULL: "",
  LARGE: "large",
  MEDIUM: "medium",
  SMALL: "small",
};

export type ModalAnchorPlacement =
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "top"
  | "top-start"
  | "top-end";

export type ModalProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  Heading?: React.ComponentType | null;
  children?: React.ReactNode;
  Footer?: React.ComponentType | null;
  onClose: () => void;
  showModalHeader?: boolean;
  size?: string;
  style?: React.CSSProperties;
  useDefaultTitleLayout?: boolean;
  useDefaultCloseButton?: boolean;
  /** When set, positions the modal relative to this element instead of centering. */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /** Preferred placement relative to the anchor. Defaults to `bottom-end`. */
  anchorPlacement?: ModalAnchorPlacement;
  /** Gap between the anchor and the modal in pixels. Defaults to `8`. */
  anchorOffset?: number;
  /** Whether to show the dimmed backdrop. Defaults to `true`. */
  showOverlay?: boolean;
};

type AnchoredPosition = {
  top: number;
  left: number;
  maxHeight: number;
  width: number;
};

const VIEWPORT_MARGIN = 16;

const getAnchoredPosition = (
  anchorRect: DOMRect,
  modalRect: { width: number; height: number },
  placement: ModalAnchorPlacement,
  offset: number
): AnchoredPosition => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const availableWidth = Math.max(
    240,
    viewportWidth - VIEWPORT_MARGIN * 2
  );
  const width = Math.min(modalRect.width || availableWidth, availableWidth);

  const prefersBottom = placement.startsWith("bottom");
  const prefersEnd = placement.endsWith("end");
  const prefersStart = placement.endsWith("start");

  let top = prefersBottom
    ? anchorRect.bottom + offset
    : anchorRect.top - modalRect.height - offset;

  let left = prefersEnd
    ? anchorRect.right - width
    : prefersStart
      ? anchorRect.left
      : anchorRect.left + (anchorRect.width - width) / 2;

  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, viewportWidth - width - VIEWPORT_MARGIN)
  );

  const spaceBelow = viewportHeight - (anchorRect.bottom + offset) - VIEWPORT_MARGIN;
  const spaceAbove = anchorRect.top - offset - VIEWPORT_MARGIN;

  if (prefersBottom && spaceBelow < 200 && spaceAbove > spaceBelow) {
    top = Math.max(VIEWPORT_MARGIN, anchorRect.top - Math.min(modalRect.height, spaceAbove) - offset);
  } else if (!prefersBottom && spaceAbove < 200 && spaceBelow > spaceAbove) {
    top = anchorRect.bottom + offset;
  }

  top = Math.max(VIEWPORT_MARGIN, top);

  const maxHeight = Math.max(
    240,
    viewportHeight - top - VIEWPORT_MARGIN
  );

  return { top, left, maxHeight, width };
};

export const Modal: React.FC<ModalProps> = ({
  title,
  subtitle,
  Heading = () => null,
  children,
  Footer = null,
  onClose,
  showModalHeader = true,
  size = ModalSize.MEDIUM,
  style,
  useDefaultTitleLayout = true,
  useDefaultCloseButton = true,
  anchorRef,
  anchorPlacement = "bottom-end",
  anchorOffset = 8,
  showOverlay = true,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [anchoredStyle, setAnchoredStyle] = React.useState<React.CSSProperties | null>(null);
  const isAnchored = Boolean(anchorRef);

  Heading = title
    ? () => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <h4 className="modal__title">{title}</h4>
          {subtitle && <p className="modal__subtitle">{subtitle}</p>}
        </div>
      )
    : Heading;

  const updateAnchoredPosition = React.useCallback(() => {
    const anchorEl = anchorRef?.current;
    const modalEl = modalRef.current;
    if (!anchorEl || !modalEl) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const modalRect = modalEl.getBoundingClientRect();
    const preferredWidth =
      typeof style?.maxWidth === "number"
        ? style.maxWidth
        : typeof style?.width === "number"
          ? style.width
          : modalRect.width || 628;

    const next = getAnchoredPosition(
      anchorRect,
      {
        width: preferredWidth,
        height: modalRect.height || 480,
      },
      anchorPlacement,
      anchorOffset
    );

    setAnchoredStyle({
      top: next.top,
      left: next.left,
      width: next.width,
      height: next.maxHeight,
      maxHeight: next.maxHeight,
      maxWidth: next.width,
    });
  }, [anchorOffset, anchorPlacement, anchorRef, style?.maxWidth, style?.width]);

  React.useEffect(() => {
    if (isAnchored) return;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "overlay";
    };
  }, [isAnchored]);

  React.useLayoutEffect(() => {
    if (!isAnchored) {
      setAnchoredStyle(null);
      return;
    }

    updateAnchoredPosition();
    const frame = window.requestAnimationFrame(() => updateAnchoredPosition());

    const handleReposition = () => updateAnchoredPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isAnchored, updateAnchoredPosition]);

  return (
    <ModalContainer $anchored={isAnchored} $showOverlay={showOverlay}>
      <div
        ref={modalRef}
        className={clsx("modal", {
          "modal--large": size === ModalSize.LARGE,
          "modal--medium": size === ModalSize.MEDIUM,
          "modal--small": size === ModalSize.SMALL,
          "modal--anchored": isAnchored,
        })}
        style={{
          ...style,
          ...(anchoredStyle ?? {}),
        }}
      >
        {useDefaultTitleLayout ? (
          <header
            className={clsx("modal__header", {
              showModalHeader,
            })}
          >
            <div>{Heading && <Heading />}</div>
            {useDefaultCloseButton && (
              <button
                type="button"
                className="modal__btn--close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <Image alt="x" src={closeIcon} width={14} height={14} />
              </button>
            )}
          </header>
        ) : useDefaultCloseButton ? (
          <button
            type="button"
            className="modal__btn--close top-right"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Image alt="x" src={closeIcon} width={14} height={14} />
          </button>
        ) : null}
        <div
          className={clsx("modal__body", {
            "modal__body--with-footer": !!Footer,
          })}
        >
          {showModalHeader ? null : <br />}
          {children}
        </div>
        {Footer && (
          <footer className={clsx("modal__footer")}>
            <Footer />
          </footer>
        )}
      </div>
      <button
        type="button"
        tabIndex={-1}
        className="modal__overlay"
        onClick={onClose}
        aria-label="Close modal"
      />
    </ModalContainer>
  );
};

export default Modal;
