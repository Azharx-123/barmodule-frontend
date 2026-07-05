import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import NavbarHome from "../components/NavbarHome";
import "../css/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/profile";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });

      // Save token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("userName", response.data.user.name);
      localStorage.setItem("userRole", response.data.user.role);

      alert("Login berhasil!");

      // Redirect based on role
     if (["admin", "teacher"].includes(response.data.user.role)) {
       navigate("/admin");
     } else {
       navigate(from, { replace: true });
     }
    } catch (error) {
      alert(error.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <NavbarHome />
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login ke LMS</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
        <p className="auth-link">
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
