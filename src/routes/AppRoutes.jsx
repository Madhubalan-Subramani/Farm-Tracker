import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "../firebase/setup";
import SignUp from "../components/auth/Signup";
import SignIn from "../components/auth/Signin";
import Home from "../components/home/Home";

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle user state changes (onAuthStateChanged)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>; // This could be improved with a dedicated loading component

  return (
    <Routes>
      {/* Redirect based on user authentication status */}
      <Route path="/" element={<Navigate to={user ? "/home" : "/signin"} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/home"
        element={user ? <Home /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
};

export default AppRoutes;
