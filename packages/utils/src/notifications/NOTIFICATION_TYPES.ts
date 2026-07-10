// Custom notification types with durations
export const NOTIFICATION_TYPES = {
  default: {
    type: "default",
    title: "Info!",
    message: "Welcome",
    dismiss: {
      duration: 5000,
      pauseOnHover: true,
      showIcon: true,
    },
  },
  success: {
    type: "success",
    title: "Success!",
    message: "Success",
    dismiss: {
      duration: 5000,
      pauseOnHover: true,
      showIcon: true,
    },
  },
  error: {
    type: "danger",
    title: "Error!",
    message: "An error occured",
    dismiss: {
      duration: 7000,
      pauseOnHover: true,
      showIcon: true,
    },
  },
  danger: {
    type: "danger",
    title: "Error!",
    message: "An error occured",
    dismiss: {
      duration: 7000,
      pauseOnHover: true,
      showIcon: true,
    },
  },
  info: {
    type: "default",
    title: "Info!",
    message: "Welcome",
    dismiss: {
      duration: 5000,
      pauseOnHover: true,
      showIcon: true,
    },
  },
  warning: {
    type: "warning",
    title: "Warning!",
    message: "Not allowed",
    dismiss: {
      duration: 6000,
      pauseOnHover: true,
      showIcon: true,
    },
  },
};

export default NOTIFICATION_TYPES;
