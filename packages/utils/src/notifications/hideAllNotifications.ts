export const hideAllNotifications = (_notificationStore?: null): void => {
  const containers = document.querySelectorAll(
    '[id^="notification-container-"]',
  );

  containers.forEach((container) => {
    const notifications = container.querySelectorAll(".custom-notification");
    notifications.forEach((notification) => {
      notification.classList.remove("show");
      notification.classList.add("hide");
    });

    setTimeout(() => {
      notifications.forEach((notification) => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      });
    }, 300);
  });
};

export default hideAllNotifications;
