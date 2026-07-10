import { TagType } from "@/app/components/ui";

export const WALLET_HISTORY_STATUS = {
  pending: {
    label: "PENDING",
    value: "pending",
    tagColor: TagType.YELLOW,
  },
  ongoing: {
    label: "ONGOING",
    value: "ongoing",
    tagColor: TagType.BLUE,
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

export default WALLET_HISTORY_STATUS;
