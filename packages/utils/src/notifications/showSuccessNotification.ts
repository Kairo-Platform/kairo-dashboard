import { showNotification } from "./showNotification";

type ShowSuccessNotificationParams = {
  message?: string;
  id?: string | number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
};

export const showSuccessNotification = ({
  message = "Success",
  id,
  position,
}: ShowSuccessNotificationParams = {}): ReturnType<typeof showNotification> => {
  return showNotification({
    id,
    message,
    type: "success",
    position,
  });
};

export default showSuccessNotification;
