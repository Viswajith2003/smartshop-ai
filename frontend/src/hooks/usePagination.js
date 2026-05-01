import { useState } from 'react';

const usePagination = (initialLimit = 10) => {
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    limit: initialLimit,
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && (pagination.totalPages === 0 || newPage <= pagination.totalPages)) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const updatePagination = (meta) => {
    if (meta) {
      const total = meta.totalItems || meta.totalProducts || meta.totalUsers || meta.totalOrders || meta.totalCategories || meta.totalCoupons || meta.total || 0;
      setPagination((prev) => ({
        ...prev,
        totalPages: meta.totalPages || 1,
        totalItems: total,
        page: meta.currentPage || prev.page,
      }));
    }
  };

  const resetPage = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return {
    pagination,
    handlePageChange,
    updatePagination,
    resetPage,
  };
};

export default usePagination;
