import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import Tasks from "./pages/Tasks.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  useEffect(() => {
    // Listen for storage changes to update auth state
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes - Show only if NOT authenticated */}
        <Route 
          path="/signup" 
          element={!token ? <Signup /> : isAdmin ? <Navigate to="/admin" /> : <Navigate to="/profile" />} 
        />
        <Route 
          path="/login" 
          element={!token ? <Login /> : isAdmin ? <Navigate to="/admin" /> : <Navigate to="/profile" />} 
        />
        
        {/* User Protected Routes */}
        <Route 
          path="/profile" 
          element={token && !isAdmin ? <Profile /> : !token ? <Navigate to="/login" /> : <Navigate to="/admin" />} 
        />
        <Route 
          path="/tasks" 
          element={token && !isAdmin ? <Tasks /> : !token ? <Navigate to="/login" /> : <Navigate to="/admin" />} 
        />
        
        {/* Admin Protected Route */}
        <Route 
          path="/admin" 
          element={token && isAdmin ? <AdminDashboard /> : !token ? <Navigate to="/login" /> : <Navigate to="/profile" />} 
        />
        
        {/* Default Route */}
        <Route path="/" element={!token ? <Navigate to="/signup" /> : isAdmin ? <Navigate to="/admin" /> : <Navigate to="/profile" />} />
      </Routes>
    </Router>
  );
}

export default App;

