"use client";
import { useMemo } from "react";
import styles from "./Paginator.module.scss";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Paginator({ currentPage, totalPages, onPageChange }: Props) {
  const paginationRange = useMemo(() => {
    if (!totalPages) return [];
    return generatePagination(currentPage, totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={styles.pageButton}
      >
        Prev
      </button>

      {paginationRange.map((p, index) =>
        p === "..." ? (
          <span key={index} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(p as number)}
            className={`${styles.pageButton} ${currentPage === p ? styles.activePage : ""}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={styles.pageButton}
      >
        Next
      </button>
    </div>
  );
}

export function generatePagination(currentPage: number, totalPages: number): (number | string)[] {
  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, idx) => start + idx);

  const delta = 4;
  const pages: (number | string)[] = [];

  if (totalPages <= 10) {
    return range(1, totalPages);
  }

  pages.push(1);

  if (currentPage > delta + 2) {
    pages.push("...");
  }

  const startPage = Math.max(2, currentPage - delta);
  const endPage = Math.min(totalPages - 1, currentPage + delta);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (currentPage + delta < totalPages - 1) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}
