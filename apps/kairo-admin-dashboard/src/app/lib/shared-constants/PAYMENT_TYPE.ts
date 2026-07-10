import { TagType } from "@/app/components/ui";

export const PAYMENT_TYPE = {
  credit: {
    label: "CREDIT",
    value: "credit",
    tagColor: TagType.GREEN,
  },
  debit: {
    label: "DEBIT",
    value: "debit",
    tagColor: TagType.RED,
  },
};

export default PAYMENT_TYPE;
