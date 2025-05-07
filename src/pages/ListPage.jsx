// ✅ Importing dependencies and components
import React, { useState } from "react"; // Step 1: React and useState for local state management
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Step 2: Chevron icons for date navigation
import useUserData from "../hooks/useUserData"; // Step 3: Custom hook to fetch user-specific data from Firebase
import DateTabs from "../components/List/DateTabs"; // Step 4: Tabs for filtering by day, week, month
import SortButtonsTabs from "../components/List/SortButtonTabs"; // Step 5: Tabs to switch between ascending/descending sort order
import DataTable from "../components/List/DataTable"; // Step 6: Component to show the records list
import SummaryTable from "../components/List/SummaryTable"; // Step 7: Component to show total/paid/balance summary
import PaginationButtons from "../components/List/PaginationButtons"; // Step 8: Pagination control component
import { filterDataByDateTab } from "../utils/dateTab"; // Step 9: Utility to filter data based on selected date range
import { summaryCalculation } from "../utils/summaryCalculation"; // Step 10: Utility to calculate total, paid, and balance amounts
import { deleteDoc, doc } from "firebase/firestore"; // Step 11: Firestore functions to delete documents
import { getAuth } from "firebase/auth"; // Step 12: To access current user ID from Firebase Auth
import { db } from "../firebase/setup"; // Step 13: Firebase database reference
import "./ListPage.css"; // Step 14: Import styling for this page

// ✅ Component for date navigation using offset buttons
const DateNavigator = ({ dateOffset, setDateOffset }) => {
  return (
    <div className="date-navigator">
      <button
        className="date-nav-button"
        onClick={() => setDateOffset(dateOffset + 1)} // Previous day/week/month
      >
        <FaChevronLeft />
      </button>
      <button
        className="date-nav-button"
        onClick={() => setDateOffset(dateOffset - 1)} // Next day/week/month
        disabled={dateOffset === 0} // Disable when at current date
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

// ✅ Main ListPage component
const ListPage = () => {
  const { data, loading } = useUserData(); // Step 15: Fetch data from Firebase for logged-in user
  const [dateTab, setDateTab] = useState("day"); // Step 16: Track which tab is selected (day/week/month)
  const [sortOrder, setSortOrder] = useState("ascending"); // Step 17: Track sorting order
  const [dateOffset, setDateOffset] = useState(0); // Step 18: Used to navigate dates forward/backward
  const [currentPage, setCurrentPage] = useState(1); // Step 19: Track current pagination page
  const recordsPerPage = 8; // Step 20: Set how many records to show per page

  if (loading) return <div>Loading...</div>; // Step 21: Show loading while fetching data

  // ✅ Handler for changing the date tab (day/week/month)
  const handleDateTabChange = (newTab) => {
    setDateTab(newTab);
    setDateOffset(0); // Reset offset when tab changes
    setCurrentPage(1); // Reset pagination
  };

  // ✅ Step 22: Filter data based on selected date tab and offset
  const dateWiseFilteredData = filterDataByDateTab(data, dateTab, dateOffset);

  // ✅ Step 23: Sort the filtered data by date/time
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

  // ✅ Step 24: Calculate summary (total, paid, balance)
  const { totalAmount, paidAmount, balanceAmount } =
    summaryCalculation(sortedData);

  // ✅ Step 25: Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(sortedData.length / recordsPerPage);

  // ✅ Step 26: Delete a single record from Firebase
  const handleDeleteRecord = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this record?"
      );
      if (confirmDelete) {
        const auth = getAuth();
        const docRef = doc(db, "users", auth.currentUser.uid, "userData", id);
        await deleteDoc(docRef);
      } else return;
    } catch (err) {
      // console.error("Error deleting record:", err);
    }
  };

  // ✅ Step 27: Handle date offset change
  const handleDateOffsetChange = (newOffset) => {
    setDateOffset(newOffset);
    setCurrentPage(1); // Reset to first page on date change
  };

  // ✅ Step 28: Final return – Render UI components
  return (
    <div className="listpage-container">
      <div className="tabs-container">
        <SortButtonsTabs sortOrder={sortOrder} setSortOrder={setSortOrder} />
        <h2>List of Records</h2>

        <div className="date-navigator-row">
          <DateNavigator
            dateOffset={dateOffset}
            setDateOffset={handleDateOffsetChange}
          />
          <DateTabs dateTab={dateTab} setDateTab={handleDateTabChange} />
        </div>
      </div>

      <DataTable
        data={currentRecords}
        indexOfFirstRecord={indexOfFirstRecord}
        onDelete={handleDeleteRecord}
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
