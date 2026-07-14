import { TagType } from "@kairo/ui";

export const PAYMENT_STATUS = {
  initiated: {
    label: "Initiated",
    value: "initiated",
    tagColor: TagType.MAGENTA,
    icon: "iconoir:page-edit",
  },
  pending: {
    label: "Pending",
    value: "pending",
    tagColor: TagType.PURPLE_COOL,
    icon: "tabler:clock-filled",
  },
  ongoing: {
    label: "Ongoing",
    value: "ongoing",
    tagColor: TagType.BLUE,
    icon: "tabler:clock",
  },
  failed: {
    label: "Failed",
    value: "failed",
    tagColor: TagType.RED,
    icon: "ic:round-error",
  },
  success: {
    label: "Success",
    value: "success",
    tagColor: TagType.GREEN,
    icon: "lets-icons:check-fill",
  },
} as const;

export default PAYMENT_STATUS;
