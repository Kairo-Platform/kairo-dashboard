"use client";

import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useEntity } from "simpler-state";
import { NotificationsDateFilterButton } from "@/app/components/notifications/NotificationsDateFilterButton";
import {
  Button,
  ButtonClass,
  Divider,
  Flex,
  Loading,
  Modal,
  ModalSize,
  Tabs,
} from "@/app/components/ui";
import {
  formatDate,
  parseApiError,
  showErrorNotification,
  showSuccessNotification,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
} from "@/app/lib/utils";
import { useModal } from "@/app/lib/hooks";
// import {
//   fetchAllAdminNotifications,
//   fetchAdminNotificationById,
//   fetchAllAdminBroadcasts,
//   fetchAdminBroadcastById,
//   fetchAllUserNotifications,
//   fetchUserNotificationById,
//   notificationsStore,
// } from "@/app/store/notifications";
// import { NotificationServiceBackOffice } from "@/services/notificationApiBackOffice/NotificationServiceBackOffice";
// import { NotificationServiceXApi } from "@/services/notificationApiXApi/NotificationServiceXApi";
import { ButtonSize } from "../ui/Button";
import { CreateBroadcastModal } from "@/app/components/notifications/CreateBroadcastModal";

const NotificationsPageContainer = styled.div`
  .NotificationsPage__header {
    padding: 1rem;
  }

  .NotificationsPage__controls {
    gap: 1rem;

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .NotificationsPage__actions {
    padding: 0 1rem 0.75rem;
  }

  .NotificationsPage__state {
    padding: 1.2rem 1rem;
    color: ${(props) => props.theme.colors.text_04};
    font-size: 0.8125rem;
    text-align: center;
  }

  .NotificationsPage__group {
    padding: 0.25rem 0;
  }

  .NotificationsPage__groupTitle {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 0.45rem 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: ${(props) => props.theme.colors.text_04};
    text-transform: uppercase;
  }

  .NotificationsPage__row {
    padding: 0.75rem 1rem;
  }

  .NotificationsPage__rowShell {
    position: relative;
  }

  .NotificationsPage__rowButton {
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

  .NotificationsPage__rowIcon {
    width: 2.125rem;
    height: 2.125rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .NotificationsPage__rowIcon--info {
    color: #107eff;
    background-color: rgba(16, 126, 255, 0.1);
  }

  .NotificationsPage__rowIcon--success {
    color: #149856;
    background-color: rgba(20, 152, 86, 0.1);
  }

  .NotificationsPage__rowIcon--warning {
    color: #db9d24;
    background-color: rgba(219, 157, 36, 0.1);
  }

  .NotificationsPage__rowIcon--error {
    color: #d14949;
    background-color: rgba(209, 73, 73, 0.1);
  }

  .NotificationsPage__rowText {
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

  .NotificationsPage__meta {
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

  .NotificationsPage__rowAction {
    position: absolute;
    right: 0;
    top: -2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    z-index: 1;
  }

  .NotificationsPage__detailsWrap {
    border: 0.0625rem solid ${(props) => props.theme.colors.dividerColor};
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .NotificationsPage__detailRow {
    display: grid;
    grid-template-columns: 11rem 1fr;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-bottom: 0.0625rem solid ${(props) => props.theme.colors.dividerColor};

    &:last-child {
      border-bottom: 0;
    }

    .key {
      color: ${(props) => props.theme.colors.text_01};
      font-size: 0.8125rem;
      font-weight: 500;
    }

    .value {
      color: ${(props) => props.theme.colors.text_02};
      font-size: 0.8125rem;
      font-weight: 600;
      word-break: break-word;
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoint.md}) {
    .NotificationsPage__detailRow {
      grid-template-columns: 1fr;
      gap: 0.35rem;
    }
  }
`;

type NotificationLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

