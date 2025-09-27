import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './page/Login';
import Home from './page/Home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("isAuthenticated");
    if (loggedInUser) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("lastLoginTime", formattedDate);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("lastLoginTime");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
        />
        <Route
          path="/*"
          element={isAuthenticated ? <Home handleLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid rgba(75, 85, 99, 0.5)', 
            color: 'white',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </Router>
  );
}

export default App;