export type ApiLike<T> = {
  errCode?: unknown;
  statusCode?: number;
  body?: { data?: T };
  data?: T;
};
