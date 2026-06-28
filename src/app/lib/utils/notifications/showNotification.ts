import { NOTIFICATION_TYPES } from "./NOTIFICATION_TYPES";

type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type NotificationDismiss = {
  duration?: number;
  pauseOnHover?: boolean;
  showIcon?: boolean;
};

type ShowNotificationParams = {
  id?: string | number;
  message?: string;
  type?: "success" | "error" | "danger" | "warning" | "info" | "default";
  dismiss?: NotificationDismiss;
  position?: NotificationPosition;
  dedupe?: boolean;
  dedupeKey?: string;
  dedupeWindow?: number;
  extendOnDuplicate?: boolean;
};

let notificationCounter = 0;
type ActiveNotification = {
  timeoutId: NodeJS.Timeout | null;
  remove: () => void;
  duration: number;
  dedupeKey?: string;
  lastShownAt: number;
};

const activeNotifications = new Map<string, ActiveNotification>();
const dedupeIndex = new Map<string, string>();

const normalizeMessage = (value: string = "") =>
  value.trim().replace(/\s+/g, " ");

const buildDedupeKey = ({
  message,
  type,
  position,
  dedupeKey,
}: {
  message: string;
  type: string;
  position: NotificationPosition;
  dedupeKey?: string;
}) => dedupeKey || `${type}|${position}|${normalizeMessage(message)}`;

const getIconConfig = (type: string) => {
  switch (type) {
    case "success":
      return { icon: "✓", iconClass: "notification-icon-success" };
    case "error":
    case "danger":
      return { icon: "✕", iconClass: "notification-icon-error" };
    case "warning":
    case "info":
    case "default":
    default:
      return { icon: "ℹ", iconClass: "notification-icon-warning" };
  }
};

const ensureContainer = (position: NotificationPosition): HTMLElement => {
  const containerId = `notification-container-${position}`;
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.className = `notification-container notification-container-${position}`;
    document.body.appendChild(container);
  }

  return container;
};

export const showNotification = (
  {
    id,
    message,
    type: typeKey = "default",
    dismiss = {},
    position = "bottom-center",
    dedupe = true,
    dedupeKey,
    dedupeWindow = 0,
    extendOnDuplicate = true,
  }: ShowNotificationParams = {} as ShowNotificationParams,
): [null, string] => {
  const notificationType =
    (NOTIFICATION_TYPES as any)[typeKey] || NOTIFICATION_TYPES.default;
  const notificationId =
    id?.toString() || `notification-${++notificationCounter}`;
  const duration = dismiss.duration ?? notificationType.dismiss.duration;
  const pauseOnHover =
    dismiss.pauseOnHover ?? notificationType.dismiss.pauseOnHover;
  const notificationMessage = message || notificationType.message;
  const signature = buildDedupeKey({
    message: notificationMessage,
    type: typeKey,
    position,
    dedupeKey,
  });

  if (dedupe) {
    const existingId = dedupeIndex.get(signature);
    if (existingId) {
      const existing = activeNotifications.get(existingId);
      if (existing) {
        const withinWindow =
          dedupeWindow <= 0 ||
          Date.now() - existing.lastShownAt <= dedupeWindow;

        if (withinWindow) {
          existing.lastShownAt = Date.now();

          if (extendOnDuplicate && existing.duration > 0) {
            if (existing.timeoutId) {
              clearTimeout(existing.timeoutId);
            }

            existing.timeoutId = setTimeout(existing.remove, existing.duration);
          }

          return [null, existingId];
        }
      }
    }
  }

  const { icon, iconClass } = getIconConfig(typeKey);

  const container = ensureContainer(position);

  const notification = document.createElement("div");
  notification.id = notificationId;
  notification.className = "custom-notification";

  const iconEl = document.createElement("div");
  iconEl.className = `notification-icon ${iconClass}`;
  iconEl.textContent = icon;

  const messageEl = document.createElement("div");
  messageEl.className = "notification-message";
  messageEl.textContent = notificationMessage;

  notification.appendChild(iconEl);
  notification.appendChild(messageEl);

  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  let timeoutId: NodeJS.Timeout | null = null;

  const removeNotification = () => {
    notification.classList.remove("show");
    notification.classList.add("hide");

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }

      const meta = activeNotifications.get(notificationId);
      if (meta?.dedupeKey) {
        dedupeIndex.delete(meta.dedupeKey);
      }

      activeNotifications.delete(notificationId);
    }, 300);
  };

  if (duration > 0) {
    timeoutId = setTimeout(removeNotification, duration);
  }

  activeNotifications.set(notificationId, {
    timeoutId,
    remove: removeNotification,
    duration,
    dedupeKey: dedupe ? signature : undefined,
    lastShownAt: Date.now(),
  });

  if (dedupe) {
    dedupeIndex.set(signature, notificationId);
  }

  if (pauseOnHover) {
    notification.addEventListener("mouseenter", () => {
      const current = activeNotifications.get(notificationId);
      if (current?.timeoutId) {
        clearTimeout(current.timeoutId);
        current.timeoutId = null;
      }
    });

    notification.addEventListener("mouseleave", () => {
      if (duration > 0) {
        timeoutId = setTimeout(removeNotification, duration);

        const current = activeNotifications.get(notificationId);
        if (current) {
          current.timeoutId = timeoutId;
        }
      }
    });
  }

  return [null, notificationId];
};

export default showNotification;
