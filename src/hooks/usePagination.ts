import { useState } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  from: number;
  to: number;
}

export const usePagination = ({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const from = (currentPage - 1) * itemsPerPage;
  const to = Math.min(from + itemsPerPage - 1, totalItems - 1);

  return {
    currentPage,
    totalPages,
    pageSize: itemsPerPage,
    setCurrentPage,
    from,
    to,
  };
};