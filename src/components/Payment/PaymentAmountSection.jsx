import React from "react";
import MoneyInput from "../Form/MoneyInput";

const PaymentAmountSection = ({
  matchedRecordsTotalAmount,
  matchedRecordsBalanceAmount,
}) => {
  return (
    <div className="row-two">
      <div className="form-row">
        <label>Total Amount</label>
        <MoneyInput
          amount={matchedRecordsTotalAmount}
          setAmount={() => {}}
          field="totalAmount"
        />
      </div>

      <div className="form-row">
        <label>Balance Amount</label>
        <MoneyInput
          amount={matchedRecordsBalanceAmount}
          setAmount={() => {}}
          field="balanceAmount"
        />
      </div>
    </div>
  );
};

export default PaymentAmountSection;
