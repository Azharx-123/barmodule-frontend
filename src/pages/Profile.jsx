import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageUpload from "../components/ImageUpload";
import api from "../services/api";
import "../css/Profile.css";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get("/users/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar]);

const handleAvatarUploadSuccess = (newAvatarUrl) => {
  setUser({ ...user, avatar: newAvatarUrl });
  setShowAvatarUpload(false);
  localStorage.setItem("userAvatar", newAvatarUrl);
  window.dispatchEvent(
    new CustomEvent("avatarUpdated", { detail: newAvatarUrl }),
  );
};

  if (loading) {
    return <div className="profile-loading">Memuat...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Profil Saya</h1>
        </div>

        <div className="profile-info">
          <div className="info-card">
            <div className="avatar-section">
              {user?.avatar && !avatarError ? (
                <img
                  src={user.avatar}
                  alt={user?.name}
                  className="user-avatar"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="user-avatar user-avatar-initials">
                  {getInitials(user?.name)}
                </div>
              )}
              <button
                onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                className="change-avatar-btn"
              >
                {showAvatarUpload ? "Batal" : "Ganti Foto"}
              </button>
            </div>

            {showAvatarUpload && (
              <ImageUpload
                currentImage={user?.avatar}
                uploadType="avatar"
                onUploadSuccess={handleAvatarUploadSuccess}
              />
            )}

            <h2>Informasi Akun</h2>
            <p>
              <strong>Nama:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> {user?.role}
            </p>
            <p>
              <strong>Bergabung:</strong>{" "}
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
          {user?.role !== "admin" && user?.role !== "teacher" && (
            <div className="info-card">
              <h2>Course yang Diikuti</h2>
              {user?.enrolledCourses?.length > 0 ? (
                <div className="enrolled-courses">
                  {user.enrolledCourses
                    .filter((course) => course.courseId)
                    .map((course, index) => (
                      <div
                        key={index}
                        className="course-item"
                        onClick={() =>
                          navigate(`/belajar/${course.courseId.slug}`)
                        }
                      >
                        <img
                          src={course.courseId.image}
                          alt={course.courseId.title}
                        />
                        <div>
                          <h3>{course.courseId.title}</h3>
                          <p>Progress: {course.progress}%</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>Belum mengikuti course apapun</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
