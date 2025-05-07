// src/pages/SignUpPage.jsx
import React from "react";
import SignUpForm from "../SignUp/SignUpForm";
import SignUpImage from "../SignUp/SignUpImage";
import "./SignUp.css";

const SignUpPage = () => {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <SignUpImage />
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
