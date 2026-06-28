import { TagType } from "@/app/components/ui";

export const TICKET_STATUS = {
  open: {
    label: "OPEN",
    value: "open",
    tagColor: TagType.YELLOW,
  },
  assigned: {
    label: "ASSIGNED",
    value: "assigned",
    tagColor: TagType.BLUE,
  },
  closed: {
    label: "CLOSED",
    value: "closed",
    tagColor: TagType.GREEN,
  },
};

export default TICKET_STATUS;
