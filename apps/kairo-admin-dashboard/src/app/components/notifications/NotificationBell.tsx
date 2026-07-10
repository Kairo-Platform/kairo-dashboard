"use client";

import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";
import {
  Button,
  ButtonClass,
  Divider,
  Flex,
  Loading,
  Tabs,
} from "@/app/components/ui";
import { Icon } from "@iconify/react";
import { useEntity } from "simpler-state";
import dayjs from "dayjs";
// import {
//   notificationsStore,
//   fetchAllAdminNotifications,
//   fetchAllUserNotifications,
// } from "@/app/store/notifications";
import {
  formatDate,
  parseApiError,
  showErrorNotification,
  showSuccessNotification,
} from "@/app/lib/utils";
import { URL } from "@/app/lib/constants";
// import { NotificationServiceBackOffice } from "@/services/notificationApiBackOffice/NotificationServiceBackOffice";
// import { NotificationServiceXApi } from "@/services/notificationApiXApi/NotificationServiceXApi";

const NotificationBellContainer = styled.div`
  position: relative;
  color: ${(props) => props.theme.colors.white};
  display: inline-block;

  .NotificationBell__count {
    position: absolute;
    top: -0.3125rem;
    right: -0.3125rem;
    background-color: ${(props) => props.theme.colors.red_01};
    color: ${(props) => props.theme.colors.white};
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    font-weight: 600;
    z-index: 1;
  }

  .NotificationBell__panel {
    position: absolute;
    top: calc(100% + 0.625rem);
    right: 0;
    width: min(92vw, 26.25rem);
    height: min(75vh, 38.75rem);
    overflow: hidden;
    border: 0.0625rem solid ${(props) => props.theme.colors.dividerColor};
    border-radius: 0.75rem;
    background-color: ${(props) => props.theme.colors.ui_01};
    box-shadow: 0 0.625rem 1.875rem rgba(0, 0, 0, 0.15);
    z-index: 30;
    color: ${(props) => props.theme.colors.text_01};
    display: flex;
    flex-direction: column;

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 100dvh;
      border-radius: 0;
      border: 0;
      box-shadow: none;
    }
  }

  .NotificationBell__panelHeader {
    padding: 1rem 1rem 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: ${(props) => props.theme.colors.text_01};
    }
  }

  .NotificationBell__tabs {
    padding: 0 1rem;
  }

  .NotificationBell__panelBody {
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }

  .NotificationBell__panelFooter {
    padding: 0.75rem 1rem;
    border-top: 0.0625rem solid ${(props) => props.theme.colors.dividerColor};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .NotificationBell__state {
    padding: 1.2rem 1rem;
    color: ${(props) => props.theme.colors.text_04};
    font-size: 0.8125rem;
    text-align: center;
  }

  .NotificationBell__group {
    padding: 0.25rem 0;
  }

  .NotificationBell__groupTitle {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 0.45rem 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: ${(props) => props.theme.colors.text_04};
    text-transform: uppercase;
    background-color: ${(props) => props.theme.colors.ui_01};
  }

  .NotificationBell__row {
    padding: 0.75rem 1rem;
  }

  .NotificationBell__rowShell {
    position: relative;
  }

  .NotificationBell__rowButton {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    text-align: left;
    background: transparent;
    border: 0;
    cursor: pointer;
    padding: 0;
    color: inherit;

    &:focus-visible {
      outline: 0.125rem solid ${(props) => props.theme.colors.blue_01};
      outline-offset: 0.125rem;
      border-radius: 0.5rem;
    }
  }

  .NotificationBell__rowContent {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .NotificationBell__rowIcon {
    width: 2.125rem;
    height: 2.125rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .NotificationBell__rowIcon--info {
    color: #107eff;
    background-color: rgba(16, 126, 255, 0.1);
  }

  .NotificationBell__rowIcon--success {
    color: #149856;
    background-color: rgba(20, 152, 86, 0.1);
  }

  .NotificationBell__rowIcon--warning {
    color: #db9d24;
    background-color: rgba(219, 157, 36, 0.1);
  }

  .NotificationBell__rowIcon--error {
    color: #d14949;
    background-color: rgba(209, 73, 73, 0.1);
  }

  .NotificationBell__rowText {
    flex: 1;
    min-width: 0;

    .title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: ${(props) => props.theme.colors.text_01};
      margin-bottom: 0.2rem;
    }

    .body {
      font-size: 0.75rem;
      line-height: 1.35;
      color: ${(props) => props.theme.colors.text_04};
      word-break: break-word;
    }
  }

  .NotificationBell__meta {
    flex: 0 0 auto;
    min-width: 3.875rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.35rem;

    .time {
      font-size: 0.6875rem;
      color: ${(props) => props.theme.colors.text_05};
      white-space: nowrap;
    }

    .unreadDot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background-color: ${(props) => props.theme.colors.blue};
    }
  }

  .NotificationBell__rowAction {
    position: absolute;
    right: 0;
    top: -2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    z-index: 1;
  }
`;

