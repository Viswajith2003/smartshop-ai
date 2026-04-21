import { useState } from 'react';

const usePagination = (initialLimit = 10) => {
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: initialLimit,
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const updatePagination = (meta) => {
    if (meta) {
      setPagination((prev) => ({
        ...prev,
        totalPages: meta.totalPages,
        totalProducts: meta.totalProducts,
        page: meta.currentPage || prev.page, // optionally sync page if needed
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
