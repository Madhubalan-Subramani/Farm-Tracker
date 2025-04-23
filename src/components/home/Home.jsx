import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/setup";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/signin", { replace: true });
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (err) {
        console.error("Error getting user data:", err);
        alert("There was an error fetching your data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();

      const confirmed = window.confirm("Are you sure you want to go back to Sign In?");
      if (confirmed) {
        auth.signOut();
        navigate("/signin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/signin", { replace: true });
  };

  if (loading) {
    return <div>Loading user data...</div>; // Show loading state
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>
      {userData ? (
        <div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Phone:</strong> {userData.phone}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default Home;
