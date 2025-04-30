import React from "react";
import ImageDropdown from "./ImageDropdown";
import MoneyInput from "../form/MoneyInput";

const PaidSection = ({
  isPaid,
  setIsPaid,
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
      {isPaid && (
        <div className="row-two">
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
        </div>
      )}
    </>
  );
};

export default PaidSection;
