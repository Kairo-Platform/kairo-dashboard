import { TagType } from "@/app/components/ui";

export const PAYMENT_STATUS = {
  initiated: {
    label: "Initiated",
    value: "initiated",
    tagColor: TagType.MAGENTA,
    icon: "iconoir:page-edit", // Example icon: <Icon icon="iconoir:page-edit" />
  },
  pending: {
    label: "Pending",
    value: "pending",
    tagColor: TagType.PURPLE_COOL,
    icon: "tabler:clock-filled", // Example icon: <Icon icon="iconoir:time-clock" />
  },
  ongoing: {
    label: "Ongoing",
    value: "ongoing",
    tagColor: TagType.BLUE,
    icon: "tabler:clock", // Example icon: <Icon icon="tabler:clock" />
  },
  failed: {
    label: "Failed",
    value: "failed",
    tagColor: TagType.RED,
    icon: "ic:round-error", // Example icon: <Icon icon="ic:round-error" />
  },
  success: {
    label: "Success",
    value: "success",
    tagColor: TagType.GREEN,
    icon: "lets-icons:check-fill", // Example icon: <Icon icon="lets-icons:check-fill" />
  },
};

export default PAYMENT_STATUS;
