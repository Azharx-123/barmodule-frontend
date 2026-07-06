import AOS from "aos";
import "aos/dist/aos.css";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BsFillCheckCircleFill,
  BsFillPauseFill,
  BsFillPlayCircleFill,
  BsFileTextFill,
  BsBookHalf,
  BsChatDotsFill,
  BsPencilSquare,
  BsArrowRightCircleFill,
  BsInboxFill,
} from "react-icons/bs";
import { CgCalendarDates, CgCheckO } from "react-icons/cg";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import YouTube from "react-youtube";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import DiscussionForum from "../components/DiscussionForum";
import "../css/CoursePage.css";

const CLASS_TAB_ICONS = {
  deskripsi: <BsFileTextFill aria-hidden="true" />,
  materi: <BsBookHalf aria-hidden="true" />,
  video: <BsFillPlayCircleFill aria-hidden="true" />,
  diskusi: <BsChatDotsFill aria-hidden="true" />,
  latihan: <BsPencilSquare aria-hidden="true" />,
};

// ─── Helper: ekstrak YouTube video ID dari berbagai format URL ─────────────
const extractYouTubeId = (url) => {
  if (!url) return null;
  // sudah berupa ID langsung (tanpa http)
  if (!url.includes("/") && !url.includes(".")) return url;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const CoursePage = () => {
  const { slug } = useParams();

  // ─── Data States ──────────────────────────────────────────────────────────
  const [course, setCourse] = useState(null);
  const [notEnrolled, setNotEnrolled] = useState(false);
  const [coursePreview, setCoursePreview] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── UI States ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(0);

  // Hero video
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);
  const [heroDuration, setHeroDuration] = useState(0);
  const [heroCurrentTime, setHeroCurrentTime] = useState(0);
  const [heroVolume, setHeroVolume] = useState(100);
  const [isHeroMuted, setIsHeroMuted] = useState(false);
  const [isHeroVideoReady, setIsHeroVideoReady] = useState(false);
  const heroVideoRef = useRef(null);
  const progressRef = useRef(null);
  const timeUpdateIntervalRef = useRef(null);

  // Section videos
  const [activeVideos, setActiveVideos] = useState({});

  // Quiz
  const [mcAnswers, setMcAnswers] = useState({});
  const [essayAnswers, setEssayAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const resultsRef = useRef(null);
  const exerciseSectionRef = useRef(null);

  // ─── AOS ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    AOS.init({});
  }, []);

  // ─── Fetch course & quiz ──────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const courseRes = await fetch(`${API_BASE_URL}/courses/${slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (courseRes.status === 403) {
        const body = await courseRes.json().catch(() => ({}));
        if (body.code === "NOT_ENROLLED") {
          setNotEnrolled(true);
          setCoursePreview(body.course || null);
          setLoading(false);
          return;
        }
        setError(body.message || "Akses ditolak.");
        setLoading(false);
        return;
      }

      if (!courseRes.ok) {
        setError(
          courseRes.status === 404
            ? "Course tidak ditemukan."
            : "Gagal memuat course.",
        );
        setLoading(false);
        return;
      }

      const courseData = await courseRes.json();
      setNotEnrolled(false);
      setCourse(courseData);

      // fetch quiz (boleh 404, berarti belum ada quiz)
      const quizRes = await fetch(`${API_BASE_URL}/quiz/course/${courseData._id}`);
      if (quizRes.ok) {
        const quizData = await quizRes.json();
        setQuiz(quizData);

        if (token) {
          const resultRes = await fetch(
            `${API_BASE_URL}/quiz/result/${courseData._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (resultRes.ok) {
            const resultData = await resultRes.json();
            setMcAnswers(resultData.mcAnswers || {});
            setEssayAnswers(resultData.essayAnswers || {});
            setScore(resultData.score);
            setShowResults(true);
          }
        }
      } else {
        setQuiz(null);
      }
    } catch (e) {
      setError("Terjadi kesalahan saat memuat data.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Hero YouTube player setup ────────────────────────────────────────────
  const stopTimeUpdate = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  const startTimeUpdate = useCallback(() => {
    stopTimeUpdate();
    timeUpdateIntervalRef.current = setInterval(() => {
      if (heroVideoRef.current) {
        setHeroCurrentTime(heroVideoRef.current.getCurrentTime());
      }
    }, 1000);
  }, [stopTimeUpdate]);

  useEffect(() => {
    if (!course?.videoUrl) return;

    const heroVideoId = extractYouTubeId(course.videoUrl);
    if (!heroVideoId) return;

    const onPlayerReady = (event) => {
      heroVideoRef.current = event.target; // ⬅️ tambahan: pastikan ref selalu sinkron dengan instance yang benar-benar sudah ready
      setHeroDuration(event.target.getDuration());
      setIsHeroVideoReady(true);
    };

    const onPlayerStateChange = (event) => {
      if (event.data === window.YT?.PlayerState?.PLAYING) {
        setIsHeroPlaying(true);
        startTimeUpdate();
      } else if (event.data === window.YT?.PlayerState?.PAUSED) {
        setIsHeroPlaying(false);
        stopTimeUpdate();
      }
    };

    const initializeYouTubePlayer = () => {
      // destroy kalau sudah ada
      if (
        heroVideoRef.current &&
        typeof heroVideoRef.current.destroy === "function"
      ) {
        heroVideoRef.current.destroy();
      }
      heroVideoRef.current = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: heroVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
        },
        events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange },
      });
    };

    if (window.YT && window.YT.Player) {
      initializeYouTubePlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
    }

    return () => {
      stopTimeUpdate();
      if (
        heroVideoRef.current &&
        typeof heroVideoRef.current.destroy === "function"
      ) {
        heroVideoRef.current.destroy();
        heroVideoRef.current = null;
      }
      setIsHeroPlaying(false);
      setIsHeroVideoReady(false);
      setHeroCurrentTime(0);
    };
  }, [course?.videoUrl, startTimeUpdate, stopTimeUpdate]);

  // ─── Hero video controls ──────────────────────────────────────────────────
  const handleHeroPlayPause = useCallback(() => {
    if (!heroVideoRef.current || !isHeroVideoReady) return; // ⬅️ tambahan guard
    if (isHeroPlaying) {
      heroVideoRef.current.pauseVideo();
    } else {
      heroVideoRef.current.playVideo();
      setActiveVideos({});
    }
    setIsHeroPlaying(!isHeroPlaying);
  }, [isHeroPlaying, isHeroVideoReady]); // ⬅️ tambahkan di sini

  const handleHeroProgressChange = useCallback((e) => {
    if (!heroVideoRef.current) return;
    heroVideoRef.current.seekTo(e.target.value);
    setHeroCurrentTime(e.target.value);
  }, []);

  const handleHeroVolumeChange = useCallback((e) => {
    if (!heroVideoRef.current) return;
    const newVolume = e.target.value;
    heroVideoRef.current.setVolume(newVolume);
    setHeroVolume(newVolume);
    setIsHeroMuted(newVolume === 0);
  }, []);

  const toggleHeroMute = useCallback(() => {
    if (!heroVideoRef.current) return;
    if (isHeroMuted) {
      heroVideoRef.current.unMute();
      heroVideoRef.current.setVolume(heroVolume);
    } else {
      heroVideoRef.current.mute();
    }
    setIsHeroMuted(!isHeroMuted);
  }, [isHeroMuted, heroVolume]);

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  // ─── Section video helpers ─────────────────────────────────────────────────
  const scrollToActiveVideo = useCallback(() => {
    const activeVideoKey = Object.keys(activeVideos).find(
      (key) => activeVideos[key],
    );
    if (activeVideoKey) {
      const el = document.querySelector(`[data-video-key="${activeVideoKey}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (isHeroPlaying) {
      document
        .querySelector(".course-hero")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeVideos, isHeroPlaying]);

  const toggleVideo = useCallback(
    (section, index) => {
      if (isHeroPlaying) handleHeroPlayPause();
      setActiveVideos((prev) => {
        const videoKey = `${section}-${index}`;
        if (prev[videoKey]) return {};
        if (Object.values(prev).some(Boolean)) {
          scrollToActiveVideo();
          return prev;
        }
        return { [videoKey]: true };
      });
    },
    [isHeroPlaying, handleHeroPlayPause, scrollToActiveVideo],
  );

  useEffect(() => {
    return () => setActiveVideos({});
  }, []);

  const VideoPlayer = ({ src, isActive, onPlay, onPause }) => {
    const videoId = extractYouTubeId(src);
    if (!isActive || !videoId) return null;
    return (
      <YouTube
        videoId={videoId}
        opts={{ width: "100%", height: "315", playerVars: { autoplay: 1 } }}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={() => setActiveVideos({})}
      />
    );
  };

  const renderVideoSection = (videos, sectionKey) => (
    <div className="video-list">
      {videos.map((video, index) => {
        const videoKey = `${sectionKey}-${index}`;
        const isVideoActive = activeVideos[videoKey];
        const isAnyVideoPlaying =
          isHeroPlaying || Object.values(activeVideos).some(Boolean);
        const isOtherVideoPlaying = isAnyVideoPlaying && !isVideoActive;
        return (
          <div key={index} className="video-item" data-video-key={videoKey}>
            <div
              className={`video-title-wrapper ${isOtherVideoPlaying ? "disabled" : ""}`}
              onClick={() => {
                isOtherVideoPlaying
                  ? scrollToActiveVideo()
                  : toggleVideo(sectionKey, index);
              }}
            >
              {isVideoActive ? (
                <BsFillPauseFill className="play-icon" />
              ) : (
                <BsFillPlayCircleFill className="play-icon" />
              )}
              <span className="video-title">
                {isOtherVideoPlaying
                  ? "Matikan video lain terlebih dahulu"
                  : video.title}
              </span>
            </div>
            <VideoPlayer
              src={video.url}
              isActive={isVideoActive}
              onPlay={() => {
                if (isHeroPlaying) handleHeroPlayPause();
              }}
              onPause={() =>
                setActiveVideos((prev) => ({ ...prev, [videoKey]: false }))
              }
            />
          </div>
        );
      })}
    </div>
  );

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  // ─── Quiz handlers ────────────────────────────────────────────────────────
  const handleMCAnswer = (questionIndex, answerIndex) => {
    setMcAnswers((prev) => {
      const newAnswers = { ...prev };
      if (newAnswers[questionIndex] === answerIndex) {
        delete newAnswers[questionIndex];
      } else {
        newAnswers[questionIndex] = answerIndex;
      }
      return newAnswers;
    });
    setErrors((prev) => ({ ...prev, [`mc-${questionIndex}`]: null }));
  };

  const handleEssayAnswer = (questionIndex, content) => {
    setEssayAnswers((prev) => ({ ...prev, [questionIndex]: content }));
    setErrors((prev) => ({ ...prev, [`essay-${questionIndex}`]: null }));
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let totalScore = 0;
    const mcQuestions = quiz.multipleChoice || [];
    const essayQuestions = quiz.essay || [];

    mcQuestions.forEach((q, index) => {
      if (mcAnswers[index] === q.answer) totalScore += 1;
    });
    essayQuestions.forEach((q, index) => {
      const answer = essayAnswers[index] || "";
      const matched = q.keyWords.filter((kw) =>
        answer.toLowerCase().includes(kw.toLowerCase()),
      );
      totalScore += matched.length / q.keyWords.length;
    });

    const total = mcQuestions.length + essayQuestions.length;
    const percentageScore =
      total > 0 ? Number(((totalScore / total) * 100).toFixed(2)) : 0;
    setScore(percentageScore);
    return percentageScore;
  };

  const validateAnswers = () => {
    if (!quiz) return true;
    const newErrors = {};
    (quiz.multipleChoice || []).forEach((_, index) => {
      if (mcAnswers[index] === undefined)
        newErrors[`mc-${index}`] = "Harap pilih salah satu jawaban.";
    });
    (quiz.essay || []).forEach((_, index) => {
      if (!essayAnswers[index] || essayAnswers[index].trim() === "")
        newErrors[`essay-${index}`] = "Harap isi jawaban essay.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateAnswers()) {
      setShowPopup(true);
      setPopupMessage("Apakah yakin ingin mengumpulkan?");
      setPopupType("confirm");
    } else {
      setShowPopup(true);
      setPopupMessage("Harap mengisi seluruh jawaban");
      setPopupType("error");
      document
        .querySelector(".question.unanswered")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleConfirmSubmit = async () => {
    const finalScore = calculateScore();
    setShowResults(true);
    setShowPopup(false);
    setTimeout(
      () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
    if (quiz?._id) {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await fetch(`${API_BASE_URL}/quiz/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quizId: quiz._id,
            courseId: course._id,
            mcAnswers,
            essayAnswers,
            score: finalScore,
          }),
        });

        // ⬅️ tambahan: progress di enrolledCourses = skor quiz itu sendiri
        await fetch(`${API_BASE_URL}/users/progress/${course._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ progress: finalScore }),
        });
      } catch (e) {
        console.error("Gagal menyimpan hasil quiz:", e);
      }
    }
  };

  const handleReset = () => {
    setShowPopup(true);
    setPopupMessage("Mau reset soal?");
    setPopupType("reset");
  };

  const handleConfirmReset = async () => {
  const token = localStorage.getItem("token");
  if (token && course?._id) {
    try {
      await fetch(`${API_BASE_URL}/quiz/result/${course._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // ⬅️ tambahan: samakan progress balik ke 0 setelah reset
      await fetch(`${API_BASE_URL}/users/progress/${course._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress: 0 }),
      });
    } catch (e) {
      console.error("Gagal menghapus hasil quiz di server:", e);
    }
  }

    setMcAnswers({});
    setEssayAnswers({});
    setShowResults(false);
    setScore(0);
    setErrors({});
    setShowPopup(false);
    exerciseSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  // ─── Loading / Error states ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="course-page">
        <Navbar />
        <div className="course-loading">
          <div className="loading-spinner"></div>
          <p>Memuat course...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!notEnrolled && (error || !course)) {
    return (
      <div className="course-page">
        <Navbar />
        <div className="course-error">
          <h2>😕 {error || "Course tidak ditemukan"}</h2>
          <button onClick={fetchData} className="cta-button">
            Coba Lagi
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (notEnrolled) {
    return (
      <div className="course-page">
        <Navbar />
        <div className="course-container">
          <section
            className={`course-hero course-hero-locked${coursePreview?.image ? " has-bg-image" : ""}`}
            style={
              coursePreview?.image
                ? { backgroundImage: `url(${coursePreview.image})` }
                : undefined
            }
          >
            <div className="hero-content">
              <span className="hero-eyebrow">✨ Kelas Online</span>
              <h1>{coursePreview?.title || "Course"}</h1>
              <p>{coursePreview?.description}</p>
              <div className="enrollment-notice">
                <span className="enrollment-notice-label">Akses Terbatas</span>
                <p>
                  Anda belum terdaftar di kelas ini. Silakan hubungi admin untuk
                  mendapatkan akses ke kelas ini.
                </p>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Derived data ─────────────────────────────────────────────────────────
  const summary = course.summary || {};
  const content = course.content || {};
  const heroVideoId = extractYouTubeId(course.videoUrl);

  // Tab kelas: selalu ada Deskripsi Kelas & Materi; Video hanya kalau ada data; Latihan hanya kalau ada quiz
  const classTabs = [
    { key: "deskripsi", label: "Deskripsi Kelas" },
    { key: "materi", label: "Materi" },
    ...(course.videos?.length > 0 ? [{ key: "video", label: "Video" }] : []),
    { key: "diskusi", label: "Forum Diskusi" },
    ...(quiz ? [{ key: "latihan", label: "Latihan" }] : []),
  ];

  // Progres latihan — dipakai untuk progress bar, murni tampilan, tidak
  // mempengaruhi logika penilaian (calculateScore/validateAnswers tetap sama).
  const totalMc = quiz?.multipleChoice?.length || 0;
  const totalEssay = quiz?.essay?.length || 0;
  const totalQuestions = totalMc + totalEssay;
  const answeredMc = Object.keys(mcAnswers).length;
  const answeredEssay = Object.values(essayAnswers).filter(
    (v) => v && v.replace(/<(.|\n)*?>/g, "").trim().length > 0,
  ).length;
  const answeredCount = answeredMc + answeredEssay;
  const progressPercent =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="course-page">
      <Navbar />
      <div className="course-container">
        <main>
          {/* ════════════════════════════════════════════
              HERO SECTION
          ════════════════════════════════════════════ */}
          <section
            className={`course-hero${course.image ? " has-bg-image" : ""}`}
            style={
              course.image
                ? { backgroundImage: `url(${course.image})` }
                : undefined
            }
          >
            <div className="hero-content">
              <span className="hero-eyebrow">✨ Kelas Online</span>
              <h1>{course.title}</h1>
              <p>{course.description}</p>
              {(course.videos?.length > 0 || quiz) && (
                <div className="hero-meta">
                  {course.videos?.length > 0 && (
                    <span className="hero-meta-item">
                      <BsFillPlayCircleFill aria-hidden="true" /> Video
                      Pembelajaran
                    </span>
                  )}
                  {quiz && (
                    <span className="hero-meta-item">
                      <BsPencilSquare aria-hidden="true" /> Kuis Latihan
                    </span>
                  )}
                </div>
              )}
              <button
                onClick={() => scrollToSection("course-summary")}
                className="cta-button"
              >
                Gabung Kelas <BsArrowRightCircleFill aria-hidden="true" />
              </button>
            </div>
            {heroVideoId && (
              <div className="hero-media">
                <div className="video-container">
                  <div className="video-wrapper">
                    <div className="video-inner">
                      <div id="youtube-player"></div>
                      {Object.values(activeVideos).some(Boolean) ? (
                        /* Video di section lain sedang aktif — tombol cover dikunci */
                        <div className="video-cover">
                          <div className="cover-content">
                            <div className="video-warning">
                              <h3>Video sedang diputar di section lain</h3>
                              <p>
                                Matikan video terlebih dahulu untuk melanjutkan
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : !isHeroPlaying || !isHeroVideoReady ? (
                        /* Belum diputar — cover penuh + tombol play */
                        <div className="video-cover">
                          <div className="cover-content">
                            <button
                              className="cover-play-btn"
                              onClick={handleHeroPlayPause}
                            >
                              <Play size={40} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Sedang diputar */
                        <div className="video-cover video-cover-playing">
                          <button
                            className="cover-play-btn"
                            onClick={handleHeroPlayPause}
                          >
                            <Pause size={40} />
                          </button>
                        </div>
                      )}
                      <div className="video-controls">
                        <div className="progress-container">
                          <input
                            type="range"
                            ref={progressRef}
                            className="progress-bar"
                            min="0"
                            max={heroDuration}
                            value={heroCurrentTime}
                            onChange={handleHeroProgressChange}
                          />
                          <span className="time-display">
                            {formatTime(heroCurrentTime)} /{" "}
                            {formatTime(heroDuration)}
                          </span>
                        </div>
                        <div className="volume-container">
                          <button className="mute-btn" onClick={toggleHeroMute}>
                            {isHeroMuted ? (
                              <VolumeX size={24} />
                            ) : (
                              <Volume2 size={24} />
                            )}
                          </button>
                          <input
                            type="range"
                            className="volume-slider"
                            min="0"
                            max="100"
                            value={isHeroMuted ? 0 : heroVolume}
                            onChange={handleHeroVolumeChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ════════════════════════════════════════════
              COURSE SUMMARY
          ════════════════════════════════════════════ */}
          <section className="services-section" id="course-summary">
            <h2>Course Summary</h2>
            <Tabs
              selectedIndex={activeTab}
              onSelect={(index) => setActiveTab(index)}
              className="services-tabs"
            >
              <TabList>
                <Tab>
                  <CgCalendarDates />
                  <h3>Pengenalan</h3>
                </Tab>
                <Tab>
                  <CgCheckO />
                  <h3>Apa yang dibutuhkan</h3>
                </Tab>
                {summary.videos?.length > 0 && (
                  <Tab>
                    <BsFillPlayCircleFill />
                    <h3>Video</h3>
                  </Tab>
                )}
              </TabList>

              {/* Tab Pengenalan */}
              <TabPanel>
                {(summary.pengenalan || []).length > 0 ? (
                  <div className="service-details">
                    {summary.pengenalan.map((section, i) => (
                      <div key={i} className="competency-section">
                        <h4>{section.title}</h4>
                        <ul className="service-details">
                          {(section.items || []).map((item, j) => (
                            <li key={j}>
                              <BsFillCheckCircleFill />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-content">
                    <BsInboxFill aria-hidden="true" />
                    Informasi pengenalan belum tersedia.
                  </p>
                )}
              </TabPanel>

              {/* Tab Apa yang dibutuhkan */}
              <TabPanel>
                {(summary.kebutuhan || []).length > 0 ? (
                  <ul className="service-details equipment-list">
                    {summary.kebutuhan.map((item, i) => (
                      <li key={i}>
                        <BsFillCheckCircleFill className="check-icon" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-content">
                    <BsInboxFill aria-hidden="true" />
                    Daftar kebutuhan belum tersedia.
                  </p>
                )}
              </TabPanel>

              {/* Tab Video Summary (hanya kalau ada) */}
              {summary.videos?.length > 0 && (
                <TabPanel>
                  {renderVideoSection(summary.videos, "summary")}
                </TabPanel>
              )}
            </Tabs>
          </section>

          {/* ════════════════════════════════════════════
              CLASS COURSE
          ════════════════════════════════════════════ */}
          <section id="class-course">
            <h2>Class Course</h2>
            <Tabs className="course-tabs">
              <TabList>
                {classTabs.map((tab) => (
                  <Tab key={tab.key}>
                    {CLASS_TAB_ICONS[tab.key]}
                    <span>{tab.label}</span>
                  </Tab>
                ))}
              </TabList>

              {classTabs.map((tab) => (
                <TabPanel key={tab.key}>
                  {/* ── Deskripsi Kelas ── */}
                  {tab.key === "deskripsi" && (
                    <div className="course-description-tab">
                      {content.image && (
                        <div className="course-desc-image">
                          <img src={content.image} alt={course.title} />
                        </div>
                      )}
                      <div className="course-desc-info">
                        <h3>{course.title}</h3>
                        {content.ringkasan && (
                          <div className="desc-subsection">
                            <h4>📝 Ringkasan Kelas</h4>
                            <p>{content.ringkasan}</p>
                          </div>
                        )}

                        {content.tujuan?.length > 0 && (
                         <div className="desc-subsection">
                            <h4>🎯 Tujuan Pembelajaran</h4>
                            <ul>
                              {content.tujuan.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {content.materi?.length > 0 && (
                          <div className="desc-subsection">
                            <h4>📖 Materi Kelas</h4>
                            {content.materi.map((section, i) => (
                              <div key={i}>
                                <h5>●&nbsp;&nbsp;{section.title}</h5>
                                {section.items?.length > 0 && (
                                  <ul>
                                    {section.items.map((item, j) => (
                                      <li key={j}>{item}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {content.metode?.length > 0 && (
                          <div className="desc-subsection">
                            <h4>🧭 Metode Pembelajaran</h4>
                            <ul>
                              {content.metode.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {content.durasi && (
                          <div className="desc-subsection">
                            <h4>⏱️ Durasi</h4>
                            <p>{content.durasi}</p>
                          </div>
                        )}

                        {content.target?.length > 0 && (
                          <div className="desc-subsection">
                            <h4>👥 Target Peserta</h4>
                            <ul>
                              {content.target.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {content.evaluasi?.length > 0 && (
                          <div className="desc-subsection">
                            <h4>✅ Evaluasi</h4>
                            <ul>
                              {content.evaluasi.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {content.sertifikasi && (
                          <div className="desc-subsection">
                            <h4>🏆 Sertifikasi</h4>
                            <p>{content.sertifikasi}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Materi ── */}
                  {tab.key === "materi" && (
                    <div className="materi-tab">
                      {/* Materials: gambar + deskripsi + sections */}
                      {(course.materials || []).map((mat, mIdx) => (
                        <div key={mIdx}>
                          {/* Card utama material */}
                          <div className="course-content-card">
                            {mat.image && (
                              <img src={mat.image} alt={mat.title} />
                            )}
                            <div className="course-content-info">
                              <h3>{mat.title}</h3>
                              {Array.isArray(mat.description) ? (
                                <ul>
                                  {mat.description.map((d, i) => (
                                    <li key={i}>{d}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p>{mat.description}</p>
                              )}
                            </div>
                          </div>

                          {/* Sections dari material ini */}
                          {mat.sections?.length > 0 && (
                            <div className="multi-section-content">
                              {mat.sections.map((sec, sIdx) => (
                                <div key={sIdx} className="content-container">
                                  {sec.image && (
                                    <img src={sec.image} alt={sec.subTitle} />
                                  )}
                                  <div className="content-info">
                                    <h4>{sec.subTitle}</h4>
                                    <p>{sec.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Tools / Persiapan Kerja */}
                      {(course.tools || []).map((tool, tIdx) => (
                        <section
                          key={tIdx}
                          className="flexible-content-section"
                        >
                          <h3>{tool.title}</h3>
                          {tool.description && <p>{tool.description}</p>}
                          {(tool.categories || []).map((cat, cIdx) => (
                            <div key={cIdx} className="flexible-content-item">
                              <h4>{cat.title}</h4>
                              {cat.description && <p>{cat.description}</p>}
                              <div className="tool-categories">
                                <div className="tool-category">
                                  <div className="tool-items">
                                    {(cat.items || []).map((item, iIdx) => (
                                      <div key={iIdx} className="tool-item">
                                        {item.image && (
                                          <img
                                            src={item.image}
                                            alt={item.subtitle}
                                          />
                                        )}
                                        <div className="tool-info">
                                          <h6>{item.subtitle}</h6>
                                          <p>{item.description}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </section>
                      ))}

                      {course.materials?.length === 0 &&
                        course.tools?.length === 0 && (
                          <p className="empty-content">
                            <BsInboxFill aria-hidden="true" />
                            Konten materi belum tersedia.
                          </p>
                        )}
                    </div>
                  )}

                  {/* ── Video ── */}
                  {tab.key === "video" && (
                    <div className="video-course-tab">
                      <h2 className="video-main-title">Video Materi</h2>
                      {(course.videos || []).map((section, sectionIndex) => (
                        <div key={sectionIndex} className="video-section">
                          <div className="section-header">
                            <div className="section-number">
                              {sectionIndex + 1}
                            </div>
                            <h3 className="section-title">
                              {section.sectionTitle}
                            </h3>
                          </div>
                          {renderVideoSection(
                            section.videos || [],
                            `course-${sectionIndex}`,
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Forum Diskusi ── */}
                  {tab.key === "diskusi" && (
                    <DiscussionForum courseId={course._id} />
                  )}

                  {/* ── Latihan ── */}
                  {tab.key === "latihan" && (
                    <div className="exercise-section" ref={exerciseSectionRef}>
                      <div className="exercise-header">
                        <h3>Latihan</h3>
                        {totalQuestions > 0 && !showResults && (
                          <div className="exercise-progress">
                            <div className="exercise-progress-track">
                              <div
                                className="exercise-progress-fill"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <span className="exercise-progress-label">
                              {answeredCount} dari {totalQuestions} soal
                              terjawab
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pilihan Ganda */}
                      {quiz?.multipleChoice?.length > 0 && (
                        <div className="multiple-choice">
                          <h4>Pilihan Ganda:</h4>
                          {quiz.multipleChoice.map((q, i) => (
                            <div
                              key={i}
                              className={`question ${errors[`mc-${i}`] ? "unanswered" : ""}`}
                            >
                              <div className="question-header">
                                <div className="question-number">
                                  Soal {i + 1} dari {totalMc}
                                </div>
                                {q.image && (
                                  <div className="question-image-container">
                                    <img
                                      src={q.image}
                                      alt={`Question ${i + 1}`}
                                      className="question-image"
                                    />
                                  </div>
                                )}
                              </div>
                              <p>{q.question}</p>
                              <ul>
                                {(q.options || []).map((option, j) => {
                                  const isSelected = mcAnswers[i] === j;
                                  const isCorrectOption = j === q.answer;
                                  let stateClass = "";
                                  if (showResults) {
                                    if (isCorrectOption) stateClass = "correct";
                                    else if (isSelected)
                                      stateClass = "incorrect";
                                  } else if (isSelected) {
                                    stateClass = "selected";
                                  }
                                  return (
                                    <li key={j} className={stateClass}>
                                      <label>
                                        <input
                                          type="radio"
                                          name={`mc-${i}`}
                                          value={j}
                                          checked={isSelected}
                                          onChange={() => handleMCAnswer(i, j)}
                                          disabled={showResults}
                                        />
                                        {option}
                                      </label>
                                    </li>
                                  );
                                })}
                              </ul>
                              {errors[`mc-${i}`] && (
                                <div className="error-message">
                                  {errors[`mc-${i}`]}
                                </div>
                              )}
                              {showResults && (
                                <div className="answer-feedback">
                                  {mcAnswers[i] === q.answer ? (
                                    <span className="correct">Benar!</span>
                                  ) : (
                                    <span className="incorrect">
                                      Salah. Jawaban yang benar:{" "}
                                      {q.options[q.answer]}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Essay */}
                      {quiz?.essay?.length > 0 && (
                        <div className="essay">
                          <h4>Essay:</h4>
                          {quiz.essay.map((q, i) => (
                            <div
                              key={i}
                              className={`question ${errors[`essay-${i}`] ? "unanswered" : ""}`}
                            >
                              <div className="question-header">
                                <div className="question-number">
                                  Soal {i + 1} dari {totalEssay}
                                </div>
                                {q.image && (
                                  <div className="question-image-container">
                                    <img
                                      src={q.image}
                                      alt={`Essay ${i + 1}`}
                                      className="question-image"
                                    />
                                  </div>
                                )}
                              </div>
                              <p>{q.question}</p>
                              <ReactQuill
                                theme="snow"
                                value={essayAnswers[i] || ""}
                                onChange={(content) =>
                                  handleEssayAnswer(i, content)
                                }
                                modules={quillModules}
                                formats={quillFormats}
                                readOnly={showResults}
                              />
                              {errors[`essay-${i}`] && (
                                <div className="error-message">
                                  {errors[`essay-${i}`]}
                                </div>
                              )}
                              {showResults && (
                                <div className="answer-feedback">
                                  <p>Kata kunci yang diharapkan:</p>
                                  <div className="keyword-container">
                                    {(q.keyWords || []).map((keyword, j) => (
                                      <span key={j} className="keyword">
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {!quiz?.multipleChoice?.length &&
                        !quiz?.essay?.length && (
                          <p className="empty-content">
                            <BsInboxFill aria-hidden="true" />
                            Quiz belum tersedia untuk course ini.
                          </p>
                        )}

                      {(quiz?.multipleChoice?.length > 0 ||
                        quiz?.essay?.length > 0) &&
                        (!showResults ? (
                          <button
                            onClick={handleSubmit}
                            className="submit-button"
                          >
                            Submit
                          </button>
                        ) : (
                          <div className="results" ref={resultsRef}>
                            <h4>Hasil Latihan</h4>
                            <div
                              className="score-ring"
                              style={{ "--score": score }}
                            >
                              <span className="score-value">{score}%</span>
                            </div>
                            <p className="score-message">
                              {score >= 80
                                ? "Kerja bagus! Pemahamanmu sudah kuat 🎉"
                                : score >= 60
                                  ? "Sudah cukup baik, terus berlatih ya 💪"
                                  : "Yuk pelajari lagi materinya sebelum lanjut 📚"}
                            </p>
                            <button
                              onClick={handleReset}
                              className="reset-button"
                            >
                              Reset
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </TabPanel>
              ))}
            </Tabs>
          </section>
        </main>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="popup-icon" aria-hidden="true">
              {popupType === "error"
                ? "⚠️"
                : popupType === "reset"
                  ? "🔄"
                  : "❓"}
            </span>
            <p>{popupMessage}</p>
            {popupType === "error" && (
              <button onClick={() => setShowPopup(false)}>Oke</button>
            )}
            {popupType === "confirm" && (
              <>
                <button onClick={handleConfirmSubmit}>Ya</button>
                <button onClick={() => setShowPopup(false)}>Tidak</button>
              </>
            )}
            {popupType === "reset" && (
              <>
                <button onClick={handleConfirmReset}>Ya</button>
                <button onClick={() => setShowPopup(false)}>Tidak</button>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CoursePage;