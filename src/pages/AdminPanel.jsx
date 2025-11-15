import React, { useState, useEffect, useCallback } from "react";
import "../css/AdminPanel.css";
import ImageUpload from "../components/ImageUpload";

const API_URL = "http://localhost:5000/api";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Course form state
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  const [courseCategory, setCourseCategory] = useState("hairstyle");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [courseVideo, setCourseVideo] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchStats();
      fetchCourses();
      fetchContacts();
    }
  }, [isLoggedIn, token, fetchStats, fetchCourses, fetchContacts]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [token]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/courses`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        if (data.user.role !== "admin") {
          alert("Akses ditolak. Hanya admin yang bisa login.");
          return;
        }
        setToken(data.token);
        localStorage.setItem("adminToken", data.token);
        setIsLoggedIn(true);
        alert("Login berhasil!");
      } else {
        alert(data.message || "Login gagal");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleLogout = () => {
    setToken("");
    setIsLoggedIn(false);
    localStorage.removeItem("adminToken");
    setEmail("");
    setPassword("");
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        title: courseTitle,
        slug: courseSlug,
        category: courseCategory,
        description: courseDescription,
        image: courseImage,
        videoUrl: courseVideo,
      };

      const url = editingCourse
        ? `${API_URL}/courses/${editingCourse._id}`
        : `${API_URL}/courses`;

      const method = editingCourse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchCourses();
        resetCourseForm();
      } else {
        alert(data.message || "Operasi gagal");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const resetCourseForm = () => {
    setCourseTitle("");
    setCourseSlug("");
    setCourseCategory("hairstyle");
    setCourseDescription("");
    setCourseImage("");
    setCourseVideo("");
    setEditingCourse(null);
  };

  const handleEditCourse = (course) => {
    setCourseTitle(course.title);
    setCourseSlug(course.slug);
    setCourseCategory(course.category);
    setCourseDescription(course.description);
    setCourseImage(course.image || "");
    setCourseVideo(course.videoUrl || "");
    setEditingCourse(course);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Yakin ingin menghapus course ini?")) return;

    try {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Course berhasil dihapus");
        fetchCourses();
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const updateContactStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/contact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setCourseImage(imageUrl);
    setUploadingImage(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <div className="login-box">
          <h2>Admin Login</h2>
          <div className="login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
            />
            <button onClick={handleLogin} className="admin-button">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2 className="sidebar-title">Barmodule Admin</h2>
        <button
          onClick={() => setActiveTab("dashboard")}
          className="nav-button"
        >
          📊 Dashboard
        </button>
        <button onClick={() => setActiveTab("courses")} className="nav-button">
          📚 Courses
        </button>
        <button onClick={() => setActiveTab("contacts")} className="nav-button">
          📧 Contacts
        </button>
        <button onClick={handleLogout} className="nav-button logout-button">
          🚪 Logout
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "dashboard" && (
          <div>
            <h2 className="page-title">Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Courses</h3>
                <p className="stat-number">{stats.totalCourses || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Quiz Submissions</h3>
                <p className="stat-number">{stats.totalQuizzes || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Contacts</h3>
                <p className="stat-number">{stats.pendingContacts || 0}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div>
            <h2 className="page-title">Kelola Courses</h2>

            <div className="form-card">
              <h3>{editingCourse ? "Edit Course" : "Tambah Course Baru"}</h3>
              <div className="course-form">
                <input
                  placeholder="Judul Course"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="admin-input"
                />
                <input
                  placeholder="Slug (URL-friendly)"
                  value={courseSlug}
                  onChange={(e) => setCourseSlug(e.target.value)}
                  className="admin-input"
                />
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="admin-input"
                >
                  <option value="hairstyle">Hairstyle</option>
                  <option value="salon">Salon</option>
                  <option value="treatment">Treatment</option>
                  <option value="tatarias">Tatarias</option>
                </select>
                <textarea
                  placeholder="Deskripsi"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="admin-textarea"
                />
                <div className="image-upload-section">
                  <label>Gambar Course</label>
                  {courseImage ? (
                    <div className="current-image">
                      <img
                        src={courseImage}
                        alt="Course"
                        style={{ maxWidth: "200px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setUploadingImage(!uploadingImage)}
                        className="admin-button"
                      >
                        {uploadingImage ? "Batal" : "Ganti Gambar"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setUploadingImage(true)}
                      className="admin-button"
                    >
                      Upload Gambar
                    </button>
                  )}

                  {uploadingImage && (
                    <ImageUpload
                      currentImage={courseImage}
                      uploadType="course"
                      onUploadSuccess={handleImageUploadSuccess}
                    />
                  )}

                  <input
                    placeholder="Atau masukkan URL Gambar"
                    value={courseImage}
                    onChange={(e) => setCourseImage(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <input
                  placeholder="URL Video"
                  value={courseVideo}
                  onChange={(e) => setCourseVideo(e.target.value)}
                  className="admin-input"
                />
                <div className="button-group">
                  <button onClick={handleCourseSubmit} className="admin-button">
                    {editingCourse ? "Update Course" : "Tambah Course"}
                  </button>
                  {editingCourse && (
                    <button
                      onClick={resetCourseForm}
                      className="admin-button cancel-button"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="table-card">
              <h3>Daftar Courses</h3>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Category</th>
                      <th>Slug</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id}>
                        <td>{course.title}</td>
                        <td>{course.category}</td>
                        <td>{course.slug}</td>
                        <td>
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="action-button edit-button"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="action-button delete-button"
                          >
                            🗑️ Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div>
            <h2 className="page-title">Pesan Kontak</h2>
            <div className="table-card">
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Judul</th>
                      <th>Pesan</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact._id}>
                        <td>{contact.email}</td>
                        <td>{contact.title}</td>
                        <td>{contact.message.substring(0, 50)}...</td>
                        <td>
                          <span className={`status-badge ${contact.status}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td>
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {contact.status === "pending" && (
                            <button
                              onClick={() =>
                                updateContactStatus(contact._id, "read")
                              }
                              className="action-button read-button"
                            >
                              ✅ Tandai Dibaca
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
