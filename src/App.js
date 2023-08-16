import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/navigation/Navbar";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import { AuthProvider } from "./contexts/AuthContext";


const App = () => {

  return (
    <div>
      <Router>
        <Navbar />
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
