import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase/setup";

const useUserData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userDataRef = collection(db, "users", currentUser.uid, "userData");

      const unsubscribe = onSnapshot(userDataRef, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchData();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { data, loading };
};

export default useUserData;
