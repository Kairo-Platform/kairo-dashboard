"use client";

import React from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import Link from "next/link";
import clsx from "clsx";

const ContentLayoutElement = styled.div`
  flex: 1;
  width: 100%;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  display: flex;
  padding: 1.5rem;

  &.noBoxShadow {
    box-shadow: none;
    padding: 0;
  }

  .ContentSidebar {
    position: relative;
    /* transition: all 0.5s ease-out; */
    overflow-y: overlay;
    width: 100%;
    max-width: 15rem;
    border-right: 1px solid ${(props) => props.theme.colors.dividerColor};
    padding-right: 1.5rem;
    margin-right: 1.5rem;

    details {
      padding: 2px;

      summary:first-child {
        display: inline-block;
        box-sizing: content-box;
        color: ${(props) => props.theme.colors.text_01};
        font-weight: 700;
        font-size: 0.875rem;
        line-height: 18px;
        letter-spacing: 0.44px;
        margin-bottom: 0.5rem;
        padding: 2px;
        cursor: pointer;
      }

      &:not(:last-child) {
        margin-bottom: 1rem;
      }

      &.withDivider {
        padding-bottom: 1rem;
        border-bottom: 1px solid ${(props) => props.theme.colors.dividerColor};
      }

      ul {
        padding: 0;
      }
    }

    ul {
      margin: 0;
      padding: 2px;

      li {
        list-style: none;
        background-color: ${(props) => props.theme.colors.white};

        .ContentSidebar__nav__link {
          display: flex;
          color: ${(props) => props.theme.colors.linkText};
          font-size: 14px;
          padding: 8px 16px;
          line-height: 19px;
          border-radius: 3px;
          transition: background-color 0.5s ease-out;

          &:focus,
          &:hover {
            background-color: ${(props) => props.theme.colors.ui_04};
            cursor: pointer;
            user-select: none;
          }
        }

        &.isActiveNav {
          .ContentSidebar__nav__link {
            background-color: ${(props) => props.theme.colors.skyBlue};
            color: ${(props) => props.theme.colors.primaryColor};
          }
        }

        &:not(:last-child) {
          margin-bottom: 0.25rem;
        }
      }
    }

    &.with-scrolling {
      ul {
        max-height: 12.5rem;
        overflow: overlay;
      }
    }
  }

  .ContentSidebar__append-element-wrapper {
    margin: 1rem 0;
    padding: 2px;
  }

  .ContentLayout__content-wrapper {
    width: 100%;
  }

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    gap: 2rem;
    flex-direction: column;
    min-height: calc(100vh - 5rem);
    min-height: calc(100svh - 5rem);

    .ContentSidebar {
      padding: 1rem;
      max-width: 100%;
      border-radius: 5px;
      border: 1px solid ${(props) => props.theme.colors.dividerColor};
      margin-right: 0;
    }
  }
`;

export const ContentLayout = ({
  navLinks = [],
  navSections = [],
  appendElementToSidebar = null,
  children,
  noBoxShadow = false,
}: {
  navLinks?: Array<{
    url?: string;
    text: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
  }>;
  navSections?: Array<{
    title?: React.ReactNode;
    items?: Array<{
      url?: string;
      text: React.ReactNode;
      onClick?: () => void;
      active?: boolean;
    }>;
    withDivider?: boolean;
    openByDefault?: boolean;
  }>;
  appendElementToSidebar?: React.ReactNode | null;
  children?: React.ReactNode;
  noBoxShadow?: boolean;
}) => {
  const pathname = usePathname();
  const currentPath = pathname ?? "";
  const mapNavLink = (
    nav: {
      url?: string;
      text: React.ReactNode;
      onClick?: () => void;
      active?: boolean;
    },
    index: number,
  ) => {
    const isActiveNav =
      typeof nav.url === "string" &&
      (nav.url === "/"
        ? currentPath === "/"
        : currentPath === nav.url || currentPath.startsWith(nav.url + "/"));
    return (
      <li
        key={index}
        className={clsx({ isActiveNav: isActiveNav || nav.active })}
        onClick={nav.onClick}
      >
        {nav.url && (
          <Link href={nav.url} className="ContentSidebar__nav__link">
            {nav.text}
          </Link>
        )}
        {!nav.url && (
          <span className="ContentSidebar__nav__link">{nav.text}</span>
        )}
      </li>
    );
  };
  const mapNavSection = (
    navSection: {
      title?: React.ReactNode;
      items?: Array<{
        url?: string;
        text: React.ReactNode;
        onClick?: () => void;
        active?: boolean;
      }>;
      withDivider?: boolean;
      openByDefault?: boolean;
    },
    index: number,
  ) => {
    const { withDivider = false, openByDefault } = navSection;
    const attributes: { open?: boolean } = { open: openByDefault ?? true };
    return (
      <div key={index}>
        {navSection.title ? (
          <details className={clsx({ withDivider })} {...attributes}>
            {navSection.title && <summary>{navSection.title}</summary>}
            <ul>{navSection?.items?.map(mapNavLink)}</ul>
          </details>
        ) : (
          <ul>{navSection?.items?.map(mapNavLink)}</ul>
        )}
      </div>
    );
  };

  const showSidebar = navLinks.length > 0 || navSections.length > 0;

  return (
    <ContentLayoutElement className={clsx({ noBoxShadow })}>
      {showSidebar && (
        <div
          className={clsx("ContentSidebar", {
            "with-scrolling": navSections.length > 1,
          })}
        >
          {navLinks.length > 0 && (
            <nav className="ContentSidebar__nav">
              <ul>{navLinks.map(mapNavLink)}</ul>
            </nav>
          )}
          {navSections.length > 0 && (
            <nav className="ContentSidebar__nav">
              {navSections.map(mapNavSection)}
            </nav>
          )}
          {appendElementToSidebar && (
            <div className="ContentSidebar__append-element-wrapper">
              {appendElementToSidebar}
            </div>
          )}
        </div>
      )}
      <div className="ContentLayout__content-wrapper">
        <div className="ContentLayout__content">{children}</div>
      </div>
    </ContentLayoutElement>
  );
};

export default ContentLayout;
