import React from 'react';
import { useDataTableContext } from './DataTableContext';

const PaginationComponent = () => {
  const { currentPage, pageCount, setCurrentPage } = useDataTableContext();

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const firstPages = 3;
    const lastPages = pageCount - 3;
    const hasEllipsisStart = currentPage > firstPages;
    const hasEllipsisEnd = currentPage < lastPages;

    for (let i = 0; i < pageCount; i++) {
      if (
        i < firstPages ||
        i >= lastPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <li className={`page-item ${currentPage === i ? "active" : ""}`} key={i}>
            <button className="page-link" onClick={() => handlePageChange(i)} disabled={currentPage === i}>
              {i + 1}
            </button>
          </li>
        );
      } else if (i === firstPages && hasEllipsisStart) {
        pages.push(
          <li className="page-item" key="ellipsis-start">
            <span className="page-link">...</span>
          </li>
        );
      } else if (i === lastPages - 1 && hasEllipsisEnd) {
        pages.push(
          <li className="page-item" key="ellipsis-end">
            <span className="page-link">...</span>
          </li>
        );
      }
    }
    return pages;
  };

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item`}>
          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
            {"« Previous"}
          </button>
        </li>
        {renderPageNumbers()}
        <li className={`page-item`}>
          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pageCount - 1}>
            {"Next »"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationComponent;
