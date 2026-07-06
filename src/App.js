import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { forceLogout } from "./services/api";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import CoursePage from "./pages/CoursePage";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ScrollToTop from "./pages/ScrollToTop";
import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    let socket;

    const connectAuthSocket = () => {
      if (socket) socket.disconnect(); // putus koneksi lama kalau ada (misal ganti akun)
      const token = localStorage.getItem("token");
      if (!token) return;

      socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
        auth: { token },
      });
      socket.on("force-logout", forceLogout);
    };

    connectAuthSocket(); // percobaan pertama saat App mount (misal user refresh saat sudah login)
    window.addEventListener("auth-changed", connectAuthSocket); // ⬅️ dengerin sinyal dari Login.jsx

    return () => {
      window.removeEventListener("auth-changed", connectAuthSocket);
      if (socket) socket.disconnect();
    };
  }, []);
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

            {/* Dynamic Course Route — menggantikan 4 route statis */}
            <Route
              path="/belajar/:slug"
              element={
                <ProtectedRoute>
                  <CoursePage />
                </ProtectedRoute>
              }
            />

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
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
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
