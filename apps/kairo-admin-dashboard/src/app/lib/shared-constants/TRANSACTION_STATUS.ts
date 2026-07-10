import { TagType } from "@/app/components/ui";

export const TRANSACTION_STATUS = {
  pending: {
    label: "PENDING",
    value: "pending",
    tagColor: TagType.YELLOW,
    tagColorDark: TagType.MAGENTA,
  },
  ongoing: {
    label: "ONGOING",
    value: "ongoing",
    tagColor: TagType.BLUE,
  },
  unsettled: {
    label: "UNSETTLED",
    value: "unsettled",
    tagColor: TagType.YELLOW_DARK,
  },
  failed: {
    label: "FAILED",
    value: "failed",
    tagColor: TagType.RED,
  },
  success: {
    label: "SUCCESS",
    value: "success",
    tagColor: TagType.GREEN,
  },
};

export default TRANSACTION_STATUS;
