"use client";

import React, { useMemo } from "react";
import styled from "styled-components";
import clsx from "clsx";
import caretDownIcon from "./icons/caret-down.svg";
import Button, { ButtonClass } from "../Button";
import { Icon } from "@iconify/react";

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.text_06};
  font-size: 14px;
  line-height: 20px;
  flex-wrap: wrap;
  gap: 20px;

  .limit-changer {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    & > :last-child {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      width: 100%;
      justify-content: center;
    }
  }

  select {
    appearance: none;
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.inputBorder};
    border-radius: 4px;
    color: ${(props) => props.theme.colors.text_02};
    background-color: ${(props) => props.theme.colors.ui_07};
    background-image: url("${caretDownIcon}");
    background-repeat: no-repeat;
    background-position: calc(100% - 10px) center;
    background-size: 10px;
    border-radius: 4rem;
    padding: 4px 10px;
    line-height: 20px;
    letter-spacing: 0.25px;
    text-align: center;
    cursor: pointer;
    /* transition: 0.5s; */

    &:focus {
      border-color: ${(props) => props.theme.colors.primaryColor};
    }
  }

  .pagination {
    display: flex;
    gap: 5px;
    align-items: center;

    .current_page_number {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      height: 2rem;
      padding: 2px 4px;
      background-color: ${(props) => props.theme.colors.transparent};
      color: ${(props) => props.theme.colors.text_02};
      border-radius: 4rem;
      border: none;
      outline: none;
      cursor: pointer;

      &[disabled] {
        opacity: 0.4;
      }
    }

    .page-numbers {
      list-style-type: none;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      padding: 0;
      margin: 0;

      .page-numbers__link--active {
        background-color: ${(props) => props.theme.colors.gray_01};
        color: ${(props) => props.theme.colors.text_02};
      }
    }

    .NextPrev_btn {
      padding: 4px 1rem !important;
      height: 2rem !important;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: ${(props) => props.theme.breakpoint.md}) {
      width: 100%;
      justify-content: space-between;
      gap: 10px;
    }
    @media (max-width: ${(props) => props.theme.breakpoint.sm}) {
      .page-numbers {
        display: flex;
        justify-content: center;
      }

      .page-numbers .ellipsis {
        display: none;
      }

      .page-numbers li > .current_page_number {
        display: none;
      }
      .page-numbers li > .current_page_number.page-numbers__link--active {
        display: flex;
      }
    }
  }
`;

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  page: number;
  setPage?: (page: number) => void;
  limit: number;
  setLimit?: (limit: number) => void;
  total: number;
  isLoading?: boolean;
  showPageNumbers?: boolean;
  showLimitChanger?: boolean;
  disableLimitChanger?: boolean;
  limitOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const defaultLimitOptions = [10, 15, 20, 25, 30, 40, 50, 100];
  let {
    page,
    setPage = (p: number) => p,
    limit,
    setLimit = (l: number) => l,
    total,
    isLoading = false,
    showPageNumbers = true,
    showLimitChanger = true,
    disableLimitChanger = false,
    limitOptions = defaultLimitOptions,
    ...rest
  } = props as PaginationProps;

  // If total is less than limit, set limit to total
  if (total < limit) {
    limit = total;
    setLimit(total);
  }

  if (!limitOptions.includes(limit)) {
    limitOptions.push(limit);
    limitOptions.sort((a, b) => a - b);
  }

  const totalPages = useMemo(() => {
    if (limit && total) return Math.ceil(total / limit);
    return 1;
  }, [limit, total]);

  const disablePrevPage = page <= 1;
  const disableNextPage = page === totalPages;
  const gotoPrevPage = () => {
    if (disablePrevPage || isLoading) return;
    setPage(page - 1);
  };
  const gotoNextPage = () => {
    if (disableNextPage || isLoading) return;
    setPage(page + 1);
  };

  // Logic to truncate pages and add ellipsis
  const getTruncatedPageNumbers = (
    currentPage: number,
    totalPages: number,
  ): Array<number | string> => {
    if (totalPages <= 5) {
      const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    let startPage, endPage;
    if (totalPages <= 3) {
      // less than 3 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 3 total pages so calculate start and end pages
      if (currentPage <= 2) {
        startPage = 1;
        endPage = 3;
      } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }

    let pages: Array<number | string> = [
      ...Array(endPage + 1 - startPage).keys(),
    ].map((i) => startPage + i);
    if (startPage > 1) {
      pages = [1, "...", ...pages];
    }
    if (endPage < totalPages) {
      pages = [...pages, "...", totalPages];
    }

    return pages;
  };

  const pageNumbers = useMemo<Array<number | string>>(() => {
    return getTruncatedPageNumbers(page, totalPages);
  }, [page, totalPages]);

  return (
    <PaginationContainer {...rest}>
      {showLimitChanger && (
        <div className="limit-changer">
          <select
            value={limit}
            onChange={(e) => {
              const { value } = e.target;
              setLimit(Number(value));
            }}
            disabled={disableLimitChanger}
            aria-label="Results per page"
          >
            {(() => {
              let filtered =
                total < limit
                  ? limitOptions.filter((option) => option <= total)
                  : limitOptions;
              if (!filtered.includes(limit)) {
                filtered = [...filtered, limit].sort((a, b) => a - b);
              }
              return filtered.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ));
            })()}
          </select>
          <span>
            <span>of</span>
            <span>{total}</span>
            <span>Results</span>
          </span>
        </div>
      )}

      <div className="pagination">
        <div>
          <Button
            classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
            type="button"
            aria-label="previous page"
            className="NextPrev_btn"
            disabled={disablePrevPage}
            onClick={gotoPrevPage}
          >
            <Icon icon="ic:round-chevron-left" width={24} height={24} />
            Previous
          </Button>
        </div>

        {showPageNumbers && pageNumbers.length > 0 && (
          <ul className="page-numbers">
            {pageNumbers.map((number, index) => {
              if (number === "...") {
                return (
                  <li key={`ellipsis-${index}`} className="ellipsis">
                    <span>...</span>
                  </li>
                );
              }
              const num = number as number;
              return (
                <li key={num}>
                  <button
                    type="button"
                    onClick={() => setPage(num)}
                    className={`current_page_number ${clsx({
                      "page-numbers__link--active": page === num,
                    })}`}
                  >
                    {num}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div>
          <Button
            type="button"
            aria-label="next page"
            classes={[ButtonClass.OUTLINED, ButtonClass.WITH_ICON]}
            className="NextPrev_btn"
            disabled={disableNextPage}
            onClick={gotoNextPage}
          >
            Next
            <Icon icon="ic:round-chevron-right" width={24} height={24} />
          </Button>
        </div>
      </div>
    </PaginationContainer>
  );
};
