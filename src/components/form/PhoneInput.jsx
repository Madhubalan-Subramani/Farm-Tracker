import React from "react";

const PhoneInput = ({ phoneNumber, setPhoneNumber, error }) => {
  return (
    <div className="form-row">
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        type="tel"
        id="phoneNumber"
        name="phoneNumber"
        inputMode="numeric"
        maxLength="10"
        placeholder="Enter 10-digit number"
        autoComplete="off"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PhoneInput;
