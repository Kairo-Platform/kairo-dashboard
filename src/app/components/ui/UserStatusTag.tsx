import { Tag, TagType, TagTypeValue } from "./Tag";
import { USER_STATUS } from "@/app/lib/shared-constants";
import humanize from "underscore.string/humanize";

interface UserStatusTagProps {
  status: string;
}

export const UserStatusTag = ({ status }: UserStatusTagProps) => {
  const normalizedStatus = status.toUpperCase();

  const getTagType = (): TagTypeValue => {
    switch (normalizedStatus) {
      case USER_STATUS.INVITED:
        return TagType.BLUE;
      case USER_STATUS.ACTIVE:
        return TagType.GREEN;
      case USER_STATUS.INACTIVE:
        return TagType.GREY;
      case USER_STATUS.SUSPENDED:
      case USER_STATUS.REJECTED:
        return TagType.RED;
      case USER_STATUS.PENDING_APPROVAL:
        return TagType.YELLOW_DARK;
      default:
        return TagType.DEFAULT;
    }
  };

  return <Tag type={getTagType()}>{humanize(status)}</Tag>;
};

export default UserStatusTag;
