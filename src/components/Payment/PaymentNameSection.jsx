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
        style={{ marginTop: "12px" }}
        onClick={handleSearchClick}
      >
        Search
      </button>
    </div>
  );
};

export default PaymentNameSection;
