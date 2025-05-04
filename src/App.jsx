import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/Navbar/NavBar";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <header>
        <NavBar />
      </header>
      <main>
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
};

export default App;
