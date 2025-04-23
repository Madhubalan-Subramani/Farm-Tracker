import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <Router>
      <div>
        <h1>Welcome to My App</h1>
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
