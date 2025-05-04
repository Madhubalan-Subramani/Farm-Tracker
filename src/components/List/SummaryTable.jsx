import React from "react";
import formatAmount from "../../utils/formatAmount";

const SummaryTable = ({ totalAmount, paidAmount, balanceAmount }) => {
  return (
    <div className="summary-wrapper">
      <h2 className="summary-title">Summary</h2>
      <table className="summary-table">
        <thead>
          <tr>
            <th>Total Amount</th>
            <th>Paid Amount</th>
            <th>Balance Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> {formatAmount(totalAmount)} /-</td>
            <td> {formatAmount(paidAmount)} /-</td>
            <td style={{ color: "red" }}> {formatAmount(balanceAmount)} /-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
