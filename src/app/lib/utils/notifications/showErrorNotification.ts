import { showNotification } from "./showNotification";
import { NOTIFICATION_TYPES } from "./NOTIFICATION_TYPES";

type ShowErrorNotificationParams = {
  message?: string;
  body?: any;
  id?: string | number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
};

export const showErrorNotification = ({
  message = "An error occured",
  body = {},
  id,
  position,
}: ShowErrorNotificationParams = {}): ReturnType<typeof showNotification> => {
  const apiErrorMessages = Object.values(body?.data || {});
  const processApiErrorMessages = (messages: any[] = []) => {
    const firstMessage = messages[0];
    if (Array.isArray(firstMessage)) {
      return firstMessage?.[0]?.error;
    }
    return firstMessage;
  };

  if (body?.statusCode === 406 && apiErrorMessages.length > 0) {
    return showNotification({
      id,
      message: processApiErrorMessages(apiErrorMessages),
      type: "error",
      dismiss: {
        duration: NOTIFICATION_TYPES.error.dismiss.duration,
      },
      position,
    });
  }

  return showNotification({
    id,
    message,
    type: "error",
    dismiss: {
      duration: NOTIFICATION_TYPES.error.dismiss.duration,
    },
    position,
  });
};

export default showErrorNotification;
