
export type PaginationParams = {
  page: number;
  size: number;
};

export type PaginationResult = {
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

export function paginate(
  total: number,
  requestedPage: number,
  size: number,
): PaginationResult {
  const safeSize = [10, 20, 50].includes(size) ? size : 10;
  const totalPages = Math.ceil(total / safeSize);

  const page = Math.min(
    Math.max(1, Math.floor(requestedPage) || 1),
    Math.max(1, totalPages),
  );

  return {
    page,
    size: safeSize,
    total,
    totalPages,
  };
}
