"use client";

import { ReactNode, ReactElement, useEffect } from "react";
import { CheckboxInput } from "./inputs/CheckboxInput";
import styled from "styled-components";
import clsx from "clsx";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePagination } from "@kairo/hooks";
import { Pagination } from "./Pagination";

const TableOverviewContainer = styled.div`
  th.checkbox-col,
  td.checkbox-col {
    max-width: 3rem;
    width: 3rem;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    text-align: center;
  }

  th:not(.checkbox-col),
  td:not(.checkbox-col) {
    max-width: 20rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  overflow-x: auto;
  margin: 20px 0;
  border-radius: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.gray_03};

  table {
    width: 100%;
    text-align: left;
    font-size: 15px;
    border-collapse: collapse;

    .align--right {
      text-align: right;
    }
    .align--center {
      text-align: center;
    }

    thead {
      tr {
        background-color: ${(props) => props.theme.colors.gray_02};

        th {
          font-weight: bold;
          line-height: 3rem;
          color: ${(props) => props.theme.colors.text_01};
          border-bottom: 1px solid ${(props) => props.theme.colors.gray_03};
          padding: 5px 10px;
          white-space: nowrap;

          &:first-child {
            padding-left: 30px;
          }

          &:last-child {
            padding-right: 30px;
          }
        }
      }
    }

    tbody {
      color: ${(props) => props.theme.colors.text_01};

      tr.clickable {
        cursor: pointer;
        &:hover {
          background-color: ${(props) => props.theme.colors.tableRowHover};
        }
      }

      tr:nth-child(even) {
        background-color: ${(props) => props.theme.colors.ui_07};
      }

      td {
        border-bottom: 1px solid ${(props) => props.theme.colors.gray_03};
        padding: 10px;
        white-space: nowrap;

        &:first-child {
          padding-left: 30px;
        }

        &:last-child {
          padding-right: 30px;
        }
      }

      td.status {
        display: flex;
        align-items: center;
      }

      tr:last-child {
        td {
          border-bottom: none;
        }
      }
    }
  }

  .modal-heading {
    display: flex;
    justify-content: space-between;

    h2 {
      font-size: 24px;
      line-height: 24px;
      letter-spacing: 0.25px;
      color: ${(props) => props.theme.colors.primaryColor};
    }

    button {
      border: none;
      background-color: ${(props) => props.theme.colors.transparent};
      outline: none;
    }
  }

  /* media-queries */
  @media (max-width: ${(props) => props.theme.breakpoint.sm}) {
    table tbody td:last-child {
      padding-right: 15px;
    }

    table thead tr th:first-child,
    table tbody td:first-child {
      padding-left: 15px;
    }
  }

  .TablePaginationContainer {
    padding: 1rem 2rem;
    border-top: 1px solid ${(props) => props.theme.colors.gray_03};
  }
`;

export interface TableHeader<T> {
  title: ReactNode;
  headerClassName?: string;
  headerStyle?: React.CSSProperties;
  className?: string;
  align?: "left" | "right" | "center" | string;
  style?: React.CSSProperties;
  render: (row: T) => ReactNode;
}

export interface TableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  headers: TableHeader<T>[];
  rows: T[];
  showHead?: boolean;
  onRowClick?: (args: { row: T; index: number }) => void;
  showCheckbox?: boolean;
  onCheckBoxSelect?: (selected: T[]) => void;
  showPagination?: boolean;
  limitNumber?: number;
  setLimitNumber?: (limit: number) => void;
  totalCount?: number;
  setPageNumber?: (page: number) => void;
  pageNumber?: number;
}

export function Table<T>({
  headers,
  rows,
  showHead = true,
  onRowClick,
  showCheckbox = false,
  onCheckBoxSelect,
  showPagination = true,
  limitNumber,
  setLimitNumber,
  totalCount,
  setPageNumber,
  pageNumber,
  ...rest
}: TableProps<T>): ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const isRowSelected = (row: T) => selectedRows.includes(row);
  const allSelected = selectedRows.length === rows.length && rows.length > 0;

  const handleCheckboxChange = (row: T) => {
    setSelectedRows((prev) => {
      const updated = prev.includes(row)
        ? prev.filter((r) => r !== row)
        : [...prev, row];
      onCheckBoxSelect?.(updated);
      return updated;
    });
  };

  const handleSelectAll = () => {
    const updated = allSelected ? [] : [...rows];
    setSelectedRows(updated);
    onCheckBoxSelect?.(updated);
  };

  const initialPage = Number(searchParams.get("page")) || pageNumber || 1;
  const initialLimit = Number(searchParams.get("limit")) || limitNumber || 10;
  const total = Number(searchParams.get("count")) || totalCount || rows.length;

  const { page, limit, setLimit, setPage, total: paginationTotal } = usePagination({
    page: initialPage,
    limit: initialLimit,
    total,
  });

  // Use parent handlers if provided
  const handleSetPage = setPageNumber ? setPageNumber : setPage;
  const handleSetLimit = setLimitNumber ? setLimitNumber : setLimit;

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (page && page !== 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    if (limit && limit !== 10) {
      params.set("limit", String(limit));
    } else {
      params.delete("limit");
    }
    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();
    if (nextQuery !== currentQuery) {
      router.replace(`?${nextQuery}`);
    }
  }, [page, limit, totalCount, searchParams]);

  useEffect(() => {
    setPageNumber?.(page);
    setLimitNumber?.(limit);
  }, [page, limit, setPageNumber, setLimitNumber]);

  function truncateWord(str: string, maxLength = 20) {
    if (typeof str !== "string") return str;
    if (str.length > maxLength && !str.includes(" ")) {
      return (
        <span title={str} style={{ cursor: "pointer" }}>
          {str.slice(0, maxLength) + "..."}
        </span>
      );
    }
    return str;
  }
  return (
    <TableOverviewContainer {...rest}>
      <table>
        {showHead && (
          <thead>
            <tr>
              {showCheckbox && (
                <th className="checkbox-col">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <CheckboxInput
                      options={[{ value: "selectAll", label: "" }]}
                      value={allSelected ? ["selectAll"] : []}
                      onChange={handleSelectAll}
                      direction="row"
                    />
                  </span>
                </th>
              )}
              {headers.map((header, idx) => {
                return (
                  <th
                    key={"header-" + idx}
                    className={clsx(header.headerClassName, {
                      "align--right": header.align === "right",
                      "align--center": header.align === "center",
                    })}
                    style={header.headerStyle}
                  >
                    {header.title}
                  </th>
                );
              })}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              onClick={
                typeof onRowClick === "function"
                  ? () => onRowClick({ row, index })
                  : undefined
              }
              className={clsx({ clickable: !!onRowClick })}
            >
              {showCheckbox && (
                <td
                  className="checkbox-col"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <CheckboxInput
                    options={[{ value: "row", label: "" }]}
                    value={isRowSelected(row) ? ["row"] : []}
                    onChange={() => handleCheckboxChange(row)}
                    direction="row"
                  />
                </td>
              )}
              {headers.map((header, idx) => {
                return (
                  <td
                    key={"body-" + idx}
                    className={clsx(header.className, {
                      "align--right": header.align === "right",
                      "align--center": header.align === "center",
                    })}
                    style={header.style}
                  >
                    {header.render(row)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {showPagination && (
        <div className="TablePaginationContainer">
          <Pagination
            page={page}
            limit={limit}
            total={paginationTotal}
            setPage={handleSetPage}
            setLimit={handleSetLimit}
          />
        </div>
      )}
    </TableOverviewContainer>
  );
}

export default Table;
