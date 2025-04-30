import React from "react";
import { FaCalendarAlt, FaCalendarDay, FaCalendarWeek } from "react-icons/fa";

const DateTabs = ({ dateTab, setDateTab }) => {
  return (
    <div className="tabs">
      <button
        className={`tab-btn ${dateTab === "day" ? "active appBgColor" : ""}`}
        onClick={() => setDateTab("day")}
      >
        <FaCalendarDay /> Day
      </button>
      <button
        className={`tab-btn ${dateTab === "week" ? "active appBgColor" : ""}`}
        onClick={() => setDateTab("week")}
      >
        <FaCalendarWeek /> Week
      </button>
      <button
        className={`tab-btn ${dateTab === "month" ? "active appBgColor" : ""}`}
        onClick={() => setDateTab("month")}
      >
        <FaCalendarAlt /> Month
      </button>
      <button
        className={`tab-btn ${dateTab === "year" ? "active appBgColor" : ""}`}
        onClick={() => setDateTab("year")}
      >
        <FaCalendarAlt /> Year
      </button>
    </div>
  );
};

export default DateTabs;
