import React from "react";

const SubmitButton = ({ isEdit }) => {
  return (
    <button type="submit" className="submit-btn">
      {isEdit ? "Update Existing Record" : "Add New Record"}
    </button>
  );
};

export default SubmitButton;
