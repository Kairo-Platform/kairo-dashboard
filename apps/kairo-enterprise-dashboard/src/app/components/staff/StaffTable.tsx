"use client";

import styled from "styled-components";
import {
  ActionMenu,
  Button,
  ButtonClass,
  CopyText,
  EmptyState,
  Flex,
  Loading,
  Table,
  Tag,
  TagType,
} from "@/app/components/ui";
import { StaffTableFilters } from "./StaffTableFilters";
import { DATE_FORMAT, formatDate } from "@kairo/lib/utils";
import { Icon } from "@iconify/react";
import { useModal } from "@kairo/hooks";
import { InviteStaffModal } from "./InviteStaffModal";

export type StaffMember = {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  role?: string | { name?: string };
  status: string;
  dateAdded?: Date | string;
  createdAt?: Date | string;
};

export interface StaffTableProps {
  staffList?: StaffMember[];
  loading?: boolean;
  totalCount?: number;
  pageNumber?: number;
  limit?: number;
  onRowClick?: (id: string) => void;
  onInvite?: (payload: {
    email: string;
    roleId: string;
    inviteDuration: number | null;
  }) => void;
  onResendInvite?: (staff: StaffMember) => void;
}

const StaffTableContainer = styled.div`
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 500px) {
    .TableHeader {
      flex-direction: column !important;
      gap: 1rem !important;
    }
  }

  .ActionButton__edit {
    border: 1px solid transparent;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    transition: all 0.3s ease-out;
    background: transparent;

    &:hover {
      border-color: ${(props) => props.theme.colors.primaryColor};
    }
  }
`;

const STAFF_STATUS_TAG: Record<
  string,
  (typeof TagType)[keyof typeof TagType]
> = {
  active: TagType.GREEN,
  invited: TagType.BLUE,
  pending: TagType.PURPLE_COOL,
  inactive: TagType.GREY,
  suspended: TagType.RED,
};

const humanize = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const StaffTable = ({
  staffList = [],
  loading = false,
  totalCount,
  pageNumber,
  limit,
  onRowClick,
  onInvite,
  onResendInvite,
}: StaffTableProps) => {
  const { showModal: showInviteModal, toggleModal: toggleInviteModal } =
    useModal(false);

  const mappedRows = staffList.map((item) => {
    const fullName =
      item.fullName ||
      `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
      "n/a";
    const roleName =
      typeof item.role === "string" ? item.role : item.role?.name || "n/a";

    return {
      id: item.id,
      fullName,
      email: item.email || "n/a",
      role: roleName,
      status: item.status || "UNKNOWN",
      dateAdded: item.dateAdded || item.createdAt || "",
      raw: item,
    };
  });

  const headers = [
    {
      title: "Full name",
      render: (row: (typeof mappedRows)[number]) => row.fullName,
    },
    {
      title: "Email address",
      render: (row: (typeof mappedRows)[number]) => (
        <CopyText text={row.email}>{row.email}</CopyText>
      ),
    },
    {
      title: "Role",
      render: (row: (typeof mappedRows)[number]) => row.role,
    },
    {
      title: "Status",
      render: (row: (typeof mappedRows)[number]) => {
        const statusKey = String(row.status || "").toLowerCase();
        return (
          <Tag type={STAFF_STATUS_TAG[statusKey] || TagType.GREY}>
            {humanize(String(row.status || "N/A"))}
          </Tag>
        );
      },
    },
    {
      title: "Date added",
      render: (row: (typeof mappedRows)[number]) =>
        String(formatDate(row.dateAdded, DATE_FORMAT) ?? "N/A"),
    },
    {
      title: "",
      align: "right" as const,
      render: (row: (typeof mappedRows)[number]) => (
        <Flex gap="1rem" align="center" justify="flex-end">
          <ActionMenu
            actions={[
              ...(onResendInvite && statusKeyIsInvited(row.status)
                ? [
                  {
                    title: "Resend invite",
                    onClick: () => onResendInvite(row.raw),
                  },
                ]
                : []),
            ]}
            positions={["bottom", "top"]}
          >
            <button
              type="button"
              className="ActionButton__edit"
              aria-label="View actions"
            >
              <Icon icon="mdi:dots-vertical" width={20} height={20} />
            </button>
          </ActionMenu>
        </Flex>
      ),
    },
  ];

  return (
    <StaffTableContainer>
      {loading ? (
        <Flex justify="center" align="center" style={{ height: "10rem" }}>
          <Loading>Loading staff...</Loading>
        </Flex>
      ) : mappedRows.length > 0 ? (
        <>
          <Flex justify="space-between" align="center" className="TableHeader">
            <StaffTableFilters />

            <Flex gap="1rem" align="center">
              <div>
                <Button
                  classes={[ButtonClass.SOLID, ButtonClass.WITH_ICON]}
                  onClick={() => toggleInviteModal()}
                >
                  <Icon icon="mdi:plus" width={20} height={20} />
                  Invite staff
                </Button>
              </div>
            </Flex>
          </Flex>

          <Table
            rows={mappedRows}
            headers={headers}
            totalCount={totalCount}
            pageNumber={pageNumber}
            limitNumber={limit}
            onRowClick={({ row }) => onRowClick?.(row.id)}
          />
        </>
      ) : (
        <EmptyState
          title="No staff added yet"
          message="Staff added to your portal will be listed here"
          icon={
            <Icon icon="majesticons:users-line" width={48} height={48} />
          }
        >
          <Button
            classes={[ButtonClass.WITH_ICON, ButtonClass.OUTLINED]}
            onClick={() => toggleInviteModal()}
          >
            <Icon icon="ri:add-line" width={24} height={24} />
            <span>Invite staff</span>
          </Button>
        </EmptyState>
      )}

      {showInviteModal && (
        <InviteStaffModal
          onClose={toggleInviteModal}
          onInvite={onInvite}
        />
      )}
    </StaffTableContainer>
  );
};

const statusKeyIsInvited = (status: string) =>
  String(status || "").toUpperCase() === "INVITED";

export default StaffTable;
