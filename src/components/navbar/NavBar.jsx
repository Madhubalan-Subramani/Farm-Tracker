import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaGlobe, FaUserAlt } from "react-icons/fa";
import { auth, db } from "../../firebase/setup";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./styles/NavBar.css";
import Images from "../../assets/Images";

const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } else {
            console.log("No user data found");
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const getUserAvatar = () => {
    if (userData) {
      if (userData.profilePicture) {
        return (
          <img
            src={userData.profilePicture}
            alt="User"
            className="user-avatar"
          />
        );
      } else if (userData.name) {
        return (
          <div className="user-avatar">{userData.name[0].toUpperCase()}</div>
        );
      }
    }
    return <FaUserAlt className="icon" />;
  };

  return (
    <nav className={`navbar ${darkMode ? "navbar-dark" : "navbar-light"}`}>
      <h1 className="navbar-logo">Form Tracker</h1>

      <div className="navbar-options">
        <button onClick={toggleDarkMode} className="navbar-btn">
          {darkMode ? <FaSun className="icon" /> : <FaMoon className="icon" />}
        </button>
        <button className="navbar-btn">
          <FaGlobe className="icon" />
        </button>
        <button className="navbar-btn" onClick={toggleSidebar}>
          {getUserAvatar()}
        </button>
      </div>

      {/* SideBar */}
      {showSidebar && (
        <div className="user-sidebar">
          {user ? (
            <>
              <img
                src={userData?.profilePicture || Images.defaultAvatar}
                alt="User"
                className="sidebar-avatar"
              />
              <div className="sidebar-content">
                <h3>{userData?.name}</h3>
                <p>{userData?.email}</p>
                <p>{userData?.phone}</p>
                <button
                  className="logout-btn"
                  onClick={() => {
                    auth.signOut();
                    setShowSidebar(false);
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
