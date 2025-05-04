import React from "react";
import ImageDropdown from "./ImageDropdown";
import MoneyInput from "../Form/MoneyInput";

const PaidSection = ({
  paymentSelected,
  setPaymentSelected,
  paymentDropdownOpen,
  setPaymentDropdownOpen,
  paidAmount,
  setPaidAmount,
  formErrors,
  payment_options,
}) => {
  return (
    <>
      <ImageDropdown
        label="Cash Type"
        selected={paymentSelected}
        setSelected={setPaymentSelected}
        dropdownOpen={paymentDropdownOpen}
        setDropdownOpen={setPaymentDropdownOpen}
        options={payment_options}
        placeholder="Select payment mode"
        error={formErrors.payment}
      />
      <div className="form-row">
        <label>
          Paid Amount<span className="required">*</span>
        </label>
        <MoneyInput
          amount={paidAmount}
          setAmount={setPaidAmount}
          field="paidAmount"
        />
        {formErrors.paidAmount && (
          <p className="error">{formErrors.paidAmount}</p>
        )}
      </div>
    </>
  );
};

export default PaidSection;