type NotificationBellProps = {
  forEntity?: boolean;
};

type NotificationLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

type NotificationItem = {
  id: string;
  title?: string;
  body?: string;
  level?: NotificationLevel | string;
  createdAt?: string;
  isRead?: boolean;
};

type NotificationBucket = {
  key: string;
  label: string;
  items: NotificationItem[];
};

const getLevelPresentation = (level?: string) => {
  const normalized = String(level || "INFO").toUpperCase() as NotificationLevel;

  if (normalized === "SUCCESS") {
    return {
      iconClassName: "NotificationBell__rowIcon--success",
      icon: "solar:check-circle-linear",
    };
  }

  if (normalized === "WARNING") {
    return {
      iconClassName: "NotificationBell__rowIcon--warning",
      icon: "solar:danger-triangle-linear",
    };
  }

  if (normalized === "ERROR") {
    return {
      iconClassName: "NotificationBell__rowIcon--error",
      icon: "solar:close-circle-linear",
    };
  }

  return {
    iconClassName: "NotificationBell__rowIcon--info",
    icon: "solar:info-circle-linear",
  };
};

const getGroupLabel = (date?: string) => {
  if (!date) return "Unknown";
  const value = dayjs(date);
  if (!value.isValid()) return "Unknown";

  if (value.isSame(dayjs(), "day")) return "Today";
  if (value.isSame(dayjs().subtract(1, "day"), "day")) return "Yesterday";
  return String(formatDate(value.toISOString(), "DD MMM YYYY"));
};

const getTimeLabel = (date?: string) => {
  if (!date) return "-";
  return String(formatDate(date, "h:mm A"));
};

const parseNotifications = (payload: any): NotificationItem[] => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const groupNotifications = (
  items: NotificationItem[],
): NotificationBucket[] => {
  const sorted = [...items].sort((a, b) => {
    const left = dayjs(a?.createdAt).valueOf();
    const right = dayjs(b?.createdAt).valueOf();
    return right - left;
  });

  return sorted.reduce<NotificationBucket[]>((acc, item) => {
    const key = dayjs(item.createdAt).isValid()
      ? dayjs(item.createdAt).format("YYYY-MM-DD")
      : "unknown";
    const existing = acc.find((bucket) => bucket.key === key);
    if (existing) {
      existing.items.push(item);
      return acc;
    }

    acc.push({
      key,
      label: getGroupLabel(item.createdAt),
      items: [item],
    });
    return acc;
  }, []);
};

