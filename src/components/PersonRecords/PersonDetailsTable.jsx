import React from "react";
import "./PersonDetailsTable.css";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";

const PersonDetailsTable = ({ records }) => {
  const truncateText = (text, maxLength = 8) => {
    if (!text) return "-";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="table-wrapper">
      <table className="modern-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Name</th>
            <th>Cultivator</th>
            <th>Time / Trip</th>
            <th>Total Amount</th>
            <th>Paid Amount</th>
            <th>Balance Amount</th>
            <th>Mode of Payment</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{truncateText(item.name)}</td>
                  <td>
                    <img
                      className="cluti-image"
                      src={item.cultivator_type_image}
                      alt={item.cultivator_type}
                    />
                  </td>
                  <td>
                    {item.time_used
                      ? `${item.time_used.hours}h - ${item.time_used.minutes}m`
                      : item.trips
                      ? `${item.trips} trips`
                      : "-"}
                  </td>
                  <td>{formatAmount(item.total_amount)} /-</td>
                  <td>{`${formatAmount(item.paid_amount)} /-`}</td>
                  <td className="balanceAmount">
                    {formatAmount(item.total_amount - item.paid_amount)} /-
                  </td>
                  <td>
                    {item.modeofpayment_image === null ? (
                      "-"
                    ) : (
                      <img src={item.modeofpayment_image} alt="payment mode" />
                    )}
                  </td>
                  <td>{item.notes || "-"}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="10" className="no-data" style={{ fontSize: "16px" }}>
                No Records Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PersonDetailsTable;
