"use client";

import { EmptyState, Flex, Loading, Table, Tag, TagType } from "@kairo/ui";
import styled from "styled-components";
import { DATE_FORMAT, formatDate } from "@kairo/lib/utils";
import { UsersTableFilters } from "./UsersTableFilters";
import { Icon } from "@iconify/react";

export const UsersTableContainer = styled.div`
  margin-top: 1rem;
`;

export type UserRow = {
  id: string;
  user: string;
  status: string;
  dateAdded: Date | string;
};

export type UsersTableProps = {
  users: UserRow[];
  loading?: boolean;
  onRefresh?: () => void;
  page?: number;
  limit?: number;
  totalCount?: number;
};

const USER_STATUS_TAG: Record<string, (typeof TagType)[keyof typeof TagType]> = {
  active: TagType.GREEN,
  inactive: TagType.RED,
  pending: TagType.PURPLE_COOL,
  suspended: TagType.RED,
};

const humanize = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const UsersTable = ({
  users,
  loading = false,
  page,
  limit,
  totalCount,
}: UsersTableProps) => {
  const headers = [
    {
      title: "User",
      render: (row: UserRow) => row.user ?? "N/A",
    },
    {
      title: "Status",
      render: (row: UserRow) => {
        const statusKey = String(row.status || "").toLowerCase();
        return (
          <Tag type={USER_STATUS_TAG[statusKey] || TagType.GREY}>
            {humanize(String(row.status || "N/A"))}
          </Tag>
        );
      },
    },
    {
      title: "Date added",
      render: (row: UserRow) =>
        String(formatDate(row.dateAdded, DATE_FORMAT) ?? "N/A"),
    },
  ];

  return (
    <UsersTableContainer>
      {loading ? (
        <Flex justify="center" align="center" style={{ height: "10rem" }}>
          <Loading>Fetching users...</Loading>
        </Flex>
      ) : users.length > 0 ? (
        <Flex direction="column" gap="1rem">
          <UsersTableFilters />
          <Table
            headers={headers}
            rows={users}
            pageNumber={page}
            limitNumber={limit}
            totalCount={totalCount}
            onRowClick={() => { }}
          />
        </Flex>
      ) : (
        <EmptyState
          title="No users onboarded yet."
          message="Onboarded users will be displayed here."
          icon={<Icon icon="majesticons:users-line" width={48} height={48} />}
        />
      )}
    </UsersTableContainer>
  );
};

export default UsersTable;
