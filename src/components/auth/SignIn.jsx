import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/setup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

const quotes = [
  '🌾 "The future of agriculture lies in smart work and dedication."',
  '🚀 "Success doesn’t come from what you do occasionally. It comes from what you do consistently."',
  '💡 "Don’t watch the clock; do what it does. Keep going."',
  '🔥 "Push yourself, because no one else is going to do it for you."',
  '🌟 "Dream big. Work hard. Stay focused. Surround yourself with good people."',
  '🏆 "Great things never come from comfort zones."',
  '📈 "Success is the sum of small efforts, repeated day in and day out."',
  '🌄 "The secret of getting ahead is getting started."',
  '🎉 "Hard work beats talent when talent doesn’t work hard."',
  '🎯 "Stay positive, work hard, and make it happen."',
];

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [quote, setQuote] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const random = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[random]);
  }, []);

  const validateEmailFormat = (email) => {
    const trimmedEmail = email.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(trimmedEmail);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoading(true);

    const trimmedEmail = email.trim();

    if (!validateEmailFormat(trimmedEmail)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
    } catch (err) {
      const code = err.code;
      if (code === "auth/user-not-found") {
        setEmailError("This email is not registered.");
      } else if (code === "auth/wrong-password") {
        setPasswordError("Incorrect password.");
      } else if (code === "auth/invalid-email") {
        setEmailError("Invalid email address.");
      } else if (code === "auth/invalid-credential") {
        setEmailError("Invalid email or password.");
        setPasswordError("Invalid email or password.");
      } else {
        setPasswordError("Sign in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-card">
        <h2 className="signin-title">Welcome Back!</h2>
        <div className="quote-box">
          <div className="quote-box">
            <div className="quote">{quote}</div>
          </div>
        </div>
        <form className="signin-form" onSubmit={handleSignIn}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error">{emailError}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="error">{passwordError}</p>}
          </div>

          {loading && <div className="loader">Signing in...</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="extra-links">
            <p>
              <span
                onClick={() => navigate("/forgetpassword")}
                className="link"
              >
                Forgot Password?
              </span>
            </p>
            <p>
              Don’t have an account?{" "}
              <a href="/signup" className="link">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
