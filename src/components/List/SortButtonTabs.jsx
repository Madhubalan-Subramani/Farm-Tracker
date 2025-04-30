import React from "react";

const SortButtonsTabs = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="sort-buttons">
      <button
        className={`sort-btn ${sortOrder === "ascending" ? "active appBgColor" : ""}`}
        onClick={() => setSortOrder("ascending")}
      >
        Ascending
      </button>
      <button
        className={`sort-btn ${sortOrder === "descending" ? "active appBgColor" : ""}`}
        onClick={() => setSortOrder("descending")}
      >
        Descending
      </button>
    </div>
  );
};

export default SortButtonsTabs;
