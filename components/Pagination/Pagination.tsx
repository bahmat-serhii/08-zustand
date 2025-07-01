import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  /** Total number of pages */
  pageCount: number;
  /** Current page number (1-based) */
  currentPage: number;
  /**
   * Callback triggered when page changes.
   * Provides the selected page number (1-based).
   */
  onPageChange: (selectedPage: number) => void;

  /** Label for the "next" button */
  nextLabel?: React.ReactNode;
  /** Label for the "previous" button */
  previousLabel?: React.ReactNode;
  /** Label for the break indicator (e.g. '...') */
  breakLabel?: React.ReactNode;
  /** Number of pages to display in the pagination control */
  pageRangeDisplayed?: number;

  /** Additional props passed down to ReactPaginate */
  [key: string]: unknown;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
  nextLabel = "→",
  previousLabel = "←",
  breakLabel = "...",
  pageRangeDisplayed = 3,
  ...restProps
}) => {
  /**
   * ReactPaginate uses zero-based page indexes,
   * but our component API uses 1-based page numbers.
   * Convert zero-based index to 1-based page number on change.
   */
  const handlePageChange = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1);
  };

  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      breakLabel={breakLabel}
      nextLabel={nextLabel}
      onPageChange={handlePageChange}
      pageRangeDisplayed={pageRangeDisplayed}
      pageCount={pageCount}
      previousLabel={previousLabel}
      forcePage={currentPage - 1} // Convert 1-based page to zero-based for ReactPaginate
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      {...restProps}
    />
  );
};

export default Pagination;
