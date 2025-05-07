import React, { useState } from "react";

const PasswordInput = ({ value, onChange, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-grp password-input">
      <label htmlFor="password">Password<span className="required">*</span></label>
      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={value}
          onChange={onChange}
          className={error ? "input-error" : ""}
          placeholder="Enter your password"
        />
        {value && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PasswordInput;
