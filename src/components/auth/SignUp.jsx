import React, { useState } from "react";
import { auth, db } from "../../firebase/setup";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { cloudinaryImageUpload } from "../../utils/cloudinaryImageUpload";
import "./SignUp.css";

// Helper functions for validation
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 6;

// Function to store user data in Firestore
const createUserInFirestore = async (
  user,
  name,
  email,
  phone,
  profilePictureUrl
) => {
  const userDoc = doc(db, "users", user.uid);
  await setDoc(userDoc, {
    uid: user.uid,
    name,
    email,
    phone,
    profilePicture: profilePictureUrl,
    role: "user",
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
  });
};

const SignUp = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate email and password
    if (!validateEmail(email)) {
      setEmailValid(false);
      setLoading(false);
      return;
    } else {
      setEmailValid(true);
    }

    if (!validatePassword(password)) {
      setPasswordValid(false);
      setLoading(false);
      return;
    } else {
      setPasswordValid(true);
    }

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Upload profile picture to Cloudinary if selected
      let profilePictureUrl = "";
      if (profilePicture) {
        profilePictureUrl = await cloudinaryImageUpload(profilePicture);
      }

      // Store user data in Firestore
      await createUserInFirestore(user, name, email, phone, profilePictureUrl);

      alert("Account created successfully!");
      setLoading(false);
      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setProfilePicture(null);
      navigate("/signin");
    } catch (err) {
      setError("Failed to create account. Please try again.");
      setLoading(false);
      console.error("Error during sign up:", err);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSignUp}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={!emailValid ? "input-invalid" : ""}
          />
          {!emailValid && (
            <p className="error-message">Please enter a valid email address.</p>
          )}
        </div>

        <div>
          <label>Password:</label>
          <div style={{ position: "relative" }}>
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={!passwordValid ? "input-invalid" : ""}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          {!passwordValid && (
            <p className="error-message">
              Password must be at least 6 characters long.
            </p>
          )}
        </div>

        <div>
          <label>Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SignUp;
