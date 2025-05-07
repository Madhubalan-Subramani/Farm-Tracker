import React, { useState } from "react";
import { auth } from "../../firebase/setup";
import { sendPasswordResetEmail } from "firebase/auth";
import { fetchSignInMethodsForEmail } from "firebase/auth";

import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        email.trim()
      );
      if (signInMethods.length === 0) {
        setError("This email is not registered.");
        setLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password reset link has been sent to your email.");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("This email is not registered.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-card">
        <h2>Reset Your Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
