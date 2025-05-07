import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/setup";
import allImages from "../../assets/CloudinaryImages";
import "./NavBar.css";

const NavBar = () => {
  const [currentUser, setCurrentUser] = useState(null); // Firebase authenticated user
  const [userProfile, setUserProfile] = useState(null); // Additional user data from Firestore
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Toggle sidebar visibility

  const navigate = useNavigate();

  // Toggle sidebar open/close
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  // Fetch user data when auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            setUserProfile(userSnapshot.data());
          } else {
            // console.log("No user data found");
            setUserProfile(null);
          }
        } catch (error) {
          // console.error("Error fetching user data:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Render avatar: profile picture > initial > icon fallback
  const renderUserAvatar = () => {
    if (userProfile) {
      if (userProfile.profilePicture) {
        return (
          <img
            src={userProfile.profilePicture}
            alt="User"
            className="user-avatar"
          />
        );
      } else if (userProfile.name) {
        return (
          <div className="user-avatar">{userProfile.name[0].toUpperCase()}</div>
        );
      }
    }
    return <FaUserAlt className="icon" />;
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <h1 className="navbar-logo" onClick={() => navigate("/home")}>
        Farm Tracker
      </h1>

      {/* Right-side options */}
      <div className="navbar-options">
        {currentUser ? (
          <>
            <button onClick={() => navigate("/add")} className="navbar-button">
              Add Record
            </button>

            <button
              className="navbar-btn nav-plusIcon"
              onClick={() => navigate("/add")}
            >
              <FaPlus className="icon" />
            </button>

            <button
              className="navbar-btn"
              onClick={() => navigate("/personrecords")}
            >
              <FaSearch className="icon" />
            </button>
          </>
        ) : null}

        <button className="navbar-btn" onClick={toggleSidebar}>
          {renderUserAvatar()}
        </button>
      </div>

      {/* Sidebar: Profile Info or Welcome Message */}
      {isSidebarVisible && (
        <div className="user-sidebar">
          {currentUser ? (
            <>
              <img
                src={
                  userProfile?.profilePicture ||
                  allImages.otherImages.defaultAvatar
                }
                alt="User"
                className="sidebar-avatar"
              />
              <div className="sidebar-content">
                <h3>{userProfile?.name}</h3>
                <p>{userProfile?.email}</p>
                <p>{userProfile?.phone}</p>
                <button
                  className="logout-btn"
                  onClick={() => {
                    auth.signOut();
                    setIsSidebarVisible(false);
                    navigate("/signin");
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="sidebar-content">
              <h3>Welcome to Form Tracker!</h3>
              <p>Please sign in to access your dashboard features.</p>
              <p>We're excited to have you onboard 🌟</p>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
