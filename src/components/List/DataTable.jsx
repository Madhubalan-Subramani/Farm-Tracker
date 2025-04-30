import React from "react";
import formatAmount from "../../utils/formatAmount";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const DataTable = ({ data, indexOfFirstRecord }) => {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th className="stickyTable">Date</th>
            <th>Name</th>
            <th>Cultivator</th>
            <th>Time/Trip</th>
            <th>Phone</th>
            <th>Amount</th>
            <th>Paid Amount</th>
            <th>Cash Type</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id}>
                <td>{index + indexOfFirstRecord + 1}</td>
                <td className="stickyTable">{formatDate(item.date)}</td>
                <td>{item.name}</td>
                <td>
                  {item.cultivator_type_image && (
                    <img src={item.cultivator_type_image} alt="cultivator" />
                  )}
                </td>
                <td>
                  {item.time_used
                    ? `${item.time_used.hours}h - ${item.time_used.minutes}m`
                    : item.trips
                    ? `${item.trips} trips`
                    : "-"}
                </td>
                <td>{item.phone_number || "-"}</td>
                <td>{formatAmount(item.total_amount)} /-</td>
                <td>
                  {item.is_paid ? `${formatAmount(item.paid_amount)} /-` : "-"}
                </td>
                <td>
                  {item.is_paid && item.modeofpayment_image ? (
                    <img src={item.modeofpayment_image} alt="payment mode" />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="notes-cell">
                  {item.notes ? (
                    <div className="notes-wrapper">
                      <span className="short-notes">
                        {item.notes.length > 5
                          ? `${item.notes.slice(0, 5)}...`
                          : item.notes}
                      </span>
                      <div className="full-notes-popup">{item.notes}</div>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="no-data">
                No Data Available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
