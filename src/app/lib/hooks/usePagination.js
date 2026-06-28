import { useEffect, useState } from "react";
import { Pagination } from "@/app/components/ui";

export const usePagination = (initialState) => {
  const {
    page: initialPage = 1,
    limit: initialLimit = 10,
    total = 10,
  } = initialState || {};

  const [page, setPage] = useState(parseInt(initialPage));
  const [limit, setLimit] = useState(parseInt(initialLimit));

  // Make the hook reactive to initialPage and initialLimit changes
  useEffect(() => {
    setPage(parseInt(initialPage) || 1);
  }, [initialPage]);

  useEffect(() => {
    setLimit(parseInt(initialLimit) || 10);
  }, [initialLimit]);

  const paginationProps = {
    page,
    setPage: (page) => {
      page > 1 ? setPage(page) : setPage(1);
    },
    limit,
    setLimit: (limit) => {
      limit > 1 ? setLimit(limit) : setLimit(10);
      setPage(1);
    },
    total,
  };

  return {
    ...paginationProps,
    Pagination: (props) => Pagination({ ...paginationProps, ...props }),
  };
};

export default usePagination;
