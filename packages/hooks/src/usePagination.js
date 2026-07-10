import { useEffect, useState } from "react";

export const usePagination = (initialState) => {
  const {
    page: initialPage = 1,
    limit: initialLimit = 10,
    total = 10,
  } = initialState || {};

  const [page, setPage] = useState(parseInt(initialPage));
  const [limit, setLimit] = useState(parseInt(initialLimit));

  useEffect(() => {
    setPage(parseInt(initialPage) || 1);
  }, [initialPage]);

  useEffect(() => {
    setLimit(parseInt(initialLimit) || 10);
  }, [initialLimit]);

  return {
    page,
    setPage: (nextPage) => {
      nextPage > 1 ? setPage(nextPage) : setPage(1);
    },
    limit,
    setLimit: (nextLimit) => {
      nextLimit > 1 ? setLimit(nextLimit) : setLimit(10);
      setPage(1);
    },
    total,
  };
};

export default usePagination;
