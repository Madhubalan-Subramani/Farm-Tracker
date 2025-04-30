import React from "react";

const PaginationButtons = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="pagination-buttons">
      <button
        className="pagination-btn appBgColor"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>{`${currentPage} of ${totalPages}`}</span>
      <button
        className="pagination-btn appBgColor"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationButtons;
