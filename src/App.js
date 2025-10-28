import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Hairstyle from "./pages/Hairstyle";
import Salon from "./pages/Salon";
import Treatment from "./pages/Treatment";
import Tatarias from "./pages/Tatarias";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ScrollToTop from "./pages/ScrollToTop";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Course Routes */}
            <Route path="/belajar-hairstyle" element={<Hairstyle />} />
            <Route path="/belajar-salon" element={<Salon />} />
            <Route path="/belajar-treatment" element={<Treatment />} />
            <Route path="/belajar-tatarias" element={<Tatarias />} />

            {/* Protected User Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
}

export default App;