type NotificationItem = {
  id?: string;
  _id?: string;
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
      iconClassName: "NotificationsPage__rowIcon--success",
      icon: "solar:check-circle-linear",
    };
  }

  if (normalized === "WARNING") {
    return {
      iconClassName: "NotificationsPage__rowIcon--warning",
      icon: "solar:danger-triangle-linear",
    };
  }

  if (normalized === "ERROR") {
    return {
      iconClassName: "NotificationsPage__rowIcon--error",
      icon: "solar:close-circle-linear",
    };
  }

  return {
    iconClassName: "NotificationsPage__rowIcon--info",
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

const getItemId = (item: NotificationItem): string =>
  String(item?.id || item?._id || "");

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

type NotificationsPageProps = {
  forEntity?: boolean;
  createBroadcastTrigger?: number;
};

export const NotificationsPage: FC<NotificationsPageProps> = ({
  forEntity = false,
  createBroadcastTrigger = 0,
}) => {
  const today = new Date();
  const DEFAULT_PAGE = 1;
  const DEFAULT_LIMIT = 20;
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const {
    showModal: showNotificationDetailsModal,
    openModal: openNotificationDetailsModal,
    closeModal: closeNotificationDetailsModal,
  } = useModal(false);
  const {
    showModal: showCreateBroadcastModal,
    openModal: openCreateBroadcastModal,
    closeModal: closeCreateBroadcastModal,
  } = useModal(false);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [markingNotificationId, setMarkingNotificationId] = useState<
    string | null
  >(null);
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);

  // const {
  //   allAdminNotifications,
  //   adminNotificationById,
  //   allAdminBroadcasts,
  //   adminBroadcastById,
  //   allUserNotifications,
  //   userNotificationById,
  //   fetchingAllAdminNotifications,
  //   fetchingAdminNotificationById,
  //   fetchingAllAdminBroadcasts,
  //   fetchingAdminBroadcastById,
  //   fetchingAllUserNotifications,
  //   fetchingUserNotificationById,
  // } = useEntity(notificationsStore);

  const activeTab = useMemo(() => {
    if (forEntity) {
      return activeTabIndex === 1 ? "unread" : "all";
    }

    if (activeTabIndex === 1) return "unread";
    if (activeTabIndex === 2) return "broadcast";
    return "all";
  }, [activeTabIndex, forEntity]);

  const fetchAllNotifications = useCallback(
    async (tab: "all" | "unread" | "broadcast") => {
      const query: Record<string, string | boolean> = {};

      if (tab === "unread") {
        query.isRead = false;
      }

      // if (startDate) {
      //   query.startDate = String(formatDate(startDate, DATE_FORMAT));
      // }

      // if (endDate) {
      //   query.endDate = String(formatDate(endDate, DATE_FORMAT));
      // }

      query.page = String(page);
      query.limit = String(limit);

      const normalizedQuery =
        Object.keys(query).length > 0
          ? (query as Record<string, string | boolean>)
          : undefined;

      // if (forEntity) {
      //   await fetchAllUserNotifications(normalizedQuery);
      // } else if (tab === "broadcast") {
      //   await fetchAllAdminBroadcasts(normalizedQuery);
      // } else {
      //   await fetchAllAdminNotifications(normalizedQuery);
      // }
    },
    [endDate, forEntity, limit, page, startDate],
  );

  const markAllAsRead = useCallback(async () => {
    setMarkingAllAsRead(true);
    try {
      // if (forEntity) {
      //   await NotificationServiceXApi.markAllNotificationsAsRead();
      // } else {
      //   await NotificationServiceBackOffice.markAllNotificationsAsRead();
      // }

      // await fetchAllNotifications(activeTab);
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
  }, [activeTab, fetchAllNotifications, forEntity]);

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

        // if (forEntity) {
        //   await fetchUserNotificationById(notificationId);
        // } else {
        //   await fetchAdminNotificationById(notificationId);
        // }

        await fetchAllNotifications(activeTab);
        closeNotificationDetailsModal();
        setSelectedNotificationId(null);
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
    [
      activeTab,
      // fetchAdminNotificationById,
      // fetchAllNotifications,
      // fetchUserNotificationById,
      forEntity,
      closeNotificationDetailsModal,
    ],
  );

  const openNotificationDetails = useCallback(
    async (notificationId: string) => {
      setSelectedNotificationId(notificationId);
      openNotificationDetailsModal();

      // if (forEntity) {
      //   await fetchUserNotificationById(notificationId);
      // } else if (activeTab === "broadcast") {
      //   await fetchAdminBroadcastById(notificationId);
      // } else {
      //   await fetchAdminNotificationById(notificationId);
      // }
    },
    [
      activeTab,
      // fetchAdminBroadcastById,
      // fetchAdminNotificationById,
      // fetchUserNotificationById,
      // forEntity,
      openNotificationDetailsModal,
    ],
  );

  useEffect(() => {
    void fetchAllNotifications(activeTab);
  }, [activeTab, fetchAllNotifications]);

  useEffect(() => {
    if (forEntity || !createBroadcastTrigger) return;

    setActiveTabIndex(2);
    openCreateBroadcastModal();
  }, [createBroadcastTrigger, forEntity, openCreateBroadcastModal]);

  const payload = {}
  // ? allUserNotifications?.data
  // : activeTab === "broadcast"
  //   ? allAdminBroadcasts?.data
  //   : allAdminNotifications?.data;
  const isFetching = forEntity
  // ? fetchingAllUserNotifications
  // : activeTab === "broadcast"
  //   ? fetchingAllAdminBroadcasts
  //   : fetchingAllAdminNotifications;

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

  const selectedNotification =
    // (forEntity
    //   ? userNotificationById
    //   : activeTab === "broadcast"
    //     ? adminBroadcastById
    //     : adminNotificationById
    // )?.data ||
    // (forEntity
    //   ? userNotificationById
    //   : activeTab === "broadcast"
    //     ? adminBroadcastById
    //     : adminNotificationById) ||
    null;

  const isFetchingSelectedNotification = forEntity
  // ? fetchingUserNotificationById
  // : activeTab === "broadcast"
  //   ? fetchingAdminBroadcastById
  //   : fetchingAdminNotificationById;

  const notificationDetailsRows = useMemo(() => {
    const isBroadcastTab = activeTab === "broadcast";

    // if (isBroadcastTab) {
    //   const rows = [
    //     { key: "Title", value: selectedNotification?.title },
    //     { key: "Description", value: selectedNotification?.body },
    //     {
    //       key: "Receiver Group",
    //       value: Array.isArray(selectedNotification?.receiverGroup)
    //         ? selectedNotification.receiverGroup.join(", ")
    //         : selectedNotification?.receiverGroup,
    //     },
    //     {
    //       key: "Platforms",
    //       value: Array.isArray(selectedNotification?.platforms)
    //         ? selectedNotification.platforms.join(", ")
    //         : selectedNotification?.platforms,
    //     },
    //     { key: "Created By", value: selectedNotification?.createdBy },
    //     {
    //       key: "Created At",
    //       value: selectedNotification?.createdAt
    //         ? String(
    //             formatDate(selectedNotification.createdAt, DATE_TIME_FORMAT),
    //           )
    //         : undefined,
    //     },
    //     {
    //       key: "Updated At",
    //       value: selectedNotification?.updatedAt
    //         ? String(
    //             formatDate(selectedNotification.updatedAt, DATE_TIME_FORMAT),
    //           )
    //         : undefined,
    //     },
    //   ];

    //   return rows.filter(
    //     (row) =>
    //       row.value !== undefined && row.value !== null && row.value !== "",
    //   );
    // }

    // const rows = []
    // [
    //   { key: "Title", value: selectedNotification?.title },
    //   { key: "Description", value: selectedNotification?.body },
    //   { key: "Level", value: selectedNotification?.level },
    //   { key: "Audience", value: selectedNotification?.audience },
    //   {
    //     key: "Type",
    //     value:
    //       selectedNotification?.data?.type ||
    //       selectedNotification?.data?.category,
    //   },
    //   { key: "Entity ID", value: selectedNotification?.entityId },
    //   {
    //     key: "Entity Branch ID",
    //     value: selectedNotification?.entityBranchId,
    //   },
    //   {
    //     key: "Created At",
    //     value: selectedNotification?.createdAt
    //       ? String(formatDate(selectedNotification.createdAt, DATE_TIME_FORMAT))
    //       : undefined,
    //   },
    //   {
    //     key: "Updated At",
    //     value: selectedNotification?.updatedAt
    //       ? String(formatDate(selectedNotification.updatedAt, DATE_TIME_FORMAT))
    //       : undefined,
    //   },
    //   {
    //     key: "Read Status",
    //     value:
    //       typeof selectedNotification?.isRead === "boolean"
    //         ? selectedNotification.isRead
    //           ? "Read"
    //           : "Unread"
    //         : undefined,
    //   },
    //   {
    //     key: "Read At",
    //     value: selectedNotification?.readAt
    //       ? String(formatDate(selectedNotification.readAt, DATE_TIME_FORMAT))
    //       : undefined,
    //   },
    // ];

    // return rows.filter(
    //   (row) =>
    //     row.value !== undefined && row.value !== null && row.value !== "",
    // );
  }, [activeTab, selectedNotification]);

  return (
    <NotificationsPageContainer>
      <div className="NotificationsPage__header">
        <Flex
          justify="space-between"
          align="center"
          className="NotificationsPage__controls"
        >
          <Tabs
            activeTabIndex={activeTabIndex}
            onActiveTabChange={setActiveTabIndex}
            tabs={
              forEntity
                ? [
                  {
                    title: "All",
                    content: null,
                  },
                  // {
                  //   title: `Unread (${unreadCount})`,
                  //   content: null,
                  // },
                ]
                : [
                  {
                    title: "All",
                    content: null,
                  },
                  // {
                  //   title: `Unread (${unreadCount})`,
                  //   content: null,
                  // },
                  {
                    title: "Broadcasts",
                    content: null,
                  },
                ]
            }
          />

          <Flex align="center" gap="1rem">
            {/* {unreadCount > 0 && activeTab !== "broadcast" && ( */}
            <Flex justify="flex-end">
              <Button
                classes={[ButtonClass.TEXT_ONLY]}
                onClick={() => void markAllAsRead()}
                disabled={markingAllAsRead}
              >
                {markingAllAsRead ? "Marking..." : "Mark all as read"}
              </Button>
            </Flex>
            {/* )} */}

            <NotificationsDateFilterButton
              values={{
                startDate,
                endDate,
                page,
                limit,
              }}
              onApply={(values) => {
                setStartDate(values.startDate);
                setEndDate(values.endDate);
                setPage(values.page);
                setLimit(values.limit);
              }}
              onClear={() => {
                const defaultDate = new Date();
                setStartDate(defaultDate);
                setEndDate(defaultDate);
                setPage(DEFAULT_PAGE);
                setLimit(DEFAULT_LIMIT);
              }}
            />
          </Flex>
        </Flex>
      </div>

      <div className="NotificationsPage__body">
        {isFetching ? (
          <div className="NotificationsPage__state">
            <Loading>Loading notifications...</Loading>
          </div>
        ) : groupedNotifications.length ? (
          groupedNotifications.map((group) => (
            <div className="NotificationsPage__group" key={group.key}>
              <div className="NotificationsPage__groupTitle">{group.label}</div>
              {group.items.map((notification, itemIndex) => {
                const presentation = getLevelPresentation(notification.level);
                const showDivider = itemIndex < group.items.length - 1;

                return (
                  <div
                    key={getItemId(notification)}
                    className="NotificationsPage__row"
                  >
                    <div className="NotificationsPage__rowShell">
                      <button
                        type="button"
                        className="NotificationsPage__rowButton"
                        onClick={() => {
                          const notificationId = getItemId(notification);
                          if (notificationId) {
                            void openNotificationDetails(notificationId);
                          }
                        }}
                      >
                        <span
                          className={`NotificationsPage__rowIcon ${presentation.iconClassName}`}
                        >
                          <Icon
                            icon={presentation.icon}
                            width="1.125rem"
                            height="1.125rem"
                          />
                        </span>

                        <div className="NotificationsPage__rowText">
                          <p className="title">
                            {notification.title || "Notification"}
                          </p>
                          <p className="body">{notification.body || "-"}</p>
                        </div>

                        <div className="NotificationsPage__meta">
                          <span className="time">
                            {getTimeLabel(notification.createdAt)}
                          </span>
                          {activeTab !== "broadcast" &&
                            !notification.isRead && (
                              <span className="unreadDot" />
                            )}
                        </div>
                      </button>
                    </div>
                    {showDivider && <Divider style={{ marginTop: "0.8rem" }} />}
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <p className="NotificationsPage__state">No notifications found.</p>
        )}
      </div>

      {showNotificationDetailsModal && (
        <Modal
          title={
            activeTab === "broadcast"
              ? "Broadcast details"
              : "Notification details"
          }
          onClose={() => {
            closeNotificationDetailsModal();
            setSelectedNotificationId(null);
          }}
          size={ModalSize.MEDIUM}
        >
          {isFetchingSelectedNotification ? (
            <div className="NotificationsPage__state">
              <Loading>Loading notification details...</Loading>
            </div>
          ) : (
            <Flex direction="column" gap="1rem">
              <div className="NotificationsPage__detailsWrap">
                {/* {notificationDetailsRows.map((row) => (
                  <div key={row.key} className="NotificationsPage__detailRow">
                    <span className="key">{row.key}</span>
                    <span className="value">{String(row.value)}</span>
                  </div>
                ))} */}
              </div>

              <Flex justify="flex-end" gap="0.75rem">
                <Button
                  classes={[ButtonClass.OUTLINED_GREY_TO_PRIMARY]}
                  onClick={() => {
                    closeNotificationDetailsModal();
                    setSelectedNotificationId(null);
                  }}
                  size={ButtonSize.WIDTH_140}
                >
                  Cancel
                </Button>

                {activeTab !== "broadcast" && (
                  <Button
                    classes={[ButtonClass.SOLID]}
                    onClick={() =>
                      selectedNotificationId
                        ? void markNotificationAsRead(selectedNotificationId)
                        : null
                    }
                    loading={
                      !!selectedNotificationId &&
                      markingNotificationId === selectedNotificationId
                    }
                    size={ButtonSize.WIDTH_140}
                  >
                    Read
                  </Button>
                )}
              </Flex>
            </Flex>
          )}
        </Modal>
      )}

      {showCreateBroadcastModal && (
        <CreateBroadcastModal
          onClose={closeCreateBroadcastModal}
          onSuccess={() => {
            if (!forEntity && activeTab === "broadcast") {
              void fetchAllNotifications("broadcast");
            }
          }}
        />
      )}
    </NotificationsPageContainer>
  );
};

export default NotificationsPage;
