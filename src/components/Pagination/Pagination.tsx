import React from "react";
import * as ReactPaginateModule from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (event: { selected: number }) => {
    onPageChange(event.selected + 1);
  };

  const ReactPaginate =
    (ReactPaginateModule as any).default?.default ||
    (ReactPaginateModule as any).default ||
    ReactPaginateModule;

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="Вперед ▶"
      previousLabel="◀ Назад"
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={totalPages}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      pageClassName=""
      pageLinkClassName=""
      previousClassName=""
      previousLinkClassName=""
      nextClassName=""
      nextLinkClassName=""
      breakClassName=""
      breakLinkClassName=""
      activeClassName={css.active}
      disabledClassName={css.disabled}
    />
  );
};
