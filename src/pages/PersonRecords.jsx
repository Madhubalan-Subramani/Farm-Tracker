import React, { useState, useMemo, useEffect } from "react";
import "./PersonRecords.css";
import SearchBar from "../components/PersonRecords/SearchBar";
import useUserData from "../hooks/useUserData";
import PersonSummary from "../components/PersonRecords/PersonSummary";
import PersonDetailsTable from "../components/PersonRecords/PersonDetailsTable";
import SortButtonsTabs from "../components/List/SortButtonTabs";
import PaymentFilterTabs from "../components/PersonRecords/PaymentFilterTabs";
import PaginationButtons from "../components/List/PaginationButtons";

const PersonRecords = () => {
  const [searchText, setSearchText] = useState("");
  const { data } = useUserData();
  const [sortOrder, setSortOrder] = useState("ascending");
  const [paymentFilter, setPaymentFilter] = useState("notPaid");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const namesList = useMemo(() => {
    const nameSet = new Set();
    data.forEach((item) => {
      if (item.name) {
        nameSet.add(item.name.trim());
      }
    });
    return Array.from(nameSet);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchText) return [];

    let filtered = data.filter(
      (item) =>
        item.name &&
        item.name.trim().toLowerCase() === searchText.trim().toLowerCase()
    );

    let normalizedData = filtered.map((item) => {
        if (item.is_paid === false) {
          return { ...item, paid_amount: 0 };
        }
        return item;
      });

    if (paymentFilter === "paid") {
      filtered = normalizedData.filter(
        (item) => item.paid_amount >= item.total_amount
      );
    } else if (paymentFilter === "notPaid") {
      filtered = normalizedData.filter(
        (item) => item.paid_amount < item.total_amount
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
    });

    return sorted;
  }, [searchText, data, sortOrder, paymentFilter]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <div className="person-records-container">
      <div className="search-section">
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          namesList={namesList}
        />
      </div>

      <div className="record-layout">
        <div className="left-panel">
          <PersonSummary searchText={searchText} data={data} />
        </div>
        <div className="right-panel">
          <div className="tabs-container">
            <SortButtonsTabs
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <h2>List of Records</h2>
            <PaymentFilterTabs
              paymentFilter={paymentFilter}
              setPaymentFilter={setPaymentFilter}
            />
          </div>
          <PersonDetailsTable records={paginatedRecords} />
          {filteredData.length > 0 && (
            <PaginationButtons
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonRecords;
