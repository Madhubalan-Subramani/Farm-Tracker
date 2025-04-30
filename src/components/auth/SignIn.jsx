import React, { useState } from "react";
import { auth } from "../../firebase/setup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home", { replace: true }); 

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form className="signin-form" onSubmit={handleSignIn}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SignIn;