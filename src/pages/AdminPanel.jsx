import React, { useState, useEffect, useCallback, useRef } from "react";
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
const emptyEssay = () => ({
  question: "",
  image: "",
  keyWords: [],
  keyWordsInput: "",
});
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
  image: "",
  ringkasan: "",
  tujuan: [],
  materi: [],
  metode: [],
  durasi: "",
  target: [],
  evaluasi: [],
  sertifikasi: "",
});
const emptySummary = () => ({
  pengenalan: [],
  kebutuhan: [],
  videos: [],
});
const emptySummaryPengenalan = () => ({ title: "", items: [] });
const emptySummaryVideo = () => ({ title: "", url: "" });

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem("userRole") || "",
  );

  // ─── Data States ──────────────────────────────────────────────────────────
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [enrollmentModalUser, setEnrollmentModalUser] = useState(null);
  const [selectedEnrollCourseId, setSelectedEnrollCourseId] = useState("");

  // ─── Course Form States ───────────────────────────────────────────────────
  const [courseFormTab, setCourseFormTab] = useState("basic");
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseKeywords, setCourseKeywords] = useState([]);
  const [uploadingImage, setUploadingImage] = useState({
    course: false,
    content: false,
  });
  const [unsavedImages, setUnsavedImages] = useState({
    course: null,
    content: null,
  });
  const unsavedImagesRef = useRef({ course: null, content: null });

  // Basic fields
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSlug, setCourseSlug] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [courseVideo, setCourseVideo] = useState("");

  // Nested fields
  const [courseContent, setCourseContent] = useState(emptyContent());
  const [courseSummary, setCourseSummary] = useState(emptySummary());
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
    const savedRole = localStorage.getItem("userRole"); // ⬅️ rename dari `userRole` biar tidak rancu
    if (!savedToken || !["admin", "teacher"].includes(savedRole)) {
      alert("Akses ditolak. Silakan login sebagai admin.");
      navigate("/login");
      return;
    }
    setToken(savedToken);
    setUserRole(savedRole); // ⬅️ baris baru — ini yang bikin setUserRole "terpakai"
  }, [navigate]);

  // Simpan nilai terbaru unsavedImages ke ref, dipakai cleanup saat unmount.
  // Ada 2 titik upload sekarang (course, content), jadi ref-nya juga object per-field.
  useEffect(() => {
    unsavedImagesRef.current = unsavedImages;
  }, [unsavedImages]);

  // Kalau admin keluar dari halaman admin (unmount) sambil ada upload yang belum disimpan,
  // hapus semua gambar yang masih "unsaved" itu dari Cloudinary supaya tidak jadi sampah
  useEffect(() => {
    return () => {
      Object.values(unsavedImagesRef.current || {}).forEach((url) => {
        if (url) deleteUploadedImage(url);
      });
    };
  }, []);

  // Best-effort cleanup kalau admin menutup tab / refresh paksa saat ada upload yang belum disimpan.
  // fetch() di cleanup biasa tidak dijamin selesai di skenario ini, makanya pakai sendBeacon.
  useEffect(() => {
    const handlePageHide = (event) => {
      // event.persisted === true berarti halaman masuk bfcache (bisa di-restore lewat tombol Back),
      // bukan benar-benar ditutup — jangan hapus gambar dalam kasus ini, admin mungkin masih butuh
      if (event.persisted) return;
      const pendingUrls = Object.values(unsavedImagesRef.current || {}).filter(
        Boolean,
      );
      if (pendingUrls.length === 0) return;

      const token = localStorage.getItem("token");
      // Satu beacon per gambar — payload sengaja dibuat sederhana (1 imageUrl per call)
      pendingUrls.forEach((imageUrl) => {
        const payload = JSON.stringify({ imageUrl, token });
        // text/plain, BUKAN application/json — menghindari CORS preflight untuk sendBeacon lintas origin
        const blob = new Blob([payload], { type: "text/plain" });
        navigator.sendBeacon(`${API_URL}/upload/image/beacon`, blob);
      });
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, []);

  // ─── Fetch Functions ──────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("fetchStats failed:", data?.message || res.status);
        setStats({});
        return;
      }
      setStats(data && typeof data === "object" ? data : {});
    } catch (e) {
      console.error("fetchStats:", e);
      setStats({});
    }
  }, [token]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/courses`);
      const data = await res.json();
      if (!res.ok) {
        console.error("fetchCourses failed:", data?.message || res.status);
        setCourses([]);
        return;
      }
      setCourses(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("fetchCourses:", e);
      setCourses([]);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("fetchContacts failed:", data?.message || res.status);
        setContacts([]);
        return;
      }
      setContacts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("fetchContacts:", e);
      setContacts([]);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("fetchUsers failed:", data?.message || res.status);
        setUsers([]);
        return;
      }
      // backend mungkin mengembalikan array langsung, atau { users: [...] } — tangani keduanya
      setUsers(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
            ? data.users
            : [],
      );
    } catch (e) {
      console.error("fetchUsers:", e);
      setUsers([]);
    }
  }, [token]);

  const fetchQuizResults = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/quiz-results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("fetchQuizResults failed:", data?.message || res.status);
        setQuizResults([]);
        return;
      }
      setQuizResults(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [],
      );
    } catch (e) {
      console.error("fetchQuizResults:", e);
      setQuizResults([]);
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

  const resetCourseForm = ({ cleanupUnsavedImage = true } = {}) => {
    if (cleanupUnsavedImage) {
      Object.values(unsavedImages).forEach((url) => {
        if (url) deleteUploadedImage(url);
      });
    }
    setCourseTitle("");
    setCourseSlug("");
    setCourseDescription("");
    setCourseImage("");
    setCourseVideo("");
    setCourseContent(emptyContent());
    setCourseSummary(emptySummary());
    setCourseMaterials([]);
    setCourseVideos([]);
    setCourseTools([]);
    setCourseKeywords([]);
    setEditingCourse(null);
    setCourseFormTab("basic");
    setUploadingImage({ course: false, content: false });
    setUnsavedImages({ course: null, content: null });
  };

  const handleEditCourse = (course) => {
    Object.values(unsavedImages).forEach((url) => {
      if (url) deleteUploadedImage(url);
    });
    setCourseTitle(course.title || "");
    setCourseSlug(course.slug || "");
    setCourseDescription(course.description || "");
    setCourseImage(course.image || "");
    setCourseVideo(course.videoUrl || "");
    setCourseContent(course.content || emptyContent());
    setCourseSummary(course.summary || emptySummary());
    setCourseMaterials(course.materials || []);
    setCourseVideos(course.videos || []);
    setCourseTools(course.tools || []);
    setCourseKeywords(course.searchKeywords || []);
    setEditingCourse(course);
    setCourseFormTab("basic");
    setUnsavedImages({ course: null, content: null });
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
        description: courseDescription,
        image: courseImage,
        videoUrl: courseVideo,
        searchKeywords: courseKeywords,
        summary: courseSummary,
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
        resetCourseForm({ cleanupUnsavedImage: false });
      } else {
        alert(data.message || "Operasi gagal");
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (
      !window.confirm(
        "Yakin ingin menghapus course ini?\n\nSemua siswa yang terdaftar akan otomatis dikeluarkan, quiz beserta seluruh hasil pengerjaannya akan ikut terhapus permanen, dan seluruh gambar terkait (course, materi, alat, soal) akan dihapus dari penyimpanan.",
      )
    )
      return;
    try {
      const res = await fetch(`${API_URL}/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchCourses();
        fetchStats();
        fetchUsers();
        fetchQuizResults();
        // Kalau course yang dihapus sedang dibuka di form Quiz, reset supaya tidak nyangkut
        if (quizCourseId === id) {
          setQuizCourseId("");
          setExistingQuizId(null);
          setMcQuestions([]);
          setEssayQuestions([]);
          setQuizLoaded(false);
        }
      } else {
        alert(data.message || "Gagal menghapus course");
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const deleteUploadedImage = async (imageUrl) => {
    if (!imageUrl) return;
    const authToken = localStorage.getItem("token");
    try {
      await fetch(`${API_URL}/upload/image`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ imageUrl }),
      });
    } catch (e) {
      console.error("Gagal membersihkan gambar yang batal disimpan:", e);
    }
  };

  const handleImageUploadSuccess = (field, imageUrl) => {
    const prev = unsavedImages[field];
    if (prev && prev !== imageUrl) deleteUploadedImage(prev);
    if (field === "course") setCourseImage(imageUrl);
    if (field === "content") updateContent("image", imageUrl);
    setUnsavedImages((p) => ({ ...p, [field]: imageUrl }));
    setUploadingImage((p) => ({ ...p, [field]: false }));
  };

  const handleRemoveContentImage = () => {
    if (
      unsavedImages.content &&
      unsavedImages.content === courseContent.image
    ) {
      deleteUploadedImage(unsavedImages.content);
      setUnsavedImages((p) => ({ ...p, content: null }));
    }
    updateContent("image", "");
  };

  const handleRemoveCourseImage = () => {
    if (unsavedImages.course && unsavedImages.course === courseImage) {
      deleteUploadedImage(unsavedImages.course);
      setUnsavedImages((p) => ({ ...p, course: null }));
    }
    setCourseImage("");
  };

  // ─── Content ─────────────────────────────────────────────────────────────
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

  // ─── Summary: Pengenalan ──────────────────────────────────────────────────
  const addSummaryPengenalan = () =>
    setCourseSummary((prev) => ({
      ...prev,
      pengenalan: [...(prev.pengenalan || []), emptySummaryPengenalan()],
    }));

  const updateSummaryPengenalanTitle = (idx, value) =>
    setCourseSummary((prev) => {
      const arr = [...prev.pengenalan];
      arr[idx] = { ...arr[idx], title: value };
      return { ...prev, pengenalan: arr };
    });

  const removeSummaryPengenalan = (idx) =>
    setCourseSummary((prev) => ({
      ...prev,
      pengenalan: prev.pengenalan.filter((_, i) => i !== idx),
    }));

  const addSummaryPengenalanItem = (idx) =>
    setCourseSummary((prev) => {
      const arr = [...prev.pengenalan];
      arr[idx] = { ...arr[idx], items: [...arr[idx].items, ""] };
      return { ...prev, pengenalan: arr };
    });

  const updateSummaryPengenalanItem = (pIdx, iIdx, value) =>
    setCourseSummary((prev) => {
      const arr = [...prev.pengenalan];
      const items = [...arr[pIdx].items];
      items[iIdx] = value;
      arr[pIdx] = { ...arr[pIdx], items };
      return { ...prev, pengenalan: arr };
    });

  const removeSummaryPengenalanItem = (pIdx, iIdx) =>
    setCourseSummary((prev) => {
      const arr = [...prev.pengenalan];
      arr[pIdx] = {
        ...arr[pIdx],
        items: arr[pIdx].items.filter((_, i) => i !== iIdx),
      };
      return { ...prev, pengenalan: arr };
    });

  // ─── Summary: Kebutuhan ───────────────────────────────────────────────────
  const addSummaryKebutuhan = () =>
    setCourseSummary((prev) => ({
      ...prev,
      kebutuhan: [...(prev.kebutuhan || []), ""],
    }));

  const updateSummaryKebutuhan = (idx, value) =>
    setCourseSummary((prev) => {
      const arr = [...prev.kebutuhan];
      arr[idx] = value;
      return { ...prev, kebutuhan: arr };
    });

  const removeSummaryKebutuhan = (idx) =>
    setCourseSummary((prev) => ({
      ...prev,
      kebutuhan: prev.kebutuhan.filter((_, i) => i !== idx),
    }));

  const addCourseKeyword = () => setCourseKeywords((prev) => [...prev, ""]);

  const updateCourseKeyword = (idx, value) =>
    setCourseKeywords((prev) => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });

  const removeCourseKeyword = (idx) =>
    setCourseKeywords((prev) => prev.filter((_, i) => i !== idx));

  // ─── Summary: Videos ─────────────────────────────────────────────────────
  const addSummaryVideo = () =>
    setCourseSummary((prev) => ({
      ...prev,
      videos: [...(prev.videos || []), emptySummaryVideo()],
    }));

  const updateSummaryVideo = (idx, field, value) =>
    setCourseSummary((prev) => {
      const arr = [...prev.videos];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, videos: arr };
    });

  const removeSummaryVideo = (idx) =>
    setCourseSummary((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== idx),
    }));

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

  const openEnrollmentModal = (user) => {
    setEnrollmentModalUser(user);
    setSelectedEnrollCourseId(user.enrolledCourses?.[0]?.courseId?._id || "");
  };

  // handler
  const handleChangeRole = async (id, newRole) => {
    const confirmMsg =
      newRole === "teacher"
        ? "Yakin jadikan user ini Teacher? Enrollment course & hasil quiz siswa ini (jika ada) akan otomatis dihapus."
        : "Yakin jadikan user ini Siswa kembali?";
    if (!window.confirm(confirmMsg)) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchUsers();
        fetchStats();
        fetchQuizResults();
      } else {
        alert(data.message || "Gagal mengubah role");
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleUpdateEnrollment = async () => {
    if (!enrollmentModalUser) return;
    try {
      const res = await fetch(
        `${API_URL}/admin/users/${enrollmentModalUser._id}/enrollment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseId: selectedEnrollCourseId || null }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setEnrollmentModalUser(null);
        setSelectedEnrollCourseId("");
        fetchUsers();
        fetchQuizResults();
        fetchStats();
      } else {
        alert(data.message || "Gagal update enrollment");
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

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
        setEssayQuestions(
          (data.essay || []).map((q) => ({
            ...q,
            keyWordsInput: (q.keyWords || []).join(", "),
          })),
        );
      } else {
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

    const essayToSave = essayQuestions.map((q) => ({
      question: q.question,
      image: q.image,
      keyWords: (q.keyWordsInput ?? (q.keyWords || []).join(", "))
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    }));

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
          essay: essayToSave,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
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
  const updateEssayKeywordsInput = (idx, raw) =>
    setEssayQuestions((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], keyWordsInput: raw };
      return arr;
    });

  const commitEssayKeywords = (idx) =>
    setEssayQuestions((prev) => {
      const arr = [...prev];
      const raw = arr[idx].keyWordsInput ?? "";
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
    { key: "courses", label: "📚 Courses", roles: ["teacher"] },
    { key: "quiz", label: "📝 Quiz", roles: ["teacher"] },
    { key: "quiz-results", label: "🏆 Hasil Quiz", roles: ["teacher"] },
    { key: "users", label: "👥 Users" },
    { key: "contacts", label: "📧 Contacts", roles: ["admin"] },
  ].filter((t) => !t.roles || t.roles.includes(userRole));

  const COURSE_FORM_TABS = [
    "basic",
    "summary",
    "content",
    "materials",
    "videos",
    "tools",
  ];

  return (
    <>
      <Navbar />
      <div className="admin-container">
        {/* ── Sidebar ── */}
        <div className="admin-sidebar">
          <h2 className="sidebar-title">Barmodule Admin</h2>
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
                  ...(userRole === "admin"
                    ? [
                        {
                          label: "Pending Contacts",
                          value: stats.pendingContacts,
                        },
                      ]
                    : []),
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
                    <textarea
                      placeholder="Deskripsi singkat course"
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      className="admin-textarea"
                    />
                    <input
                      placeholder="URL Video Hero (YouTube embed ID atau URL penuh)"
                      value={courseVideo}
                      onChange={(e) => setCourseVideo(e.target.value)}
                      className="admin-input"
                    />
                    <div className="array-field-group">
                      <label className="field-label">
                        Kata Kunci Pencarian (untuk fitur Explore)
                      </label>
                      <p
                        style={{
                          color: "#a0aec0",
                          fontSize: 13,
                          marginBottom: 8,
                        }}
                      >
                        Kata kunci tambahan supaya course ini mudah ditemukan
                        lewat pencarian Explore di Navbar (selain judul course
                        sendiri).
                      </p>
                      {courseKeywords.map((kw, idx) => (
                        <div key={idx} className="array-item-row">
                          <input
                            placeholder="Contoh: Manajemen Persediaan"
                            value={kw}
                            onChange={(e) =>
                              updateCourseKeyword(idx, e.target.value)
                            }
                            className="admin-input"
                          />
                          <button
                            onClick={() => removeCourseKeyword(idx)}
                            className="btn-remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addCourseKeyword}
                        className="btn-add-small"
                      >
                        + Tambah Kata Kunci
                      </button>
                    </div>
                    <div className="image-upload-section">
                      <label className="field-label">
                        Gambar Thumbnail Course
                      </label>
                      {courseImage ? (
                        <div className="current-image">
                          <img
                            src={courseImage}
                            alt="Thumbnail"
                            style={{ maxWidth: "200px" }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setUploadingImage((p) => ({
                                ...p,
                                course: !p.course,
                              }))
                            }
                            className="admin-button"
                          >
                            {uploadingImage.course ? "Batal" : "Ganti Gambar"}
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveCourseImage}
                            className="admin-button cancel-button"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setUploadingImage((p) => ({ ...p, course: true }))
                          }
                          className="admin-button"
                        >
                          Upload Gambar
                        </button>
                      )}
                      {uploadingImage.course && (
                        <ImageUpload
                          currentImage={courseImage}
                          uploadType="course"
                          onUploadSuccess={(url) =>
                            handleImageUploadSuccess("course", url)
                          }
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* ── Tab: Summary ── */}
                {courseFormTab === "summary" && (
                  <div className="course-form">
                    <p
                      style={{
                        color: "#718096",
                        marginBottom: 16,
                        fontSize: 14,
                      }}
                    >
                      Bagian ini mengisi konten tab{" "}
                      <strong>Course Summary</strong> yang tampil di halaman
                      course (Pengenalan, Apa yang Dibutuhkan, Video
                      Pengenalan).
                    </p>

                    {/* Pengenalan */}
                    <div className="array-field-group">
                      <label className="field-label">
                        Tab Pengenalan — Sub-section
                      </label>
                      <p
                        style={{
                          color: "#a0aec0",
                          fontSize: 13,
                          marginBottom: 8,
                        }}
                      >
                        Contoh sub-section: "Dibuat untuk", "Kompetensi Dasar",
                        "Indikator Pencapaian"
                      </p>
                      {(courseSummary.pengenalan || []).map((pg, pIdx) => (
                        <div key={pIdx} className="nested-card">
                          <div className="nested-card-header">
                            <span>Sub-section {pIdx + 1}</span>
                            <button
                              onClick={() => removeSummaryPengenalan(pIdx)}
                              className="btn-remove"
                            >
                              ✕ Hapus
                            </button>
                          </div>
                          <input
                            placeholder="Judul sub-section (misal: Dibuat untuk)"
                            value={pg.title}
                            onChange={(e) =>
                              updateSummaryPengenalanTitle(pIdx, e.target.value)
                            }
                            className="admin-input"
                          />
                          <label
                            className="field-label"
                            style={{ marginTop: 8 }}
                          >
                            Item
                          </label>
                          {(pg.items || []).map((item, iIdx) => (
                            <div key={iIdx} className="array-item-row sub-item">
                              <input
                                placeholder="Item..."
                                value={item}
                                onChange={(e) =>
                                  updateSummaryPengenalanItem(
                                    pIdx,
                                    iIdx,
                                    e.target.value,
                                  )
                                }
                                className="admin-input"
                              />
                              <button
                                onClick={() =>
                                  removeSummaryPengenalanItem(pIdx, iIdx)
                                }
                                className="btn-remove"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addSummaryPengenalanItem(pIdx)}
                            className="btn-add-small"
                          >
                            + Tambah Item
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addSummaryPengenalan}
                        className="admin-button"
                      >
                        + Tambah Sub-section Pengenalan
                      </button>
                    </div>

                    {/* Kebutuhan */}
                    <div
                      className="array-field-group"
                      style={{ marginTop: 24 }}
                    >
                      <label className="field-label">
                        Tab "Apa yang Dibutuhkan" — Daftar Alat/Bahan
                      </label>
                      {(courseSummary.kebutuhan || []).map((item, idx) => (
                        <div key={idx} className="array-item-row">
                          <input
                            placeholder="Contoh: Gunting profesional"
                            value={item}
                            onChange={(e) =>
                              updateSummaryKebutuhan(idx, e.target.value)
                            }
                            className="admin-input"
                          />
                          <button
                            onClick={() => removeSummaryKebutuhan(idx)}
                            className="btn-remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addSummaryKebutuhan}
                        className="btn-add-small"
                      >
                        + Tambah Item Kebutuhan
                      </button>
                    </div>

                    {/* Video Summary */}
                    <div
                      className="array-field-group"
                      style={{ marginTop: 24 }}
                    >
                      <label className="field-label">
                        Tab "Video" di Course Summary — Video Pengenalan
                      </label>
                      <p
                        style={{
                          color: "#a0aec0",
                          fontSize: 13,
                          marginBottom: 8,
                        }}
                      >
                        Ini berbeda dengan Video Materi. Isi URL YouTube lengkap
                        (misal: https://youtu.be/xxxx)
                      </p>
                      {(courseSummary.videos || []).map((vid, idx) => (
                        <div key={idx} className="nested-card">
                          <div className="nested-card-header">
                            <span>Video {idx + 1}</span>
                            <button
                              onClick={() => removeSummaryVideo(idx)}
                              className="btn-remove"
                            >
                              ✕ Hapus
                            </button>
                          </div>
                          <input
                            placeholder="Judul video"
                            value={vid.title}
                            onChange={(e) =>
                              updateSummaryVideo(idx, "title", e.target.value)
                            }
                            className="admin-input"
                          />
                          <input
                            placeholder="URL YouTube"
                            value={vid.url}
                            onChange={(e) =>
                              updateSummaryVideo(idx, "url", e.target.value)
                            }
                            className="admin-input"
                          />
                        </div>
                      ))}
                      <button
                        onClick={addSummaryVideo}
                        className="admin-button"
                      >
                        + Tambah Video Pengenalan
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Tab: Content ── */}
                {courseFormTab === "content" && (
                  <div className="course-form">
                    <p
                      style={{
                        color: "#718096",
                        marginBottom: 16,
                        fontSize: 14,
                      }}
                    >
                      Bagian ini mengisi tab <strong>Deskripsi Kelas</strong> di
                      Class Course.
                    </p>
                    <div className="image-upload-section">
                      <label className="field-label">
                        Gambar Deskripsi Kelas
                      </label>
                      {courseContent.image ? (
                        <div className="current-image">
                          <img
                            src={courseContent.image}
                            alt="Deskripsi"
                            style={{ maxWidth: "200px" }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setUploadingImage((p) => ({
                                ...p,
                                content: !p.content,
                              }))
                            }
                            className="admin-button"
                          >
                            {uploadingImage.content ? "Batal" : "Ganti Gambar"}
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveContentImage}
                            className="admin-button cancel-button"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setUploadingImage((p) => ({ ...p, content: true }))
                          }
                          className="admin-button"
                        >
                          Upload Gambar
                        </button>
                      )}
                      {uploadingImage.content && (
                        <ImageUpload
                          currentImage={courseContent.image}
                          uploadType="course-content"
                          onUploadSuccess={(url) =>
                            handleImageUploadSuccess("content", url)
                          }
                        />
                      )}
                    </div>
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
                    <p
                      style={{
                        color: "#718096",
                        marginBottom: 16,
                        fontSize: 14,
                      }}
                    >
                      Bagian ini mengisi tab <strong>Materi</strong> di Class
                      Course (gambar, deskripsi, dan sub-sections).
                    </p>
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
                          placeholder="Deskripsi material (bisa berupa array jika dipisah dengan baris baru)"
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
                    <p
                      style={{
                        color: "#718096",
                        marginBottom: 16,
                        fontSize: 14,
                      }}
                    >
                      Bagian ini mengisi tab <strong>Video</strong> di Class
                      Course (video materi berseksi).
                    </p>
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
                              placeholder="URL Video YouTube (misal: https://youtu.be/xxxx)"
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
                    <p
                      style={{
                        color: "#718096",
                        marginBottom: 16,
                        fontSize: 14,
                      }}
                    >
                      Bagian ini mengisi bagian{" "}
                      <strong>Persiapan Kerja / Alat</strong> di tab Materi.
                    </p>
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
                          placeholder="Judul grup alat / persiapan (misal: Persiapan Kerja)"
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
                      + Tambah Grup Alat
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
                        <th>Slug</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course._id}>
                          <td>{course.title}</td>
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
                              value={
                                q.keyWordsInput ?? (q.keyWords || []).join(", ")
                              }
                              onChange={(e) =>
                                updateEssayKeywordsInput(qIdx, e.target.value)
                              }
                              onBlur={() => commitEssayKeywords(qIdx)}
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
                        <th>Course</th>
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
                          <td>
                            {["admin", "teacher"].includes(user.role) ? (
                              <span
                                style={{
                                  color: "#a0aec0",
                                  fontStyle: "italic",
                                }}
                              >
                                Dapat mengikuti semua course
                              </span>
                            ) : user.enrolledCourses?.length > 0 ? (
                              user.enrolledCourses[0].courseId?.title || (
                                <span
                                  style={{
                                    color: "#a0aec0",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Course terhapus
                                </span>
                              )
                            ) : (
                              <span
                                style={{
                                  color: "#a0aec0",
                                  fontStyle: "italic",
                                }}
                              >
                                Belum ikut course
                              </span>
                            )}
                          </td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString(
                              "id-ID",
                            )}
                          </td>
                          <td>
                            {user.role === "admin" ||
                            (user.role === "teacher" &&
                              userRole === "teacher") ? (
                              <span className="protected-label">Protected</span>
                            ) : (
                              <>
                                {user.role === "student" && (
                                  <button
                                    onClick={() => openEnrollmentModal(user)}
                                    className="action-button edit-button"
                                  >
                                    ✏️ Edit Course
                                  </button>
                                )}
                                {userRole === "admin" && (
                                  <button
                                    onClick={() =>
                                      handleChangeRole(
                                        user._id,
                                        user.role === "teacher"
                                          ? "student"
                                          : "teacher",
                                      )
                                    }
                                    className="action-button edit-button"
                                  >
                                    {user.role === "teacher"
                                      ? "👤 Jadikan Siswa"
                                      : "🎓 Jadikan Teacher"}
                                  </button>
                                )}
                                {(userRole === "admin" ||
                                  user.role === "student") && (
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="action-button delete-button"
                                  >
                                    🗑️ Hapus
                                  </button>
                                )}
                              </>
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
              <div className="table-card">
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Skor</th>
                        <th>Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
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
      {enrollmentModalUser && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>
              Atur course untuk <strong>{enrollmentModalUser.name}</strong>
            </p>
            <select
              value={selectedEnrollCourseId}
              onChange={(e) => setSelectedEnrollCourseId(e.target.value)}
              className="admin-input"
            >
              <option value="">— Keluarkan dari course —</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
            <div className="button-group" style={{ marginTop: 12 }}>
              <button onClick={handleUpdateEnrollment}>Simpan</button>
              <button onClick={() => setEnrollmentModalUser(null)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};;

export default AdminPanel;