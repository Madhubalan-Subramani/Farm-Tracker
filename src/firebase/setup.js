import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfV9MjVNPCcGbfqJHyZ2EGGMSZVVw4IiU",
  authDomain: "form-tracker-3bbd6.firebaseapp.com",
  projectId: "form-tracker-3bbd6",
  storageBucket: "form-tracker-3bbd6.firebasestorage.app",
  messagingSenderId: "446738816800",
  appId: "1:446738816800:web:984e94ae95921af0d24145",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };