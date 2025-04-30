import React from "react";

const DateInput = ({ date, setDate, error}) => {
  return (
    <div className="form-row">
      <label>
        Date<span className="required">*</span>
      </label>
      <input
        type="date"
        id="date"
        name="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        autoComplete="off"
      />

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DateInput;
