import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/AdminPanel.css";
import ImageUpload from "../components/ImageUpload";

const API_URL = "http://localhost:5000/api";

// ─── Factory helpers untuk state awal ──────────────────────────────────────
const emptyMC = () => ({
  question: "",
  image: "",
  options: ["", "", "", ""],
  answer: 0,
});
const emptyEssay = () => ({ question: "", image: "", keyWords: [] });
const emptyMaterial = () => ({
  title: "",
  image: "",
  description: "",
  sections: [],
});
const emptySection = () => ({ subTitle: "", image: "", description: "" });
const emptyVideoSection = () => ({ sectionTitle: "", videos: [] });
const emptyVideo = () => ({ title: "", url: "" });
const emptyTool = () => ({ title: "", description: "", categories: [] });
const emptyToolCategory = () => ({ title: "", description: "", items: [] });
const emptyToolItem = () => ({ subtitle: "", image: "", description: "" });
const emptyContent = () => ({
  ringkasan: "",
  tujuan: [],
  materi: [],
  metode: [],
  durasi: "",
  target: [],
  evaluasi: [],
  sertifikasi: "",
});

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  // ─── Data States ──────────────────────────────────────────────────────────
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [quizResults, setQuizResults] = useState([]);

  // ─── Course Form States ───────────────────────────────────────────────────
  const [courseFormTab, setCourseFormTab] = useState("basic");
  const [editingCourse, setEditingCourse] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Basic fields
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  const [courseCategory, setCourseCategory] = useState("hairstyle");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [courseVideo, setCourseVideo] = useState("");

  // Nested fields
  const [courseContent, setCourseContent] = useState(emptyContent());
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [courseVideos, setCourseVideos] = useState([]);
  const [courseTools, setCourseTools] = useState([]);

  // ─── Quiz States ──────────────────────────────────────────────────────────
  const [quizCourseId, setQuizCourseId] = useState("");
  const [existingQuizId, setExistingQuizId] = useState(null);
  const [quizSubTab, setQuizSubTab] = useState("mc");
  const [mcQuestions, setMcQuestions] = useState([]);
  const [essayQuestions, setEssayQuestions] = useState([]);
  const [quizLoaded, setQuizLoaded] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // ─── Auth Check ───────────────────────────────────────────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (!savedToken || userRole !== "admin") {
      alert("Akses ditolak. Silakan login sebagai admin.");
      navigate("/login");
      return;
    }
    setToken(savedToken);
  }, [navigate]);

  // ─── Fetch Functions ──────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(await res.json());
    } catch (e) {
      console.error("fetchStats:", e);
    }
  }, [token]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/courses`);
      setCourses(await res.json());
    } catch (e) {
      console.error("fetchCourses:", e);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(await res.json());
    } catch (e) {
      console.error("fetchContacts:", e);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(await res.json());
    } catch (e) {
      console.error("fetchUsers:", e);
    }
  }, [token]);

  const fetchQuizResults = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/quiz-results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizResults(await res.json());
    } catch (e) {
      console.error("fetchQuizResults:", e);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchCourses();
      fetchContacts();
      fetchUsers();
      fetchQuizResults();
    }
  }, [
    token,
    fetchStats,
    fetchCourses,
    fetchContacts,
    fetchUsers,
    fetchQuizResults,
  ]);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    ["token", "userId", "userName", "userRole"].forEach((k) =>
      localStorage.removeItem(k),
    );
    navigate("/login");
  };

  // =========================================================================
  // COURSE HANDLERS
  // =========================================================================

  const resetCourseForm = () => {
    setCourseTitle("");
    setCourseSlug("");
    setCourseCategory("hairstyle");
    setCourseDescription("");
    setCourseImage("");
    setCourseVideo("");
    setCourseContent(emptyContent());
    setCourseMaterials([]);
    setCourseVideos([]);
    setCourseTools([]);
    setEditingCourse(null);
    setCourseFormTab("basic");
    setUploadingImage(false);
  };

  const handleEditCourse = (course) => {
    setCourseTitle(course.title || "");
    setCourseSlug(course.slug || "");
    setCourseCategory(course.category || "hairstyle");
    setCourseDescription(course.description || "");
    setCourseImage(course.image || "");
    setCourseVideo(course.videoUrl || "");
    setCourseContent(course.content || emptyContent());
    setCourseMaterials(course.materials || []);
    setCourseVideos(course.videos || []);
    setCourseTools(course.tools || []);
    setEditingCourse(course);
    setCourseFormTab("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCourseSubmit = async () => {
    if (!courseTitle || !courseSlug) {
      alert("Judul dan slug wajib diisi");
      return;
    }
    try {
      const courseData = {
        title: courseTitle,
        slug: courseSlug,
        category: courseCategory,
        description: courseDescription,
        image: courseImage,
        videoUrl: courseVideo,
        content: courseContent,
        materials: courseMaterials,
        videos: courseVideos,
        tools: courseTools,
      };

      const url = editingCourse
        ? `${API_URL}/courses/${editingCourse._id}`
        : `${API_URL}/courses`;
      const method = editingCourse ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchCourses();
        resetCourseForm();
      } else {
        alert(data.message || "Operasi gagal");
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Yakin ingin menghapus course ini?")) return;
    try {
      const res = await fetch(`${API_URL}/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Course berhasil dihapus");
        fetchCourses();
        fetchStats();
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setCourseImage(imageUrl);
    setUploadingImage(false);
  };

  // ─── Content (ringkasan, tujuan, materi, dll) ─────────────────────────────
  const updateContent = (field, value) =>
    setCourseContent((prev) => ({ ...prev, [field]: value }));

  const addToContentArray = (field) =>
    setCourseContent((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));

  const updateContentArray = (field, idx, value) =>
    setCourseContent((prev) => {
      const arr = [...(prev[field] || [])];
      arr[idx] = value;
      return { ...prev, [field]: arr };
    });

  const removeFromContentArray = (field, idx) =>
    setCourseContent((prev) => {
      const arr = [...(prev[field] || [])];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });

  // Materi nested (title + items[])
  const addMateri = () =>
    setCourseContent((prev) => ({
      ...prev,
      materi: [...(prev.materi || []), { title: "", items: [] }],
    }));

  const updateMateriTitle = (mIdx, value) =>
    setCourseContent((prev) => {
      const arr = [...prev.materi];
      arr[mIdx] = { ...arr[mIdx], title: value };
      return { ...prev, materi: arr };
    });

  const removeMateri = (mIdx) =>
    setCourseContent((prev) => {
      const arr = [...prev.materi];
      arr.splice(mIdx, 1);
      return { ...prev, materi: arr };
    });

  const addMateriItem = (mIdx) =>
    setCourseContent((prev) => {
      const arr = [...prev.materi];
      arr[mIdx] = { ...arr[mIdx], items: [...arr[mIdx].items, ""] };
      return { ...prev, materi: arr };
    });

  const updateMateriItem = (mIdx, iIdx, value) =>
    setCourseContent((prev) => {
      const arr = [...prev.materi];
      const items = [...arr[mIdx].items];
      items[iIdx] = value;
      arr[mIdx] = { ...arr[mIdx], items };
      return { ...prev, materi: arr };
    });

  const removeMateriItem = (mIdx, iIdx) =>
    setCourseContent((prev) => {
      const arr = [...prev.materi];
      arr[mIdx] = {
        ...arr[mIdx],
        items: arr[mIdx].items.filter((_, i) => i !== iIdx),
      };
      return { ...prev, materi: arr };
    });

  // ─── Materials ────────────────────────────────────────────────────────────
  const addMaterial = () =>
    setCourseMaterials((prev) => [...prev, emptyMaterial()]);

  const updateMaterial = (idx, field, value) =>
    setCourseMaterials((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], [field]: value };
      return arr;
    });

  const removeMaterial = (idx) =>
    setCourseMaterials((prev) => prev.filter((_, i) => i !== idx));

  const addSection = (mIdx) =>
    setCourseMaterials((prev) => {
      const arr = [...prev];
      arr[mIdx] = {
        ...arr[mIdx],
        sections: [...arr[mIdx].sections, emptySection()],
      };
      return arr;
    });

  const updateSection = (mIdx, sIdx, field, value) =>
    setCourseMaterials((prev) => {
      const arr = [...prev];
      const sections = [...arr[mIdx].sections];
      sections[sIdx] = { ...sections[sIdx], [field]: value };
      arr[mIdx] = { ...arr[mIdx], sections };
      return arr;
    });

  const removeSection = (mIdx, sIdx) =>
    setCourseMaterials((prev) => {
      const arr = [...prev];
      arr[mIdx] = {
        ...arr[mIdx],
        sections: arr[mIdx].sections.filter((_, i) => i !== sIdx),
      };
      return arr;
    });

  // ─── Videos ───────────────────────────────────────────────────────────────
  const addVideoSection = () =>
    setCourseVideos((prev) => [...prev, emptyVideoSection()]);

  const updateVideoSection = (idx, field, value) =>
    setCourseVideos((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], [field]: value };
      return arr;
    });

  const removeVideoSection = (idx) =>
    setCourseVideos((prev) => prev.filter((_, i) => i !== idx));

  const addVideoToSection = (sIdx) =>
    setCourseVideos((prev) => {
      const arr = [...prev];
      arr[sIdx] = {
        ...arr[sIdx],
        videos: [...arr[sIdx].videos, emptyVideo()],
      };
      return arr;
    });

  const updateVideoInSection = (sIdx, vIdx, field, value) =>
    setCourseVideos((prev) => {
      const arr = [...prev];
      const videos = [...arr[sIdx].videos];
      videos[vIdx] = { ...videos[vIdx], [field]: value };
      arr[sIdx] = { ...arr[sIdx], videos };
      return arr;
    });

  const removeVideoFromSection = (sIdx, vIdx) =>
    setCourseVideos((prev) => {
      const arr = [...prev];
      arr[sIdx] = {
        ...arr[sIdx],
        videos: arr[sIdx].videos.filter((_, i) => i !== vIdx),
      };
      return arr;
    });

  // ─── Tools ────────────────────────────────────────────────────────────────
  const addTool = () => setCourseTools((prev) => [...prev, emptyTool()]);

  const updateTool = (idx, field, value) =>
    setCourseTools((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], [field]: value };
      return arr;
    });

  const removeTool = (idx) =>
    setCourseTools((prev) => prev.filter((_, i) => i !== idx));

  const addToolCategory = (tIdx) =>
    setCourseTools((prev) => {
      const arr = [...prev];
      arr[tIdx] = {
        ...arr[tIdx],
        categories: [...arr[tIdx].categories, emptyToolCategory()],
      };
      return arr;
    });

  const updateToolCategory = (tIdx, cIdx, field, value) =>
    setCourseTools((prev) => {
      const arr = [...prev];
      const cats = [...arr[tIdx].categories];
      cats[cIdx] = { ...cats[cIdx], [field]: value };
      arr[tIdx] = { ...arr[tIdx], categories: cats };
      return arr;
    });

  const removeToolCategory = (tIdx, cIdx) =>
    setCourseTools((prev) => {
      const arr = [...prev];
      arr[tIdx] = {
        ...arr[tIdx],
        categories: arr[tIdx].categories.filter((_, i) => i !== cIdx),
      };
      return arr;
    });

  const addToolItem = (tIdx, cIdx) =>
    setCourseTools((prev) => {
      const arr = [...prev];
      const cats = [...arr[tIdx].categories];
      cats[cIdx] = {
        ...cats[cIdx],
        items: [...cats[cIdx].items, emptyToolItem()],
      };
      arr[tIdx] = { ...arr[tIdx], categories: cats };
      return arr;
    });

  const updateToolItem = (tIdx, cIdx, iIdx, field, value) =>
    setCourseTools((prev) => {
      const arr = [...prev];
      const cats = [...arr[tIdx].categories];
      const items = [...cats[cIdx].items];
      items[iIdx] = { ...items[iIdx], [field]: value };
      cats[cIdx] = { ...cats[cIdx], items };
      arr[tIdx] = { ...arr[tIdx], categories: cats };
      return arr;
    });

  const removeToolItem = (tIdx, cIdx, iIdx) =>
    setCourseTools((prev) => {
      const arr = [...prev];
      const cats = [...arr[tIdx].categories];
      cats[cIdx] = {
        ...cats[cIdx],
        items: cats[cIdx].items.filter((_, i) => i !== iIdx),
      };
      arr[tIdx] = { ...arr[tIdx], categories: cats };
      return arr;
    });

  // =========================================================================
  // CONTACT HANDLERS
  // =========================================================================

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
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pesan ini?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchContacts();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // =========================================================================
  // USER HANDLERS
  // =========================================================================

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchUsers();
        fetchStats();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  // =========================================================================
  // QUIZ HANDLERS
  // =========================================================================

  const handleLoadQuiz = async () => {
    if (!quizCourseId) return;
    setLoadingQuiz(true);
    setQuizLoaded(false);
    try {
      const res = await fetch(`${API_URL}/quiz/course/${quizCourseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExistingQuizId(data._id);
        setMcQuestions(data.multipleChoice || []);
        setEssayQuestions(data.essay || []);
      } else {
        // 404 = belum ada quiz, mulai kosong
        setExistingQuizId(null);
        setMcQuestions([]);
        setEssayQuestions([]);
      }
      setQuizLoaded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!quizCourseId) return alert("Pilih course terlebih dahulu");
    try {
      const res = await fetch(`${API_URL}/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: quizCourseId,
          multipleChoice: mcQuestions,
          essay: essayQuestions,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        // Reload untuk update existingQuizId jika baru dibuat
        handleLoadQuiz();
        fetchStats();
      } else {
        alert(data.message || "Gagal menyimpan quiz");
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!existingQuizId) return;
    if (
      !window.confirm(
        "Yakin ingin menghapus seluruh quiz ini beserta hasilnya?",
      )
    )
      return;
    try {
      const res = await fetch(`${API_URL}/admin/quizzes/${existingQuizId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Quiz berhasil dihapus");
        setExistingQuizId(null);
        setMcQuestions([]);
        setEssayQuestions([]);
        setQuizLoaded(false);
        setQuizCourseId("");
        fetchStats();
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  // MC helpers
  const addMC = () => setMcQuestions((prev) => [...prev, emptyMC()]);
  const removeMC = (idx) =>
    setMcQuestions((prev) => prev.filter((_, i) => i !== idx));
  const updateMC = (idx, field, value) =>
    setMcQuestions((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], [field]: value };
      return arr;
    });
  const updateMCOption = (qIdx, oIdx, value) =>
    setMcQuestions((prev) => {
      const arr = [...prev];
      const options = [...arr[qIdx].options];
      options[oIdx] = value;
      arr[qIdx] = { ...arr[qIdx], options };
      return arr;
    });

  // Essay helpers
  const addEssay = () => setEssayQuestions((prev) => [...prev, emptyEssay()]);
  const removeEssay = (idx) =>
    setEssayQuestions((prev) => prev.filter((_, i) => i !== idx));
  const updateEssay = (idx, field, value) =>
    setEssayQuestions((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], [field]: value };
      return arr;
    });
  const updateEssayKeywords = (idx, raw) =>
    setEssayQuestions((prev) => {
      const arr = [...prev];
      arr[idx] = {
        ...arr[idx],
        keyWords: raw
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      };
      return arr;
    });

  // =========================================================================
  // RENDER
  // =========================================================================

  const TABS = [
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "courses", label: "📚 Courses" },
    { key: "quiz", label: "📝 Quiz" },
    { key: "quiz-results", label: "🏆 Hasil Quiz" },
    { key: "users", label: "👥 Users" },
    { key: "contacts", label: "📧 Contacts" },
  ];

  const COURSE_FORM_TABS = ["basic", "content", "materials", "videos", "tools"];

  return (
    <>
      <Navbar />
      <div className="admin-container">
        {/* ── Sidebar ── */}
        <div className="admin-sidebar">
          <h2 className="sidebar-title">LMS Admin</h2>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`nav-button ${activeTab === key ? "active" : ""}`}
            >
              {label}
            </button>
          ))}
          <button onClick={handleLogout} className="nav-button logout-button">
            🚪 Logout
          </button>
        </div>

        {/* ── Main Content ── */}
        <div className="admin-content">
          {/* ════════════════════════════════════════════
              DASHBOARD
          ════════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <div>
              <h2 className="page-title">Dashboard</h2>
              <div className="stats-grid">
                {[
                  { label: "Total Users", value: stats.totalUsers },
                  { label: "Total Courses", value: stats.totalCourses },
                  { label: "Quiz Submissions", value: stats.totalQuizzes },
                  { label: "Pending Contacts", value: stats.pendingContacts },
                ].map(({ label, value }) => (
                  <div key={label} className="stat-card">
                    <h3>{label}</h3>
                    <p className="stat-number">{value || 0}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════
              COURSES
          ════════════════════════════════════════════ */}
          {activeTab === "courses" && (
            <div>
              <h2 className="page-title">Kelola Courses</h2>

              {/* Form Card */}
              <div className="form-card">
                <h3>
                  {editingCourse
                    ? `Edit: ${editingCourse.title}`
                    : "Tambah Course Baru"}
                </h3>

                {/* Sub-tabs */}
                <div className="form-subtabs">
                  {COURSE_FORM_TABS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setCourseFormTab(t)}
                      className={`subtab-button ${courseFormTab === t ? "active" : ""}`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>

                {/* ── Tab: Basic ── */}
                {courseFormTab === "basic" && (
                  <div className="course-form">
                    <input
                      placeholder="Judul Course *"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="admin-input"
                    />
                    <input
                      placeholder="Slug (URL-friendly) *"
                      value={courseSlug}
                      onChange={(e) => setCourseSlug(e.target.value)}
                      className="admin-input"
                    />
                    <select
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                      className="admin-input"
                    >
                      {["hairstyle", "salon", "treatment", "tatarias"].map(
                        (c) => (
                          <option key={c} value={c}>
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                          </option>
                        ),
                      )}
                    </select>
                    <textarea
                      placeholder="Deskripsi singkat course"
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      className="admin-textarea"
                    />
                    <input
                      placeholder="URL Video Utama"
                      value={courseVideo}
                      onChange={(e) => setCourseVideo(e.target.value)}
                      className="admin-input"
                    />

                    {/* Image upload */}
                    <div className="image-upload-section">
                      <label className="field-label">Gambar Course</label>
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
                        placeholder="Atau masukkan URL Gambar langsung"
                        value={courseImage}
                        onChange={(e) => setCourseImage(e.target.value)}
                        className="admin-input"
                      />
                    </div>
                  </div>
                )}

                {/* ── Tab: Content ── */}
                {courseFormTab === "content" && (
                  <div className="course-form">
                    <label className="field-label">Ringkasan</label>
                    <textarea
                      placeholder="Ringkasan course secara keseluruhan"
                      value={courseContent.ringkasan || ""}
                      onChange={(e) =>
                        updateContent("ringkasan", e.target.value)
                      }
                      className="admin-textarea"
                    />

                    <label className="field-label">Durasi</label>
                    <input
                      placeholder="Contoh: 3 bulan / 120 jam"
                      value={courseContent.durasi || ""}
                      onChange={(e) => updateContent("durasi", e.target.value)}
                      className="admin-input"
                    />

                    <label className="field-label">Sertifikasi</label>
                    <input
                      placeholder="Nama atau jenis sertifikasi"
                      value={courseContent.sertifikasi || ""}
                      onChange={(e) =>
                        updateContent("sertifikasi", e.target.value)
                      }
                      className="admin-input"
                    />

                    {/* Repeatable array fields */}
                    {[
                      {
                        field: "tujuan",
                        label: "Tujuan Pembelajaran",
                        ph: "Tambah tujuan...",
                      },
                      {
                        field: "metode",
                        label: "Metode Pembelajaran",
                        ph: "Tambah metode...",
                      },
                      {
                        field: "target",
                        label: "Target Peserta",
                        ph: "Tambah target...",
                      },
                      {
                        field: "evaluasi",
                        label: "Evaluasi",
                        ph: "Tambah evaluasi...",
                      },
                    ].map(({ field, label, ph }) => (
                      <div key={field} className="array-field-group">
                        <label className="field-label">{label}</label>
                        {(courseContent[field] || []).map((item, idx) => (
                          <div key={idx} className="array-item-row">
                            <input
                              value={item}
                              onChange={(e) =>
                                updateContentArray(field, idx, e.target.value)
                              }
                              placeholder={ph}
                              className="admin-input"
                            />
                            <button
                              onClick={() => removeFromContentArray(field, idx)}
                              className="btn-remove"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addToContentArray(field)}
                          className="btn-add-small"
                        >
                          + Tambah {label}
                        </button>
                      </div>
                    ))}

                    {/* Materi (nested: title + items[]) */}
                    <div className="array-field-group">
                      <label className="field-label">Materi (Bab)</label>
                      {(courseContent.materi || []).map((mat, mIdx) => (
                        <div key={mIdx} className="nested-card">
                          <div className="nested-card-header">
                            <span>Bab {mIdx + 1}</span>
                            <button
                              onClick={() => removeMateri(mIdx)}
                              className="btn-remove"
                            >
                              ✕ Hapus Bab
                            </button>
                          </div>
                          <input
                            placeholder="Judul bab"
                            value={mat.title}
                            onChange={(e) =>
                              updateMateriTitle(mIdx, e.target.value)
                            }
                            className="admin-input"
                          />
                          <label
                            className="field-label"
                            style={{ marginTop: 8 }}
                          >
                            Item Materi
                          </label>
                          {(mat.items || []).map((item, iIdx) => (
                            <div key={iIdx} className="array-item-row sub-item">
                              <input
                                placeholder="Item materi"
                                value={item}
                                onChange={(e) =>
                                  updateMateriItem(mIdx, iIdx, e.target.value)
                                }
                                className="admin-input"
                              />
                              <button
                                onClick={() => removeMateriItem(mIdx, iIdx)}
                                className="btn-remove"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addMateriItem(mIdx)}
                            className="btn-add-small"
                          >
                            + Tambah Item
                          </button>
                        </div>
                      ))}
                      <button onClick={addMateri} className="btn-add-small">
                        + Tambah Bab
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Tab: Materials ── */}
                {courseFormTab === "materials" && (
                  <div className="course-form">
                    {courseMaterials.length === 0 && (
                      <p className="empty-hint">
                        Belum ada material. Klik tombol di bawah untuk menambah.
                      </p>
                    )}
                    {courseMaterials.map((mat, mIdx) => (
                      <div key={mIdx} className="nested-card">
                        <div className="nested-card-header">
                          <span>Material {mIdx + 1}</span>
                          <button
                            onClick={() => removeMaterial(mIdx)}
                            className="btn-remove"
                          >
                            ✕ Hapus
                          </button>
                        </div>
                        <input
                          placeholder="Judul material"
                          value={mat.title}
                          onChange={(e) =>
                            updateMaterial(mIdx, "title", e.target.value)
                          }
                          className="admin-input"
                        />
                        <input
                          placeholder="URL Gambar"
                          value={mat.image}
                          onChange={(e) =>
                            updateMaterial(mIdx, "image", e.target.value)
                          }
                          className="admin-input"
                        />
                        <textarea
                          placeholder="Deskripsi material"
                          value={mat.description}
                          onChange={(e) =>
                            updateMaterial(mIdx, "description", e.target.value)
                          }
                          className="admin-textarea"
                        />

                        <label className="field-label" style={{ marginTop: 8 }}>
                          Sections
                        </label>
                        {(mat.sections || []).map((sec, sIdx) => (
                          <div key={sIdx} className="nested-card sub-nested">
                            <div className="nested-card-header">
                              <span className="sub-label">
                                Section {sIdx + 1}
                              </span>
                              <button
                                onClick={() => removeSection(mIdx, sIdx)}
                                className="btn-remove"
                              >
                                ✕
                              </button>
                            </div>
                            <input
                              placeholder="Sub Judul"
                              value={sec.subTitle}
                              onChange={(e) =>
                                updateSection(
                                  mIdx,
                                  sIdx,
                                  "subTitle",
                                  e.target.value,
                                )
                              }
                              className="admin-input"
                            />
                            <input
                              placeholder="URL Gambar"
                              value={sec.image}
                              onChange={(e) =>
                                updateSection(
                                  mIdx,
                                  sIdx,
                                  "image",
                                  e.target.value,
                                )
                              }
                              className="admin-input"
                            />
                            <textarea
                              placeholder="Deskripsi section"
                              value={sec.description}
                              onChange={(e) =>
                                updateSection(
                                  mIdx,
                                  sIdx,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="admin-textarea"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => addSection(mIdx)}
                          className="btn-add-small"
                        >
                          + Tambah Section
                        </button>
                      </div>
                    ))}
                    <button onClick={addMaterial} className="admin-button">
                      + Tambah Material
                    </button>
                  </div>
                )}

                {/* ── Tab: Videos ── */}
                {courseFormTab === "videos" && (
                  <div className="course-form">
                    {courseVideos.length === 0 && (
                      <p className="empty-hint">
                        Belum ada seksi video. Klik tombol di bawah untuk
                        menambah.
                      </p>
                    )}
                    {courseVideos.map((sec, sIdx) => (
                      <div key={sIdx} className="nested-card">
                        <div className="nested-card-header">
                          <span>Seksi {sIdx + 1}</span>
                          <button
                            onClick={() => removeVideoSection(sIdx)}
                            className="btn-remove"
                          >
                            ✕ Hapus Seksi
                          </button>
                        </div>
                        <input
                          placeholder="Judul Seksi Video"
                          value={sec.sectionTitle}
                          onChange={(e) =>
                            updateVideoSection(
                              sIdx,
                              "sectionTitle",
                              e.target.value,
                            )
                          }
                          className="admin-input"
                        />
                        <label className="field-label" style={{ marginTop: 8 }}>
                          Video
                        </label>
                        {(sec.videos || []).map((vid, vIdx) => (
                          <div key={vIdx} className="nested-card sub-nested">
                            <div className="nested-card-header">
                              <span className="sub-label">
                                Video {vIdx + 1}
                              </span>
                              <button
                                onClick={() =>
                                  removeVideoFromSection(sIdx, vIdx)
                                }
                                className="btn-remove"
                              >
                                ✕
                              </button>
                            </div>
                            <input
                              placeholder="Judul Video"
                              value={vid.title}
                              onChange={(e) =>
                                updateVideoInSection(
                                  sIdx,
                                  vIdx,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className="admin-input"
                            />
                            <input
                              placeholder="URL Video (YouTube/embed)"
                              value={vid.url}
                              onChange={(e) =>
                                updateVideoInSection(
                                  sIdx,
                                  vIdx,
                                  "url",
                                  e.target.value,
                                )
                              }
                              className="admin-input"
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => addVideoToSection(sIdx)}
                          className="btn-add-small"
                        >
                          + Tambah Video
                        </button>
                      </div>
                    ))}
                    <button onClick={addVideoSection} className="admin-button">
                      + Tambah Seksi Video
                    </button>
                  </div>
                )}

                {/* ── Tab: Tools ── */}
                {courseFormTab === "tools" && (
                  <div className="course-form">
                    {courseTools.length === 0 && (
                      <p className="empty-hint">
                        Belum ada alat/peralatan. Klik tombol di bawah untuk
                        menambah.
                      </p>
                    )}
                    {courseTools.map((tool, tIdx) => (
                      <div key={tIdx} className="nested-card">
                        <div className="nested-card-header">
                          <span>Alat {tIdx + 1}</span>
                          <button
                            onClick={() => removeTool(tIdx)}
                            className="btn-remove"
                          >
                            ✕ Hapus
                          </button>
                        </div>
                        <input
                          placeholder="Judul alat / kategori besar"
                          value={tool.title}
                          onChange={(e) =>
                            updateTool(tIdx, "title", e.target.value)
                          }
                          className="admin-input"
                        />
                        <textarea
                          placeholder="Deskripsi"
                          value={tool.description}
                          onChange={(e) =>
                            updateTool(tIdx, "description", e.target.value)
                          }
                          className="admin-textarea"
                        />

                        <label className="field-label" style={{ marginTop: 8 }}>
                          Kategori
                        </label>
                        {(tool.categories || []).map((cat, cIdx) => (
                          <div key={cIdx} className="nested-card sub-nested">
                            <div className="nested-card-header">
                              <span className="sub-label">
                                Kategori {cIdx + 1}
                              </span>
                              <button
                                onClick={() => removeToolCategory(tIdx, cIdx)}
                                className="btn-remove"
                              >
                                ✕
                              </button>
                            </div>
                            <input
                              placeholder="Judul Kategori"
                              value={cat.title}
                              onChange={(e) =>
                                updateToolCategory(
                                  tIdx,
                                  cIdx,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className="admin-input"
                            />
                            <textarea
                              placeholder="Deskripsi Kategori"
                              value={cat.description}
                              onChange={(e) =>
                                updateToolCategory(
                                  tIdx,
                                  cIdx,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="admin-textarea"
                            />

                            <label
                              className="field-label"
                              style={{ marginTop: 8 }}
                            >
                              Items
                            </label>
                            {(cat.items || []).map((item, iIdx) => (
                              <div
                                key={iIdx}
                                className="nested-card deep-nested"
                              >
                                <div className="nested-card-header">
                                  <span className="sub-label">
                                    Item {iIdx + 1}
                                  </span>
                                  <button
                                    onClick={() =>
                                      removeToolItem(tIdx, cIdx, iIdx)
                                    }
                                    className="btn-remove"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <input
                                  placeholder="Subtitle"
                                  value={item.subtitle}
                                  onChange={(e) =>
                                    updateToolItem(
                                      tIdx,
                                      cIdx,
                                      iIdx,
                                      "subtitle",
                                      e.target.value,
                                    )
                                  }
                                  className="admin-input"
                                />
                                <input
                                  placeholder="URL Gambar"
                                  value={item.image}
                                  onChange={(e) =>
                                    updateToolItem(
                                      tIdx,
                                      cIdx,
                                      iIdx,
                                      "image",
                                      e.target.value,
                                    )
                                  }
                                  className="admin-input"
                                />
                                <textarea
                                  placeholder="Deskripsi item"
                                  value={item.description}
                                  onChange={(e) =>
                                    updateToolItem(
                                      tIdx,
                                      cIdx,
                                      iIdx,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  className="admin-textarea"
                                />
                              </div>
                            ))}
                            <button
                              onClick={() => addToolItem(tIdx, cIdx)}
                              className="btn-add-small"
                            >
                              + Tambah Item
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addToolCategory(tIdx)}
                          className="btn-add-small"
                        >
                          + Tambah Kategori
                        </button>
                      </div>
                    ))}
                    <button onClick={addTool} className="admin-button">
                      + Tambah Alat
                    </button>
                  </div>
                )}

                {/* Save / Cancel */}
                <div
                  className="button-group"
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <button onClick={handleCourseSubmit} className="admin-button">
                    {editingCourse ? "💾 Update Course" : "💾 Simpan Course"}
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

              {/* Course List */}
              <div className="table-card">
                <h3>Daftar Courses ({courses.length})</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Judul</th>
                        <th>Kategori</th>
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

          {/* ════════════════════════════════════════════
              QUIZ
          ════════════════════════════════════════════ */}
          {activeTab === "quiz" && (
            <div>
              <h2 className="page-title">Kelola Quiz</h2>
              <div className="form-card">
                {/* Pilih course */}
                <div className="quiz-course-select">
                  <select
                    value={quizCourseId}
                    onChange={(e) => {
                      setQuizCourseId(e.target.value);
                      setQuizLoaded(false);
                    }}
                    className="admin-input"
                  >
                    <option value="">-- Pilih Course --</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleLoadQuiz}
                    disabled={!quizCourseId || loadingQuiz}
                    className="admin-button"
                  >
                    {loadingQuiz ? "Loading..." : "Load Quiz"}
                  </button>
                </div>

                {quizLoaded && (
                  <>
                    {/* Status bar */}
                    <div className="quiz-info-bar">
                      <span>
                        {existingQuizId
                          ? `✅ Quiz ditemukan — ${mcQuestions.length} soal pilihan ganda, ${essayQuestions.length} essay`
                          : "🆕 Belum ada quiz untuk course ini — buat baru di bawah"}
                      </span>
                      {existingQuizId && (
                        <button
                          onClick={handleDeleteQuiz}
                          className="action-button delete-button"
                        >
                          🗑️ Hapus Quiz
                        </button>
                      )}
                    </div>

                    {/* Sub-tabs: MC vs Essay */}
                    <div className="form-subtabs">
                      <button
                        onClick={() => setQuizSubTab("mc")}
                        className={`subtab-button ${quizSubTab === "mc" ? "active" : ""}`}
                      >
                        Pilihan Ganda ({mcQuestions.length})
                      </button>
                      <button
                        onClick={() => setQuizSubTab("essay")}
                        className={`subtab-button ${quizSubTab === "essay" ? "active" : ""}`}
                      >
                        Essay ({essayQuestions.length})
                      </button>
                    </div>

                    {/* ── MC Questions ── */}
                    {quizSubTab === "mc" && (
                      <div>
                        {mcQuestions.length === 0 && (
                          <p className="empty-hint">
                            Belum ada soal pilihan ganda.
                          </p>
                        )}
                        {mcQuestions.map((q, qIdx) => (
                          <div key={qIdx} className="nested-card">
                            <div className="nested-card-header">
                              <span>Soal {qIdx + 1}</span>
                              <button
                                onClick={() => removeMC(qIdx)}
                                className="btn-remove"
                              >
                                ✕ Hapus
                              </button>
                            </div>
                            <input
                              placeholder="Pertanyaan"
                              value={q.question}
                              onChange={(e) =>
                                updateMC(qIdx, "question", e.target.value)
                              }
                              className="admin-input"
                            />
                            <input
                              placeholder="URL Gambar soal (opsional)"
                              value={q.image || ""}
                              onChange={(e) =>
                                updateMC(qIdx, "image", e.target.value)
                              }
                              className="admin-input"
                            />
                            <label className="field-label">
                              Pilihan jawaban — klik radio untuk tandai jawaban
                              benar
                            </label>
                            {(q.options || ["", "", "", ""]).map(
                              (opt, oIdx) => (
                                <div key={oIdx} className="mc-option-row">
                                  <input
                                    type="radio"
                                    name={`mc-answer-${qIdx}`}
                                    checked={q.answer === oIdx}
                                    onChange={() =>
                                      updateMC(qIdx, "answer", oIdx)
                                    }
                                    className="mc-radio"
                                  />
                                  <span
                                    className={`option-label ${q.answer === oIdx ? "correct" : ""}`}
                                  >
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <input
                                    placeholder={`Pilihan ${String.fromCharCode(65 + oIdx)}`}
                                    value={opt}
                                    onChange={(e) =>
                                      updateMCOption(qIdx, oIdx, e.target.value)
                                    }
                                    className="admin-input"
                                  />
                                </div>
                              ),
                            )}
                          </div>
                        ))}
                        <button onClick={addMC} className="admin-button">
                          + Tambah Soal
                        </button>
                      </div>
                    )}

                    {/* ── Essay Questions ── */}
                    {quizSubTab === "essay" && (
                      <div>
                        {essayQuestions.length === 0 && (
                          <p className="empty-hint">Belum ada soal essay.</p>
                        )}
                        {essayQuestions.map((q, qIdx) => (
                          <div key={qIdx} className="nested-card">
                            <div className="nested-card-header">
                              <span>Essay {qIdx + 1}</span>
                              <button
                                onClick={() => removeEssay(qIdx)}
                                className="btn-remove"
                              >
                                ✕ Hapus
                              </button>
                            </div>
                            <input
                              placeholder="Pertanyaan essay"
                              value={q.question}
                              onChange={(e) =>
                                updateEssay(qIdx, "question", e.target.value)
                              }
                              className="admin-input"
                            />
                            <input
                              placeholder="URL Gambar soal (opsional)"
                              value={q.image || ""}
                              onChange={(e) =>
                                updateEssay(qIdx, "image", e.target.value)
                              }
                              className="admin-input"
                            />
                            <input
                              placeholder="Kata kunci jawaban — pisahkan dengan koma"
                              value={(q.keyWords || []).join(", ")}
                              onChange={(e) =>
                                updateEssayKeywords(qIdx, e.target.value)
                              }
                              className="admin-input"
                            />
                            {(q.keyWords || []).length > 0 && (
                              <div className="keyword-tags">
                                {q.keyWords.map((kw, ki) => (
                                  <span key={ki} className="keyword-tag">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        <button onClick={addEssay} className="admin-button">
                          + Tambah Soal Essay
                        </button>
                      </div>
                    )}

                    {/* Simpan */}
                    <div
                      className="button-group"
                      style={{
                        marginTop: "20px",
                        paddingTop: "16px",
                        borderTop: "1px solid #eee",
                      }}
                    >
                      <button onClick={handleSaveQuiz} className="admin-button">
                        💾 Simpan Quiz
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════
              USERS
          ════════════════════════════════════════════ */}
          {activeTab === "users" && (
            <div>
              <h2 className="page-title">Kelola Users ({users.length})</h2>
              <div className="table-card">
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Courses Diikuti</th>
                        <th>Bergabung</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="user-cell">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="user-avatar-small"
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
                              />
                              {user.name}
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`status-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{user.enrolledCourses?.length || 0} course</td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString(
                              "id-ID",
                            )}
                          </td>
                          <td>
                            {user.role !== "admin" ? (
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="action-button delete-button"
                              >
                                🗑️ Hapus
                              </button>
                            ) : (
                              <span className="protected-label">Protected</span>
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

          {/* ════════════════════════════════════════════
              CONTACTS
          ════════════════════════════════════════════ */}
          {activeTab === "contacts" && (
            <div>
              <h2 className="page-title">Pesan Kontak ({contacts.length})</h2>
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
                            {new Date(contact.createdAt).toLocaleDateString(
                              "id-ID",
                            )}
                          </td>
                          <td className="action-cell">
                            {contact.status === "pending" && (
                              <button
                                onClick={() =>
                                  updateContactStatus(contact._id, "read")
                                }
                                className="action-button read-button"
                              >
                                ✅ Dibaca
                              </button>
                            )}
                            {contact.status === "read" && (
                              <button
                                onClick={() =>
                                  updateContactStatus(contact._id, "replied")
                                }
                                className="action-button reply-button"
                              >
                                ↩️ Replied
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteContact(contact._id)}
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

          {/* ════════════════════════════════════════════
              QUIZ RESULTS
          ════════════════════════════════════════════ */}
          {activeTab === "quiz-results" && (
            <div>
              <h2 className="page-title">Hasil Quiz ({quizResults.length})</h2>

              {/* Summary cards */}
              <div
                className="stats-grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  marginBottom: "30px",
                }}
              >
                <div className="stat-card">
                  <h3>Total Pengerjaan</h3>
                  <p className="stat-number">{quizResults.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Rata-rata Skor</h3>
                  <p className="stat-number">
                    {quizResults.length > 0
                      ? Math.round(
                          quizResults.reduce((sum, r) => sum + r.score, 0) /
                            quizResults.length,
                        )
                      : 0}
                  </p>
                </div>
                <div className="stat-card">
                  <h3>Skor Tertinggi</h3>
                  <p className="stat-number">
                    {quizResults.length > 0
                      ? Math.max(...quizResults.map((r) => r.score))
                      : 0}
                  </p>
                </div>
                <div className="stat-card">
                  <h3>Skor Terendah</h3>
                  <p className="stat-number">
                    {quizResults.length > 0
                      ? Math.min(...quizResults.map((r) => r.score))
                      : 0}
                  </p>
                </div>
              </div>

              {/* Results table */}
              <div className="table-card">
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Kategori</th>
                        <th>Skor</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            style={{
                              textAlign: "center",
                              color: "#a0aec0",
                              fontStyle: "italic",
                              padding: "30px",
                            }}
                          >
                            Belum ada hasil quiz
                          </td>
                        </tr>
                      ) : (
                        quizResults.map((result) => (
                          <tr key={result._id}>
                            <td>{result.userId?.name || "—"}</td>
                            <td>{result.userId?.email || "—"}</td>
                            <td>{result.courseId?.title || "—"}</td>
                            <td>
                              {result.courseId?.category ? (
                                <span
                                  className={`status-badge ${result.courseId.category}`}
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                  }}
                                >
                                  {result.courseId.category}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td>
                              <span
                                className="score-badge"
                                style={{
                                  display: "inline-block",
                                  padding: "4px 12px",
                                  borderRadius: "20px",
                                  fontWeight: 700,
                                  fontSize: "13px",
                                  background:
                                    result.score >= 80
                                      ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
                                      : result.score >= 60
                                        ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                                        : "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
                                  color: "white",
                                }}
                              >
                                {result.score}
                              </span>
                            </td>
                            <td>
                              {new Date(result.submittedAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
