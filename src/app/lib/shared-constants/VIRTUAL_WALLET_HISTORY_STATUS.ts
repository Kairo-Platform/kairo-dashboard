import { TagType } from "@/app/components/ui";

export const VIRTUAL_WALLET_HISTORY_STATUS = {
  success: {
    label: "SUCCESS",
    value: "success",
    tagColor: TagType.GREEN,
  },
  failed: {
    label: "FAILED",
    value: "failed",
    tagColor: TagType.RED,
  },
};

export default VIRTUAL_WALLET_HISTORY_STATUS;
