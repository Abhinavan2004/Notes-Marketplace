export interface PaginationParams {
  page?: number;
  limit?: number;
}

export const getPagination = ({ page = 1, limit = 12 }: PaginationParams) => {
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safeLimit = Number.isNaN(limit) || limit < 1 || limit > 100 ? 12 : limit;
  const skip = (safePage - 1) * safeLimit;
  return { page: safePage, limit: safeLimit, skip };
};

