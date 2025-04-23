import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaGlobe, FaUserAlt } from "react-icons/fa";
import { auth, db } from "../../firebase/setup"; // Include Firestore
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import './styles/NavBar.css';

const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null); // Firebase Auth user
  const [userData, setUserData] = useState(null); // Firestore user data

  const toggleDarkMode = () => setDarkMode(!darkMode);

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
        return <img src={userData.profilePicture} alt="User" className="user-avatar" />;
      } else if (userData.name) {
        return <div className="user-avatar">{userData.name[0].toUpperCase()}</div>;
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
        <button className="navbar-btn">
          {getUserAvatar()}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
