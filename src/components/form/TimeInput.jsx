import React from "react";

const TimeInput = ({ hours, minutes, setHours, setMinutes, error }) => {
  return (
    <div className="row-two">
      <div className="form-row">
        <label>Hours</label>
        <input
          type="number"
          min="0"
          max="10"
          value={hours}
          onChange={(e) => setHours(e.target.value || "0")}
          onFocus={(e) => e.target.value === "0" && setHours("")}
          onBlur={(e) => e.target.value === "" && setHours("0")}
        />
      </div>
      <div className="form-row">
        <label>
          Minutes<span className="required">*</span>
        </label>
        <input
          type="number"
          min="0"
          max="60"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value || "0")}
          onFocus={(e) => e.target.value === "0" && setMinutes("")}
          onBlur={(e) => e.target.value === "" && setMinutes("0")}
        />
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default TimeInput;
