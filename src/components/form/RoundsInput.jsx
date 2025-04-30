import React from "react";

const RoundsInput = ({ noOfTrips, setNoOfTrips, error }) => {
  return (
    <div className="form-row">
      <label htmlFor="trip">
        Trips<span className="required">*</span>
      </label>
      <input
        type="number"
        max="20"
        id="trip"
        value={noOfTrips}
        onChange={(e) => setNoOfTrips(e.target.value || "0")}
        onFocus={(e) => e.target.value === "0" && setNoOfTrips("")}
        onBlur={(e) => e.target.value === "" && setNoOfTrips("0")}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RoundsInput;
