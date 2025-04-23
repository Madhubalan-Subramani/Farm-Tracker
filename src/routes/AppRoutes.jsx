import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "../firebase/setup";
import SignUp from "../components/auth/Signup";
import SignIn from "../components/auth/Signin";
import Dashboard from "../components/dashboard/dashboard";

const AppRoutes = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Routes>
      {/* Redirect from / to /dashboard if user is authenticated */}
      <Route
        path="/"
        element={
          user ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />
        }
      />

      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      {/* Dashboard route */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
};

export default AppRoutes;
