import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useUserData from "../hooks/useUserData";
import DateTabs from "../components/List/DateTabs";
import SortButtonsTabs from "../components/List/SortButtonTabs";
import DataTable from "../components/List/DataTable";
import SummaryTable from "../components/List/SummaryTable";
import PaginationButtons from "../components/List/PaginationButtons";
import { filterDataByDateTab } from "../utils/dateTab";
import { summaryCalculation } from "../utils/summaryCalculation";
import "./ListPage.css";

// Date Navigator Component
const DateNavigator = ({ dateOffset, setDateOffset }) => {
  return (
    <div className="date-navigator">
      <button
        className="nav-button"
        onClick={() => setDateOffset(dateOffset + 1)}
      >
        <FaChevronLeft />
      </button>
      <button
        className="nav-button"
        onClick={() => setDateOffset(dateOffset - 1)}
        disabled={dateOffset === 0}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

// Main ListPage Component
const ListPage = () => {
  const { data, loading } = useUserData();
  const [dateTab, setDateTab] = useState("day");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [dateOffset, setDateOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  if (loading) return <div>Loading...</div>;

  const handleDateTabChange = (newTab) => {
    setDateTab(newTab);
    setDateOffset(0);
    setCurrentPage(1);
  };

  const dateWiseFilteredData = filterDataByDateTab(data, dateTab, dateOffset);
  const sortedData = dateWiseFilteredData.sort((a, b) => {
    const dateA = a.date;
    const dateB = b.date;
    const timeA = a.posting_time.toDate();
    const timeB = b.posting_time.toDate();

    if (dateTab === "day") {
      return sortOrder === "ascending" ? timeA - timeB : timeB - timeA;
    } else {
      if (dateA === dateB) {
        return sortOrder === "ascending" ? timeA - timeB : timeB - timeA;
      } else {
        return sortOrder === "ascending"
          ? new Date(dateA) - new Date(dateB)
          : new Date(dateB) - new Date(dateA);
      }
    }
  });

  const { totalAmount, paidAmount, balanceAmount } =
    summaryCalculation(sortedData);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);
  
    const totalPages = Math.ceil(sortedData.length / recordsPerPage); 

  return (
    <div className="listpage-container">
      <div className="tabs-container">
        <SortButtonsTabs sortOrder={sortOrder} setSortOrder={setSortOrder} />
        <h2>List of Records</h2>

        <div className="date-navigator-row">
          <DateNavigator
            dateOffset={dateOffset}
            setDateOffset={setDateOffset}
          />
          <DateTabs dateTab={dateTab} setDateTab={handleDateTabChange} />
        </div>
      </div>
      <DataTable
        data={currentRecords}
        indexOfFirstRecord={indexOfFirstRecord}
      />
      <PaginationButtons
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
      <SummaryTable
        totalAmount={totalAmount}
        paidAmount={paidAmount}
        balanceAmount={balanceAmount}
      />
    </div>
  );
};

export default ListPage;
