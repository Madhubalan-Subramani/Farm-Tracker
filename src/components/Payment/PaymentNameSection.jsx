import React from "react";
import NameInput from "../Form/NameInput";

const PaymentNameSection = ({
  name,
  setName,
  filteredNames,
  setFilteredNames,
  handleSearchClick,
  formErrors,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <NameInput
        name={name}
        setName={setName}
        error={formErrors.name}
        suggestions={filteredNames}
        onSuggestionClick={(value) => {
          setName(value);
          setFilteredNames([]);
        }}
      />
      <button
        type="button"
        className="submit-btn"
        style={{
          marginTop: formErrors.name ? "-10px" : "12px",
          width: "fit-content",
          fontSize: "14px",
          fontWeight: "400",
        }}
        onClick={handleSearchClick}
      >
        Search
      </button>
    </div>
  );
};

export default PaymentNameSection;
