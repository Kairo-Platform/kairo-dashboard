"use client";

import { FC, ReactNode, useState, ChangeEvent } from "react";
import styled from "styled-components";
import clsx from "clsx";

const defaultMaxWidth = 480;

const MobileFrameContainer = styled.div<{ bg?: string }>`
  background: ${(p) => p.bg || "transparent"};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;

  .mobile-frame__header {
    display: flex;
    width: 100%;
    padding: 5px 10px;
    border-radius: 4px 0 0 4px;
    background: #f8f8f8;
    align-items: center;
    justify-content: space-between;
    flex: 0 0 32px;
    z-index: 2;

    @media (max-width: ${defaultMaxWidth}px) {
      display: none;
    }

    .mobile-frame__actions {
      display: flex;
      align-items: center;
    }

    .mobile-frame__action {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 5px;
      vertical-align: middle;
      border-radius: 5px;

      &.red {
        background: #fc625d;
      }

      &.yellow {
        background: #fec041;
      }

      &.green {
        background: #35ca4a;
      }
    }

    .mobile-frame__select {
      height: 28px;
      padding: 4px;
      border-color: transparent;
      background-color: transparent;
      outline: none;
    }
  }

  .mobile-frame__body {
    flex-grow: 1;
    position: relative;
    overflow-y: auto;
  }

  &.isMobile {
    .mobile-frame {
      box-shadow: none;
      width: 100%;
      height: 100vh;
      height: 100svh;
      margin: 0 auto;
    }

    .mobile-frame__header {
      display: none;
    }
  }
`;

const MobileFrameInner = styled.div<{ $maxWidth?: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${(p) => p.$maxWidth || `${defaultMaxWidth}px`};
  height: 90vh;
  margin: 5vh auto;
  transition: width 0.3s ease;
  transform: scale(1, 1);
  border-radius: 4px;
  background: white;
  box-shadow: 0 0.1rem 0.4rem rgb(0 0 0 / 30%);

  @media (max-width: ${defaultMaxWidth}px) {
    box-shadow: none;
    width: 100%;
    height: 100vh;
    height: 100svh;
    margin: 0 auto;
  }
`;

export interface MobileFrameProps {
  children?: ReactNode;
  background?: string;
  width?: number;
  isMobile?: boolean;
}

export const MobileFrame: FC<MobileFrameProps> = ({
  children,
  background,
  width,
  isMobile = false,
}) => {
  const [maxWidth, setMaxWidth] = useState<number>(width || defaultMaxWidth);

  return (
    <MobileFrameContainer
      className={clsx("mobile-frame-container", { isMobile })}
      bg={background}
    >
      <MobileFrameInner
        className="mobile-frame"
        $maxWidth={isMobile ? "100%" : `${maxWidth}px`}
      >
        <header className="mobile-frame__header">
          <div className="mobile-frame__actions">
            <div className="mobile-frame__action red"></div>
            <div className="mobile-frame__action yellow"></div>
            <div className="mobile-frame__action green"></div>
          </div>
          <select
            className="mobile-frame__select"
            value={maxWidth}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setMaxWidth(Number(e.target.value))
            }
            aria-label={"Viewport width"}
            title={"Viewport width"}
          >
            {typeof width === "number" && (
              <option value={width}>Custom - {width}</option>
            )}
            <option value={1440}>Desktop - 1440</option>
            <option value={1440}>Desktop - 1440</option>
            <option value={1280}>Desktop - 1280</option>
            <option value={1024}>Desktop - 1024</option>
            <option value={768}>Tablet - 768</option>
            <option value={600}>Tablet - 600</option>
            <option value={480}>Mobile - 480</option>
            <option value={400}>Mobile - 400</option>
            <option value={360}>Mobile - 360</option>
          </select>
        </header>
        <div className="mobile-frame__body">{children}</div>
      </MobileFrameInner>
    </MobileFrameContainer>
  );
};

export default MobileFrame;
