import React, { useRef } from "react";

const MoneyInput = ({ amount, setAmount, field }) => {
  const inputRef = useRef(null);

  const prefix = "₹ ";
  const suffix = " /-";

  const handleAmountChange = (e) => {
    let value = e.target.value.trim();
    // Remove prefix and suffix
    let stripped = value.replace(prefix, "").replace(suffix, "");
    // Remove any non-digit characters, but allow for a decimal point
    let onlyDigits = stripped.replace(/[^\d.]/g, "");
    // If the user tries to add multiple decimals, just keep the first one
    let parts = onlyDigits.split(".");
    if (parts.length > 2) {
      onlyDigits = parts[0] + "." + parts[1];
    }
    // Check if the value is empty, if so reset to 0
    if (!onlyDigits || isNaN(onlyDigits)) {
      onlyDigits = "0";
    }
    // Update the state without adding ".00" automatically
    setAmount(onlyDigits);
  };

  const handleFocus = () => {
    // Focus on the input and select the numeric part
    setTimeout(() => {
      const input = inputRef.current;
      const start = prefix.length;
      const end = start + amount.length;
      input.setSelectionRange(start, end);
    }, 0);
  };

  const handleSelect = (e) => {
    const input = e.target;
    const start = prefix.length;
    const end = prefix.length + amount.length;
    // Adjust selection behavior to make sure the number part is selected properly
    if (input.selectionStart < start) {
      input.setSelectionRange(start, end);
    } else if (input.selectionEnd > end) {
      input.setSelectionRange(start, end);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      className="amount-input"
      value={`${prefix}${amount}${suffix}`}
      onChange={handleAmountChange}
      onFocus={handleFocus}
      onClick={handleFocus}
      onSelect={handleSelect}
    />
  );
};

export default MoneyInput;
