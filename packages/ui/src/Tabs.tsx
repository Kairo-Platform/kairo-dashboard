"use client";

import {
  FC,
  ReactNode,
  Children,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import styled from "styled-components";
import { Tab } from "./Tab";
import { FadeCSSTransition } from "./transitions";
import slugify from "underscore.string/slugify";
import clsx from "clsx";

const TabsContainer = styled.div`
  .tabs {
    display: block;
    width: 100%;
  }

  .tab-list {
    display: flex;
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    border-bottom: 2px solid ${(props) => props.theme.colors.tabListBorder};
    white-space: nowrap;
    flex-wrap: wrap;
  }

  .tabs[data-align="left"] > .tab-list {
    text-align: right;
  }

  .tabs[data-align="right"] > .tab-list {
    text-align: right;
  }

  .tabs[data-align="center"] > .tab-list {
    text-align: center;
    justify-content: center;
  }

  .tab-content {
    display: block;
    width: 100%;
    margin: 1rem 0;
  }

  .tabs--button {
    & > .tab-list {
      border: 0;
    }

    & > .tab-content {
      border: 2px solid ${(props) => props.theme.colors.tabContentBorder};
      background-color: ${(props) => props.theme.colors.white};
      padding: 1rem;
      margin: 0.5rem 0 1rem 0;
      border-radius: 4px;
    }
  }
  .tabs--pill {
    & > .tab-list {
      border: 0;
    }

    & > .tab-content {
      border: 2px solid ${(props) => props.theme.colors.tabContentBorder};
      background-color: ${(props) => props.theme.colors.white};
      padding: 1rem;
      margin: 0 0 1rem 0;
      border-radius: 0 0 10px 10px;
      margin-top: 1px;
      box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
    }
  }
`;

export const TabType = {
  DEFAULT: "tab",
  BUTTON: "tab-button",
  PILL: "tab-pill",
};
export interface TabItem {
  title?: ReactNode;
  content?:
    | ReactNode
    | ((props: {
        activeTabIndex: number;
        setActiveTabByIndex: (tabIndex: number) => void;
        setActiveTabByHash: (tabTitleHash: string) => void;
        setActiveTab: (tabTitle: string) => void;
      }) => ReactNode);
}

export interface TabsProps {
  tabs?: TabItem[];
  align?: "left" | "right" | "center" | string;
  tabType?: string;
  tabsWrapperClassName?: string;
  activeTabIndex?: number;
  onActiveTabChange?: (activeIndex: number) => void;
  children?: ReactNode;
}

export const Tabs: FC<TabsProps> = (props) => {
  const {
    tabs: tabsProp = [],
    align = "left",
    tabType,
    tabsWrapperClassName,
    activeTabIndex: initialActiveTabIndex = 0,
    onActiveTabChange = () => null,
    children,
  } = props;

  const [activeTabIndex, setActiveTabIndex] = useState<number>(
    initialActiveTabIndex,
  );
  const onActiveTabChangeRef = useRef(onActiveTabChange);

  useEffect(() => {
    onActiveTabChangeRef.current = onActiveTabChange;
  }, [onActiveTabChange]);

  const tabs: TabItem[] = useMemo(() => {
    if (children) {
      return Children.map(children as any, (child: any) => {
        const { title } = child?.props ?? {};
        return { title, content: child?.props?.children } as TabItem;
      }) as TabItem[];
    }
    return tabsProp;
  }, [children, tabsProp]);

  useEffect(() => {
    setActiveTabIndex(initialActiveTabIndex);
  }, [initialActiveTabIndex]);

  const setActiveTabByIndex = (tabIndex: number) => {
    if (tabIndex < 0) return;

    onActiveTabChangeRef.current(tabIndex);

    if (tabIndex !== activeTabIndex) {
      setActiveTabIndex(tabIndex);
    }
  };

  const setActiveTabByHash = (tabTitleHash: string) => {
    const activeTabIndex = tabs.findIndex(
      (tab) => slugify(String(tab.title)) === tabTitleHash,
    );
    setActiveTabByIndex(activeTabIndex);
  };

  const setActiveTab = (tabTitle: string) => {
    const activeTabIndex = tabs.findIndex((tab) => tab.title === tabTitle);
    setActiveTabByIndex(activeTabIndex);
  };

  const mappedTabs = tabs.map((tab, index) => {
    // const { title } = tab
    // return title ? (
    return (
      <Tab
        key={index}
        title={tab.title}
        isActive={String(activeTabIndex) === String(index)}
        onClick={() => setActiveTabByIndex(index)}
        tabClassName={tabType}
      />
    );
    // ) : null
  });

  const mappedTabsContent = tabs.map((tab, index) => {
    const { content } = tab;
    const isActive = String(activeTabIndex) === String(index);
    const contentStyle = { display: `${isActive ? "block" : "none"}` };
    const injectedProps = {
      activeTabIndex,
      setActiveTabByIndex: (tabIndex: number) => setActiveTabByIndex(tabIndex),
      setActiveTabByHash: (tabTitleHash: string) =>
        setActiveTabByHash(tabTitleHash),
      setActiveTab: (tabTitle: string) => setActiveTab(tabTitle),
    };

    return (
      <FadeCSSTransition key={index} in={isActive}>
        <div style={contentStyle}>
          {typeof content === "function"
            ? content(injectedProps)
            : content || null}
        </div>
      </FadeCSSTransition>
    );
  });

  return (
    <TabsContainer>
      <div
        className={clsx(
          tabsWrapperClassName,
          "tabs",
          { "tabs--button": tabType === TabType.BUTTON },
          { "tabs--pill": tabType === TabType.PILL },
        )}
        data-align={align}
      >
        <ul className="tab-list">{mappedTabs}</ul>
        <div className="tab-content">{mappedTabsContent}</div>
      </div>
    </TabsContainer>
  );
};

export default Tabs;
