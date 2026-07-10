"use client";

import type { FC } from "react";
import { Icon } from "@iconify/react";
import styled from "styled-components";
import Tag, { TagType, TagTypeValue } from "./Tag";
import humanize from "underscore.string/humanize";

const PosActiveStatusContainer = styled.span`
  font-size: 14px;
  display: inline-flex;
  align-items: center;
`;

const iconStyle = { verticalAlign: "middle", marginRight: 4 };

interface PosActiveStatusProps {
  deviceStatus:
    | "ACTIVE"
    | "PENDING"
    | "DISABLED"
    | "ADMIN_DISABLED"
    | "ADMIN_SUSPENDED"
    | "ADMIN_LOCKED"
    | string;

  lifecycleStatus?:
    | "UNMAPPED"
    | "MAPPED"
    | "UNACTIVATED"
    | "ACTIVATED"
    | string;
}

export const PosActiveStatus: FC<PosActiveStatusProps> = ({
  deviceStatus,
  lifecycleStatus,
}) => {
  let tagType: TagTypeValue = TagType.GREY;
  let icon = null;
  let label = deviceStatus;

  if (deviceStatus && lifecycleStatus) {
    label = `${humanize(deviceStatus)} | ${humanize(lifecycleStatus)}`;
  } else if (deviceStatus) {
    label = humanize(deviceStatus);
  } else if (lifecycleStatus) {
    label = humanize(lifecycleStatus);
  }

  if (deviceStatus === "ACTIVE" && lifecycleStatus === "ACTIVATED") {
    tagType = TagType.GREEN;
    icon = (
      <Icon
        icon="material-symbols:check-circle-rounded"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "ACTIVE" && lifecycleStatus === "UNMAPPED") {
    tagType = TagType.BLUE;
    icon = (
      <Icon
        icon="material-symbols:check-circle-rounded"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "ACTIVE" && lifecycleStatus === "MAPPED") {
    tagType = TagType.BLUE;
    icon = (
      <Icon
        icon="material-symbols:check-circle-rounded"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "ACTIVE" && lifecycleStatus === "UNACTIVATED") {
    tagType = TagType.YELLOW;
    icon = (
      <Icon
        icon="material-symbols:info"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "PENDING" && lifecycleStatus === "UNMAPPED") {
    tagType = TagType.MAGENTA;
    icon = (
      <Icon
        icon="material-symbols:schedule"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "PENDING" && lifecycleStatus === "MAPPED") {
    tagType = TagType.MAGENTA;
    icon = (
      <Icon
        icon="material-symbols:schedule"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "PENDING" && lifecycleStatus === "UNACTIVATED") {
    tagType = TagType.YELLOW;
    icon = (
      <Icon
        icon="material-symbols:info"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "PENDING" && lifecycleStatus === "ACTIVATED") {
    tagType = TagType.GREEN;
    icon = (
      <Icon
        icon="material-symbols:check-circle-rounded"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (
    (deviceStatus === "DISABLED" || deviceStatus === "ADMIN_DISABLED") &&
    lifecycleStatus === "UNMAPPED"
  ) {
    tagType = TagType.RED;
    icon = (
      <Icon
        icon="fluent:flag-16-filled"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (
    (deviceStatus === "DISABLED" || deviceStatus === "ADMIN_DISABLED") &&
    lifecycleStatus === "MAPPED"
  ) {
    tagType = TagType.RED;
    icon = (
      <Icon
        icon="fluent:flag-16-filled"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (
    (deviceStatus === "DISABLED" || deviceStatus === "ADMIN_DISABLED") &&
    lifecycleStatus === "UNACTIVATED"
  ) {
    tagType = TagType.RED;
    icon = (
      <Icon
        icon="fluent:flag-16-filled"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (
    (deviceStatus === "DISABLED" || deviceStatus === "ADMIN_DISABLED") &&
    lifecycleStatus === "ACTIVATED"
  ) {
    tagType = TagType.RED;
    icon = (
      <Icon
        icon="fluent:flag-16-filled"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "ADMIN_SUSPENDED") {
    tagType = TagType.RED;
    icon = (
      <Icon icon="mdi:pause-circle" width={16} height={16} style={iconStyle} />
    );
  } else if (deviceStatus === "ADMIN_LOCKED") {
    tagType = TagType.GREY;
    icon = <Icon icon="mdi:lock" width={16} height={16} style={iconStyle} />;
  } else if (lifecycleStatus === "UNMAPPED") {
    tagType = TagType.BLUE;
    icon = (
      <Icon
        icon="material-symbols:info"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (lifecycleStatus === "MAPPED") {
    tagType = TagType.BLUE;
    icon = (
      <Icon
        icon="material-symbols:info"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (lifecycleStatus === "UNACTIVATED") {
    tagType = TagType.YELLOW;
    icon = (
      <Icon
        icon="material-symbols:info"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (lifecycleStatus === "ACTIVATED") {
    tagType = TagType.GREEN;
    icon = (
      <Icon
        icon="material-symbols:check-circle-rounded"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "ACTIVE") {
    tagType = TagType.GREEN;
    icon = (
      <Icon
        icon="material-symbols:check-circle-rounded"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "PENDING") {
    tagType = TagType.MAGENTA;
    icon = (
      <Icon
        icon="material-symbols:schedule"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else if (deviceStatus === "DISABLED" || deviceStatus === "ADMIN_DISABLED") {
    tagType = TagType.RED;
    icon = (
      <Icon
        icon="fluent:flag-16-filled"
        width={16}
        height={16}
        style={iconStyle}
      />
    );
  } else {
    tagType = TagType.GREY;
    icon = null;
  }

  return (
    <PosActiveStatusContainer>
      <Tag type={tagType}>
        {icon}
        {label}
      </Tag>
    </PosActiveStatusContainer>
  );
};

export default PosActiveStatus;