export const NotificationBell: FC<NotificationBellProps> = ({
  forEntity = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [markingNotificationId, setMarkingNotificationId] = useState<
    string | null
  >(null);

  // const {
  //   allAdminNotifications,
  //   allUserNotifications,
  //   fetchingAllAdminNotifications,
  //   fetchingAllUserNotifications,
  // } = useEntity(notificationsStore);

  // const fetchAllNotifications = useCallback(
  //   async (tab: "all" | "unread" = "all") => {
  //     const query = tab === "unread" ? { isRead: false } : undefined;
  //     if (forEntity) {
  //       await fetchAllUserNotifications(query);
  //     } else {
  //       await fetchAllAdminNotifications(query);
  //     }
  //   },
  //   [forEntity],
  // );

  const markAllAsRead = useCallback(async () => {
    setMarkingAllAsRead(true);
    try {
      // if (forEntity) {
      //   await NotificationServiceXApi.markAllNotificationsAsRead();
      // } else {
      //   await NotificationServiceBackOffice.markAllNotificationsAsRead();
      // }

      // await fetchAllNotifications(activeTabIndex === 1 ? "unread" : "all");
      showSuccessNotification({
        message: "All notifications marked as read",
      });
    } catch (error) {
      showErrorNotification({
        message: parseApiError(error, "Failed to mark notifications as read"),
      });
    } finally {
      setMarkingAllAsRead(false);
    }
  }, [activeTabIndex, forEntity]);

  const markNotificationAsRead = useCallback(
    async (notificationId: string) => {
      setMarkingNotificationId(notificationId);
      try {
        // if (forEntity) {
        //   await NotificationServiceXApi.markNotificationAsRead(notificationId);
        // } else {
        //   await NotificationServiceBackOffice.markNotificationAsRead(
        //     notificationId,
        //   );
        // }

        setSelectedNotificationId(null);
        // await fetchAllNotifications(activeTabIndex === 1 ? "unread" : "all");
        showSuccessNotification({
          message: "Notification marked as read",
        });
      } catch (error) {
        showErrorNotification({
          message: parseApiError(error, "Failed to mark notification as read"),
        });
      } finally {
        setMarkingNotificationId(null);
      }
    },
    [activeTabIndex, forEntity],
  );

  // useEffect(() => {
  //   void fetchAllNotifications("all");
  // }, [fetchAllNotifications]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // useEffect(() => {
  //   if (!isOpen) return;
  //   void fetchAllNotifications(activeTabIndex === 1 ? "unread" : "all");
  // }, [activeTabIndex, fetchAllNotifications, isOpen]);

  const payload = {}
  //   ? allUserNotifications?.data
  //   : allAdminNotifications?.data;
  const isFetching = false
  //   ? fetchingAllUserNotifications
  //   : fetchingAllAdminNotifications;`

  const notifications = useMemo(() => parseNotifications(payload), [payload]);

  // const unreadCount = Number(
  //   payload?.unreadCount ??
  //     notifications.filter((notification) => !notification?.isRead).length ??
  //     0,
  // );

  const groupedNotifications = useMemo(
    () => groupNotifications(notifications),
    [notifications],
  );

  // const count = unreadCount;

  const notificationsPageUrl = useMemo(() => {
    if (!forEntity) return URL.NOTIFICATIONS_URL;
    if (pathname?.startsWith("/merchant"))
      return URL.MERCHANT_NOTIFICATIONS_URL;
    if (pathname?.startsWith("/agency")) return URL.AGENCY_NOTIFICATIONS_URL;
    if (pathname?.startsWith("/business-aggregator")) {
      return URL.BUSINESS_AGGREGATOR_NOTIFICATIONS_URL;
    }
    if (pathname?.startsWith("/distribution-manager")) {
      return URL.DISTRIBUTION_MANAGER_NOTIFICATIONS_URL;
    }

    return URL.NOTIFICATIONS_URL;
  }, [forEntity, pathname]);

  return (
    <NotificationBellContainer ref={containerRef}>
      {/* {count > 0 && (
        <div className="NotificationBell__count">
          {count > 99 ? "99+" : count}
        </div>
      )} */}
      <Button
        classes={[ButtonClass.ICON_ONLY, ButtonClass.SOLID_GREY]}
        style={{ padding: "0.5rem" }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Icon
          icon="hugeicons:notification-01"
          width={20}
          height={20}
          color="currentColor"
        />
      </Button>

      {isOpen && (
        <div className="NotificationBell__panel">
          <div className="NotificationBell__panelHeader">
            <h3>Notifications</h3>

            <Flex align="center" gap="0.5rem">
              {/* {unreadCount > 0 && (
                <Button
                  classes={[ButtonClass.TEXT_ONLY]}
                  onClick={() => void markAllAsRead()}
                  disabled={markingAllAsRead}
                >
                  {markingAllAsRead ? "Marking..." : "Mark all as read"}
                </Button>
              )} */}
              <Button
                classes={[ButtonClass.ICON_ONLY]}
                onClick={() => setIsOpen(false)}
              >
                <Icon icon="mingcute:close-line" width={16} height={16} />
              </Button>
            </Flex>
          </div>

          <div className="NotificationBell__tabs">
            <Tabs
              activeTabIndex={activeTabIndex}
              onActiveTabChange={setActiveTabIndex}
              tabs={[
                {
                  title: "All",
                  content: null,
                },
                // {
                //   title: `Unread (${unreadCount})`,
                //   content: null,
                // },
              ]}
            />
          </div>

          <div className="NotificationBell__panelBody">
            {isFetching ? (
              <div className="NotificationBell__state">
                <Loading>Loading notifications...</Loading>
              </div>
            ) : groupedNotifications.length ? (
              groupedNotifications.map((group) => (
                <div className="NotificationBell__group" key={group.key}>
                  <div className="NotificationBell__groupTitle">
                    {group.label}
                  </div>
                  {group.items.map((notification, itemIndex) => {
                    const presentation = getLevelPresentation(
                      notification.level,
                    );
                    const showDivider = itemIndex < group.items.length - 1;
                    const isUnread = !notification.isRead;
                    const isSelected =
                      selectedNotificationId === notification.id;

                    return (
                      <div
                        key={notification.id}
                        className="NotificationBell__row"
                      >
                        <div className="NotificationBell__rowShell">
                          <button
                            type="button"
                            className="NotificationBell__rowButton"
                            onClick={() => {
                              if (isUnread) {
                                setSelectedNotificationId((current) =>
                                  current === notification.id
                                    ? null
                                    : notification.id,
                                );
                              }
                            }}
                          >
                            <span
                              className={`NotificationBell__rowIcon ${presentation.iconClassName}`}
                            >
                              <Icon
                                icon={presentation.icon}
                                width="1.125rem"
                                height="1.125rem"
                              />
                            </span>

                            <div className="NotificationBell__rowText">
                              <p className="title">
                                {notification.title || "Notification"}
                              </p>
                              <p className="body">{notification.body || "-"}</p>
                            </div>

                            <div className="NotificationBell__meta">
                              <span className="time">
                                {getTimeLabel(notification.createdAt)}
                              </span>
                              {isUnread && <span className="unreadDot" />}
                            </div>
                          </button>

                          {isUnread && isSelected && (
                            <div className="NotificationBell__rowAction">
                              <Button
                                classes={[
                                  ButtonClass.ICON_ONLY,
                                  ButtonClass.OUTLINED,
                                ]}
                                onClick={() =>
                                  void markNotificationAsRead(notification.id)
                                }
                                loading={
                                  markingNotificationId === notification.id
                                }
                                style={{ padding: "0.4rem" }}
                              >
                                <Icon
                                  icon="solar:check-read-linear"
                                  width={16}
                                  height={16}
                                />
                              </Button>
                            </div>
                          )}
                        </div>
                        {showDivider && (
                          <Divider style={{ marginTop: "0.8rem" }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <p className="NotificationBell__state">No notifications found.</p>
            )}
          </div>

          <div className="NotificationBell__panelFooter">
            <Button
              classes={[ButtonClass.TEXT_ONLY]}
              onClick={() => {
                setIsOpen(false);
                router.push(notificationsPageUrl);
              }}
            >
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </NotificationBellContainer>
  );
};
