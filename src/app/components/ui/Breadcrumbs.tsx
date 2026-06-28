"use client";

import React from "react";
import styled from "styled-components";

const BreadcrumbsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    color: ${(props) => props.theme.colors.text_01};
    line-height: 24px;
    font-size: 0.875rem;
    font-weight: 500;

    button {
      display: inline-flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text_01};
      line-height: 24px;
      font-size: 0.875rem;
      font-weight: 500;

      &:focus,
      &:hover {
        opacity: 0.85;
        cursor: pointer;
        color: ${(props) => props.theme.colors.primaryColor};
      }
    }

    .breadcrumb__title {
      max-width: 10rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }

    &--active {
      color: ${(props) => props.theme.colors.breadcrumbs.textColor};

      button {
        color: ${(props) => props.theme.colors.breadcrumbs.textColor};
      }
    }
  }
`;
const Separator = styled.span`
  margin: 0 4px;
`;

const IconSeparator = styled.span`
  margin: 0 2px -8px 2px;

  svg {
    display: block;
  }
`;

export interface BreadcrumbItem {
  title: React.ReactNode;
  onClick?: () => void;
  onclick?: () => void;
}

export interface BreadcrumbsProps {
  breadcrumbs?: BreadcrumbItem[];
  separator?: React.ReactNode;
  activeIndex?: number;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  breadcrumbs = [],
  separator = "",
  activeIndex,
}) => {
  const hasActiveIndex = activeIndex !== undefined;

  return (
    <BreadcrumbsContainer className="breadcrumbs">
      {breadcrumbs.map((breadcrumb: BreadcrumbItem, index: number) => {
        const isLast = index === breadcrumbs.length - 1;
        const isActive = hasActiveIndex && index === activeIndex;
        const shouldApplyActiveClass = hasActiveIndex ? isActive : isLast;

        if (isLast) {
          return (
            <span
              key={index}
              className={`breadcrumb ${shouldApplyActiveClass ? "breadcrumb--active" : ""}`}
            >
              <span className="breadcrumb__title">{breadcrumb.title}</span>
            </span>
          );
        }

        const handler = breadcrumb.onClick ?? breadcrumb.onclick;

        return (
          <span
            key={index}
            className={`breadcrumb ${shouldApplyActiveClass ? "breadcrumb--active" : ""}`}
          >
            <button type="button" onClick={handler}>
              <span className="breadcrumb__title">{breadcrumb.title}</span>
            </button>
            {separator ? (
              <Separator>{separator}</Separator>
            ) : (
              <IconSeparator>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24px"
                  height="24px"
                >
                  <path
                    fill="#9B9B9B"
                    d="M8.46,8.29A1,1,0,1,0,7,9.71L9.34,12,7,14.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l3-3a1,1,0,0,0,0-1.42Zm8.5,3-3-3a1,1,0,0,0-1.42,1.42L14.84,12l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l3-3A1,1,0,0,0,17,11.29Z"
                  />
                </svg>
              </IconSeparator>
            )}
          </span>
        );
      })}
    </BreadcrumbsContainer>
  );
};

export default Breadcrumbs;
