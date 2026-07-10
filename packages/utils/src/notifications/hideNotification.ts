export const hideNotification = (
  _notificationStore?: null,
  notificationId = "",
): void => {
  if (!notificationId) return;

  const notification = document.getElementById(notificationId);
  if (notification) {
    notification.classList.remove("show");
    notification.classList.add("hide");

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
};

export default hideNotification;
