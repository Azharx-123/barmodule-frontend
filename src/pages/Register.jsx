import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import "../css/Auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({ name, email, password });

      // Save token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("userName", response.data.user.name);
      localStorage.setItem("userRole", response.data.user.role);

      alert("Registrasi berhasil!");
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Daftar di Barmodule</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="auth-input"
          />
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
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>
        <p className="auth-link">
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
