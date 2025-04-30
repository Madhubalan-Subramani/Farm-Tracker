import React from "react";

const ImageDropdown = ({
  label,
  selected,
  setSelected,
  dropdownOpen,
  setDropdownOpen,
  options,
  placeholder,
  error,
}) => {
  return (
    <div className="form-row">
      <label>
        {label}
        <span className="required">*</span>
      </label>
      <div className="image-dropdown">
        <div
          className="dropdown-header"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selected ? (
            <img src={selected.image} alt={selected.value} />
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        {dropdownOpen && (
          <div className="dropdown-list">
            {options.map((opt) => (
              <div
                key={opt.value}
                className="dropdown-item"
                onClick={() => {
                  setSelected(opt);
                  setDropdownOpen(false);
                }}
              >
                <img src={opt.image} alt={opt.value} />
              </div>
            ))}
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ImageDropdown;
