import React from "react";

const PaymentFilterTabs = ({ paymentFilter, setPaymentFilter }) => {
  return (
    <div className="tabs">
      <button
        className={`tab-btn ${
          paymentFilter === "notPaid" ? "active not-paid-records" : ""
        }`}
        onClick={() => setPaymentFilter("notPaid")}
      >
        Not Paid
      </button>
      <button
        className={`tab-btn ${
          paymentFilter === "paid" ? "active appBgColor" : ""
        }`}
        onClick={() => setPaymentFilter("paid")}
      >
        Paid
      </button>
      <button
        className={`tab-btn ${
          paymentFilter === "both" ? "active both-paid-records" : ""
        }`}
        onClick={() => setPaymentFilter("both")}
      >
        Both
      </button>
    </div>
  );
};

export default PaymentFilterTabs;
