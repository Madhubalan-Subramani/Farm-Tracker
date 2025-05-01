import React, { useMemo } from "react";
import formatAmount from "../../utils/formatAmount";

const PersonSummary = ({ searchText, data }) => {
  const summary = useMemo(() => {
    if (!searchText) {
      return {
        name: "Name",
        phone: "Phone Number",
        total: 0,
        paid: 0,
        balance: 0,
        recordCount: 0,
        totalHours: 0,
        totalMinutes: 0,
        totalTrips: 0,
      };
    }

    const matchedRecords = data.filter(
      (item) =>
        item.name &&
        item.name.trim().toLowerCase() === searchText.trim().toLowerCase()
    );

    if (matchedRecords.length === 0) {
      return {
        name: searchText,
        phone: "N/A",
        total: 0,
        paid: 0,
        balance: 0,
        recordCount: 0,
        totalHours: 0,
        totalMinutes: 0,
        totalTrips: 0,
      };
    }

    const phoneFrequency = {};
    matchedRecords.forEach((item) => {
      const phone = item.phone_number?.trim() || "N/A";
      phoneFrequency[phone] = (phoneFrequency[phone] || 0) + 1;
    });

    const mostUsedPhone = Object.entries(phoneFrequency).reduce(
      (a, b) => (a[1] >= b[1] ? a : b),
      ["N/A", 0]
    )[0];

    const total = matchedRecords.reduce(
      (acc, item) => acc + Number(item.total_amount || 0),
      0
    );
    const paid = matchedRecords.reduce(
      (acc, item) => acc + Number(item.paid_amount || 0),
      0
    );
    const balance = total - paid;

    let totalHours = 0;
    let totalMinutes = 0;
    let totalTrips = 0;

    matchedRecords.forEach((item) => {
      const time = item.time_used;
      if (
        time &&
        typeof time.hours === "number" &&
        typeof time.minutes === "number"
      ) {
        totalHours += Number(time.hours || 0);
        totalMinutes += Number(time.minutes || 0);
      } else if (item.trips) {
        totalTrips += Number(item.trips || 0);
      }
    });

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    return {
      name: searchText,
      phone: mostUsedPhone,
      total,
      paid,
      balance,
      recordCount: matchedRecords.length,
      totalHours,
      totalMinutes,
      totalTrips,
    };
  }, [searchText, data]);

  return (
    <div className="person-summary-card">
      <h2>{summary.name}</h2>
      <div className="highlight-number">{summary.phone}</div>
      <hr className="summary-divider" />

      <div className="time-trip-summary-grid">
        <div className="summary-box">
          <span className="label">No. of Times</span>
          <span className="value">{summary.recordCount}</span>
        </div>
        <div className="summary-box">
          <span className="label">Time / Trips</span>
          <span className="value">
            {`${summary.totalHours}h -${summary.totalMinutes}m + ${summary.totalTrips} t`}
          </span>
        </div>
      </div>

      <hr className="summary-divider" />

      {/* ✅ Existing amount summary */}
      <div className="amount-summary-grid">
        <div className="amount-card total">
          <span className="label">Total</span>
          <span className="value">₹ {formatAmount(summary.total)}</span>
        </div>
        <div className="amount-card paid">
          <span className="label">Paid</span>
          <span className="value">₹ {formatAmount(summary.paid)}</span>
        </div>
        <div className="amount-card balance">
          <span className="label">Balance</span>
          <span className="value">₹ {formatAmount(summary.balance)}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonSummary;
