import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadField from "./UploadField";
import PasswordInput from "./PasswordInput";
import { auth, db } from "../../firebase/setup";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { cloudinaryImageUpload } from "../../utils/cloudinaryImageUpload";

// Helper to save user info in Firestore after successful sign-up
const createUserInFirestore = async (
  user,
  name,
  email,
  phone,
  profilePictureUrl
) => {
  const userDoc = doc(db, "users", user.uid); // Create a reference for the user's document in Firestore
  await setDoc(userDoc, {
    uid: user.uid,
    name,
    email,
    phone,
    profilePicture: profilePictureUrl,
    role: "user", // default role
    isVerified: false, // could be used later for email/phone verification
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
  });
};

const SignUpForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    profilePic: null,
  });

  // Error states and loading
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Update input fields
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Update profile picture file
  const handleFileChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      profilePic: file,
    }));
  };

  // ✅ Form validation before submission
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler for form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setLoading(true);
    setStatusMessage(`Creating account for ${formData.name}...`);

    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Step 2: Upload profile picture if provided
      let profilePictureUrl = "";
      if (formData.profilePic) {
        setStatusMessage("Uploading profile picture...");
        profilePictureUrl = await cloudinaryImageUpload(formData.profilePic);
      }

      // Step 3: Save user info in Firestore
      setStatusMessage("Saving user data...");
      await createUserInFirestore(
        user,
        formData.name,
        formData.email,
        formData.phone,
        profilePictureUrl
      );

      // ✅ Step 4: Clear form and navigate to home
      setStatusMessage("Account created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        profilePic: null,
      });

      // ✅ Small delay to show success message
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      // console.error("Error during sign up:", err);
      setSubmitError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-content">
      <h2 className="heading">Create Account</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
        {/* Name Input */}
        <div className="form-grp">
          <label htmlFor="name">
            Name<span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
            placeholder="Enter your name"
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div className="form-grp">
          <label htmlFor="email">
            Email<span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        {/* Phone Input */}
        <div className="form-grp">
          <label htmlFor="phone">
            Phone<span className="required">*</span>
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? "input-error" : ""}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>

        {/* Password Input Component */}
        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        {/* Profile Picture Upload Component */}
        <UploadField
          onFileChange={handleFileChange}
          error={errors.profilePic}
        />

        {/* Submit Button */}
        <button
          className="submit-btn"
          type="submit"
          disabled={loading}
          style={{ marginTop: "0" }}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* Error and Status Messages */}
        {submitError && <p className="error-message">{submitError}</p>}
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>

      {/* Link to Sign In Page */}
      <div className="already-have-account">
        <p>Already have an Account?</p>
        <button className="login-link" onClick={() => navigate("/signin")}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
