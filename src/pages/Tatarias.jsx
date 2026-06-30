import AOS from "aos";
import "aos/dist/aos.css";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BsFillCheckCircleFill,
  BsFillPauseFill,
  BsFillPlayCircleFill,
} from "react-icons/bs";
import { CgCalendarDates, CgCheckO } from "react-icons/cg";
import { FaRegSmileBeam } from "react-icons/fa";
import { FaEye, FaRuler, FaScissors, FaSprayCan } from "react-icons/fa6";
import { GiLipstick, GiSemiClosedEye } from "react-icons/gi";
import { PiHairDryerFill } from "react-icons/pi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import YouTube from "react-youtube";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../css/Tatarias.css";

import TatariasBackground from "../assets/images/Class Tatarias.png";
import FotoRambut from "../assets/images/Foto Rambut.png";
import Bahagia from "../assets/images/Pribadi Tatarias.png";
import SalonSoal from "../assets/images/SalonSoal.png";
import FotoKlien from "../assets/images/Tatarias Klien.png";
import Component1 from "../assets/images/Tatarias komponen1.png";
import Component2 from "../assets/images/Tatarias komponen2.png";
import Component3 from "../assets/images/Tatarias komponen3.png";
import Component4 from "../assets/images/Tatarias komponen4.png";
import Step1 from "../assets/images/Tatarias langkah1.png";
import Step2 from "../assets/images/Tatarias langkah2.png";
import Step3 from "../assets/images/Tatarias langkah3.png";
import Step4 from "../assets/images/Tatarias langkah4.png";
import Step5 from "../assets/images/Tatarias langkah5.png";
import Step6 from "../assets/images/Tatarias langkah6.png";
import MaterialImage from "../assets/images/Tatarias Material.png";
import foto1 from "../assets/images/Tatarias nomor1.png";
import foto10 from "../assets/images/Tatarias nomor10.png";
import foto11 from "../assets/images/Tatarias nomor11.png";
import foto12 from "../assets/images/Tatarias nomor12.png";
import foto13 from "../assets/images/Tatarias nomor13.png";
import foto14 from "../assets/images/Tatarias nomor14.png";
import foto15 from "../assets/images/Tatarias nomor15.png";
import foto2 from "../assets/images/Tatarias nomor2.png";
import foto3 from "../assets/images/Tatarias nomor3.png";
import foto4 from "../assets/images/Tatarias nomor4.png";
import foto5 from "../assets/images/Tatarias nomor5.png";
import foto6 from "../assets/images/Tatarias nomor6.png";
import foto7 from "../assets/images/Tatarias nomor7.png";
import foto8 from "../assets/images/Tatarias nomor8.webp";
import foto9 from "../assets/images/Tatarias nomor9.png";
import HairPhoto from "../assets/images/Uniform Layer.png";

const Tatarias = () => {
  useEffect(() => {
    AOS.init({});
  }, []);

  const [activeTab, setActiveTab] = useState(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);
  const [heroDuration, setHeroDuration] = useState(0);
  const [heroCurrentTime, setHeroCurrentTime] = useState(0);
  const [heroVolume, setHeroVolume] = useState(100);
  const [isHeroMuted, setIsHeroMuted] = useState(false);
  const [isHeroVideoReady, setIsHeroVideoReady] = useState(false);
  const heroVideoRef = useRef(null);
  const progressRef = useRef(null);
  const timeUpdateIntervalRef = useRef(null);
  const [activeVideos, setActiveVideos] = useState({});
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
    const onPlayerReady = (event) => {
      setHeroDuration(event.target.getDuration());
      setIsHeroVideoReady(true);
    };

    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.PLAYING) {
        setIsHeroPlaying(true);
        startTimeUpdate();
      } else if (event.data === window.YT.PlayerState.PAUSED) {
        setIsHeroPlaying(false);
        stopTimeUpdate();
      }
    };

    const initializeYouTubePlayer = () => {
      heroVideoRef.current = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: "mHQFy8IZPLY",
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = initializeYouTubePlayer;

    return () => {
      window.onYouTubeIframeAPIReady = null;
      stopTimeUpdate();
    };
  }, [startTimeUpdate, stopTimeUpdate]);

  const handleHeroPlayPause = useCallback(() => {
    if (!heroVideoRef.current) return;

    if (isHeroPlaying) {
      heroVideoRef.current.pauseVideo();
    } else {
      heroVideoRef.current.playVideo();
      // Pause all other videos
      setActiveVideos({});
    }
    setIsHeroPlaying(!isHeroPlaying);
  }, [isHeroPlaying]);

  const handleHeroProgressChange = useCallback((e) => {
    if (!heroVideoRef.current) return;

    const newTime = e.target.value;
    heroVideoRef.current.seekTo(newTime);
    setHeroCurrentTime(newTime);
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

  const scrollToActiveVideo = useCallback(() => {
    const activeVideoKey = Object.keys(activeVideos).find(
      (key) => activeVideos[key]
    );
    if (activeVideoKey) {
      const activeElement = document.querySelector(
        `[data-video-key="${activeVideoKey}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else if (isHeroPlaying) {
      const heroSection = document.querySelector(".tatarias-hero");
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [activeVideos, isHeroPlaying]);

  const toggleVideo = useCallback(
    (section, index, videoIndex = null) => {
      if (isHeroPlaying) {
        handleHeroPlayPause();
      }

      setActiveVideos((prev) => {
        const videoKey =
          videoIndex !== null
            ? `${section}-${index}-${videoIndex}`
            : `${section}-${index}`;

        if (prev[videoKey]) {
          return {};
        }

        if (Object.values(prev).some(Boolean)) {
          scrollToActiveVideo();
          return prev;
        }

        return { [videoKey]: true };
      });
    },
    [isHeroPlaying, handleHeroPlayPause, scrollToActiveVideo]
  );

  useEffect(() => {
    return () => {
      setActiveVideos({});
    };
  }, []);

  const VideoPlayer = ({ src, isActive, onPlay, onPause }) => {
    const videoId = src.split("v=")[1]?.split("&")[0] || src.split("/").pop();

    if (!isActive) return null;

    return (
      <YouTube
        videoId={videoId}
        opts={{
          width: "100%",
          height: "315",
          playerVars: {
            autoplay: 1,
          },
        }}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={() => setActiveVideos({})}
      />
    );
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const renderVideoSection = (videos, sectionKey) => {
    return (
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
                className={`video-title-wrapper ${
                  isOtherVideoPlaying ? "disabled" : ""
                }`}
                onClick={() => {
                  if (isOtherVideoPlaying) {
                    scrollToActiveVideo();
                  } else {
                    toggleVideo(sectionKey, index);
                  }
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
                src={video.src}
                isActive={isVideoActive}
                onPlay={() => {
                  if (isHeroPlaying) {
                    handleHeroPlayPause();
                  }
                }}
                onPause={() => {
                  setActiveVideos((prev) => ({
                    ...prev,
                    [videoKey]: false,
                  }));
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

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
    let totalScore = 0;
    const mcQuestions =
      tatariases.find((style) => style.title === "Latihan")?.questions
        ?.multipleChoice || [];
    const essayQuestions =
      tatariases.find((style) => style.title === "Latihan")?.questions?.essay ||
      [];

    mcQuestions.forEach((q, index) => {
      if (mcAnswers[index] === q.answer) totalScore += 1;
    });

    essayQuestions.forEach((q, index) => {
      const answer = essayAnswers[index] || "";
      const matchedKeywords = q.keyWords.filter((keyword) =>
        answer.toLowerCase().includes(keyword.toLowerCase())
      );
      totalScore += matchedKeywords.length / q.keyWords.length;
    });

    const percentageScore =
      (totalScore / (mcQuestions.length + essayQuestions.length)) * 100;
    setScore(percentageScore.toFixed(2));
  };

  const validateAnswers = () => {
    const newErrors = {};
    const mcQuestions =
      tatariases.find((style) => style.title === "Latihan")?.questions
        ?.multipleChoice || [];
    const essayQuestions =
      tatariases.find((style) => style.title === "Latihan")?.questions?.essay ||
      [];

    mcQuestions.forEach((_, index) => {
      if (mcAnswers[index] === undefined) {
        newErrors[`mc-${index}`] = "Harap pilih salah satu jawaban.";
      }
    });

    essayQuestions.forEach((_, index) => {
      if (!essayAnswers[index] || essayAnswers[index].trim() === "") {
        newErrors[`essay-${index}`] = "Harap isi jawaban essay.";
      }
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
      scrollToFirstUnanswered();
    }
  };

  const handleConfirmSubmit = () => {
    calculateScore();
    setShowResults(true);
    setShowPopup(false);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setShowPopup(true);
    setPopupMessage("Mau reset soal?");
    setPopupType("reset");
  };

  const handleConfirmReset = () => {
    setMcAnswers({});
    setEssayAnswers({});
    setShowResults(false);
    setScore(0);
    setErrors({});
    setShowPopup(false);
    scrollToExerciseSection();
  };

  const scrollToFirstUnanswered = () => {
    const firstUnansweredQuestion = document.querySelector(
      ".question.unanswered"
    );
    if (firstUnansweredQuestion) {
      firstUnansweredQuestion.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToExerciseSection = () => {
    if (exerciseSectionRef.current) {
      exerciseSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const renderClassDescription = (classInfo) => (
    <div className="tatarias-content">
      <img src={classInfo.image} alt={classInfo.title} />
      <div className="tatarias-info">
        <h3>{classInfo.title}</h3>
        {Array.isArray(classInfo.description) ? (
          <ul>
            {classInfo.description.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>{classInfo.description}</p>
        )}
      </div>
    </div>
  );

  const renderMultiSectionContent = (title, sections) => (
    <div className="multi-section-content">
      <h3>{title}</h3>
      {sections.map((section, index) => (
        <div key={index} className="content-container">
          <img src={section.image} alt={section.subTitle} />
          <div className="content-info">
            <h4>{section.subTitle}</h4>
            <p>{section.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFlexibleContentSection = (title, contents) => (
    <section className="flexible-content-section">
      <h3>{title}</h3>
      {contents.map((content, index) => (
        <div key={index} className="flexible-content-item">
          <h4>{content.subtitle}</h4>
          {content.subtitle === "Persiapan Pribadi" && (
            <img
              src={Bahagia}
              alt="Persiapan Pribadi"
              className="content-image"
            />
          )}
          {content.subtitle === "Persiapan Klien" ? (
            <div className="content-with-image">
              <img
                src={FotoKlien}
                alt="Persiapan Klien"
                className="content-image"
              />
              <div>
                {Array.isArray(content.description) ? (
                  content.description.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))
                ) : (
                  <p>{content.description}</p>
                )}
              </div>
            </div>
          ) : (
            <>
              {Array.isArray(content.description) ? (
                content.description.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))
              ) : (
                <p>{content.description}</p>
              )}
            </>
          )}
          {content.items && (
            <ul>
              {content.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          )}
          {content.categories && (
            <div className="tool-categories">
              {content.categories.map((category, catIndex) => (
                <div key={catIndex} className="tool-category">
                  <h5>{category.title}</h5>
                  {category.description && <p>{category.description}</p>}
                  <div className="tool-items">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="tool-item">
                        <img src={item.image} alt={item.subtitle} />
                        <div className="tool-info">
                          <h6>{item.subtitle}</h6>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );

  const services = [
    {
      title: "Pengenalan",
      icon: <CgCalendarDates />,
      descriptions: [
        "Website kami menyediakan semua yang kamu butuhkan untuk belajar Tata Rias secara mandiri. Mulai dari video tutorial berkualitas tinggi, panduan langkah demi langkah, hingga forum diskusi yang aktif. Semua dikemas dalam satu platform yang mudah diakses dan dinavigasi.",
      ],
      details: [
        {
          title: "Dibuat untuk",
          items: [
            "Orang yang ingin belajar Teknik Dasar Tata Rias.",
            "Pemula yang ingin belajar Teknik Riasan Wajah.",
            "Orang yang ingin belajar hal baru dalam dunia kecantikan.",
          ],
        },
        {
          title: "Kompetensi Dasar",
          items: [
            "Menerapkan teknik dasar tata rias wajah.",
            "Menganalisis berbagai jenis kulit dan bentuk wajah untuk menentukan teknik riasan yang sesuai.",
            "Memilih produk kosmetik yang tepat sesuai dengan jenis kulit, warna kulit, dan tujuan riasan.",
            "Merawat peralatan dan bahan riasan agar tetap bersih dan awet.",
          ],
        },
        {
          title: "Indikator Pencapaian Kompetensi",
          items: [
            "Menguraikan konsep dasar tata rias wajah.",
            "Memilih alat dan bahan rias wajah sesuai fungsi dan cara penggunaan.",
            "Menganalisis teknik tata rias wajah sesuai dengan konsep dasar.",
            "Merencanakan tata rias wajah sesuai dengan prosedur.",
          ],
        },
      ],
    },
    {
      title: "Apa yang dibutuhkan",
      icon: <CgCheckO />,
      descriptions: [
        "Untuk mengikuti kursus ini dengan efektif, Anda akan memerlukan beberapa peralatan dan bahan penting. Berikut adalah daftar lengkap yang akan membantu Anda mempersiapkan diri untuk memulai perjalanan belajar Tata Rias Anda.",
      ],
      details: [
        { icon: <FaScissors />, text: "Kuas makeup set" },
        { icon: <FaRuler />, text: "Spons dan beauty blender" },
        { icon: <FaSprayCan />, text: "Foundation dan concealer" },
        { icon: <PiHairDryerFill />, text: "Bedak tabur dan padat" },
        { icon: <FaEye />, text: "Eyeshadow palette" },
        { icon: <GiSemiClosedEye />, text: "Mascara dan eyeliner" },
        { icon: <GiLipstick />, text: "Lipstick dan lip liner" },
        { icon: <FaRegSmileBeam />, text: "Blush on dan bronzer" },
      ],
    },
    {
      title: "Video",
      icon: <BsFillPlayCircleFill />,
      descriptions: [
        "Dibawah ini adalah video yang wajib ditonton untuk pembelajaran yang memadai",
      ],
      videos: [
        {
          title: "Pengenalan Alat dan Bahan Tata Rias",
          src: "https://www.youtube.com/watch?v=c96leQ_fRII",
          type: "youtube",
        },
        {
          title: "Dasar-dasar Tata Rias Wajah",
          src: "https://youtu.be.com/watch?v=7RGiRqOVxeo",
          type: "youtube",
        },
      ],
    },
  ];

  const flexibleContent = {
    title: "Persiapan Kerja",
    contents: [
      {
        subtitle: "Persiapan Area Kerja",
        description:
          "Kondisi ruangan dalam keadaan nyaman, bersih dari kotoran dan debu",
      },
      {
        subtitle: "Persiapan Alat dan Bahan",
        description:
          "Berbagai alat tata rias wajah dapat digunakan, dengan ketentuan memenuhi standar minimal kebutuhan, kelayakan dan aman digunakan, contohnya:",
        categories: [
          {
            title: "Pertama",
            description: "Kuas Makeup",
            items: [
              {
                subtitle: "Kuas Foundation",
                image: foto1,
                description: "Mengaplikasikan foundation secara merata",
              },
              {
                subtitle: "Kuas Blush On",
                image: foto2,
                description: "Mengaplikasikan perona pipi",
              },
              {
                subtitle: "Kuas Eyeshadow",
                image: foto3,
                description: "Mengaplikasikan eyeshadow pada kelopak mata",
              },
            ],
          },
          {
            title: "Kedua",
            description: "Spons dan Beauty Blender",
            items: [
              {
                subtitle: "Beauty Blender",
                image: foto4,
                description: "Mengaplikasikan dan meratakan foundation",
              },
              {
                subtitle: "Spons Bedak",
                image: foto5,
                description: "Mengaplikasikan bedak tabur atau padat",
              },
            ],
          },
          {
            title: "Ketiga",
            description: "Alat Penunjang Tata Rias",
            items: [
              {
                subtitle: "Palet Makeup",
                image: foto6,
                description: "Mencampur foundation atau concealer",
              },
              {
                subtitle: "Penjepit Bulu Mata",
                image: foto7,
                description: "Melentikkan bulu mata sebelum aplikasi mascara",
              },
              {
                subtitle: "Pisau Alis",
                image: foto8,
                description: "Membentuk dan merapikan alis",
              },
              {
                subtitle: "Pencukur Alis",
                image: foto9,
                description: "Merapikan dan membentuk alis",
              },
              {
                subtitle: "Kapas",
                image: foto10,
                description: "Membersihkan wajah atau menghapus makeup",
              },
              {
                subtitle: "Cotton Bud",
                image: foto11,
                description: "Mengoreksi kesalahan kecil dalam aplikasi makeup",
              },
              {
                subtitle: "Cermin",
                image: foto12,
                description: "Melihat hasil riasan dan detail wajah",
              },
              {
                subtitle: "Tissue",
                image: foto13,
                description:
                  "Menghapus kelebihan produk atau membersihkan alat",
              },
              {
                subtitle: "Tempat Kuas",
                image: foto14,
                description: "Menyimpan kuas agar tetap bersih dan rapi",
              },
              {
                subtitle: "Tas Makeup",
                image: foto15,
                description: "Menyimpan dan membawa peralatan makeup",
              },
            ],
          },
        ],
      },
      {
        subtitle: "Persiapan Pribadi",
        description:
          "Seorang makeup artist profesional harus mempersiapkan diri secara profesional sebelum melayani klien. Berikut adalah standar persiapan yang wajib dilakukan:",
        items: [
          "Mengenakan seragam kerja yang rapi dan profesional",
          "Menjaga kebersihan diri termasuk kuku, rambut, dan nafas",
          "Menggunakan makeup natural namun tetap profesional",
          "Menata rambut dengan rapi agar tidak mengganggu pekerjaan",
          "Menggunakan sepatu yang nyaman dan anti slip",
          "Menghindari penggunaan perhiasan berlebihan",
          "Menjaga kesehatan dan kebersihan tangan",
          "Menggunakan masker saat diperlukan",
          "Menjaga sikap profesional dan ramah",
          "Mempersiapkan mental dan kepercayaan diri",
        ],
      },
      {
        subtitle: "Persiapan Klien",
        description:
          "Layanan makeup yang profesional memerlukan tahapan dan prosedur yang tepat. Berikut adalah prosedur standar dalam pelayanan makeup:",
        items: [
          "Melakukan konsultasi awal dengan klien tentang look yang diinginkan",
          "Menganalisa jenis kulit dan warna kulit klien",
          "Membersihkan wajah klien dengan produk yang sesuai",
          "Mengaplikasikan skincare dan primer yang tepat",
          "Melakukan color matching untuk foundation",
          "Mengaplikasikan makeup sesuai teknik dan tahapan yang benar",
          "Melakukan check up berkala selama proses makeup",
          "Memastikan hasil akhir sesuai keinginan klien",
          "Memberikan tips touch up dan maintenance",
          "Mendokumentasikan hasil makeup (dengan izin klien)",
        ],
      },
    ],
  };

  const tatariases = [
    {
      title: "Deskripsi Kelas",
      image: MaterialImage,
      description: "Teknik Dasar Tata Rias Wajah",
      content: {
        ringkasan:
          "Kelas ini menyajikan pengetahuan komprehensif tentang teknik dasar tata rias wajah, mulai dari konsep dasar hingga prosedur praktis. Peserta akan mempelajari definisi, tujuan, komponen, dan langkah-langkah detail dalam melakukan tata rias wajah dasar.",
        tujuan: [
          "Memahami konsep dan prinsip dasar teknik tata rias wajah",
          "Mengidentifikasi tujuan dan manfaat tata rias wajah",
          "Mengenali komponen-komponen penting dalam teknik tata rias wajah",
          "Melaksanakan prosedur tata rias wajah dengan benar",
          "Mempersiapkan area kerja, alat, dan bahan yang diperlukan",
          "Menerapkan persiapan pribadi dan klien yang tepat",
          "Melakukan kegiatan berkemas pasca-tata rias",
        ],
        materi: [
          {
            title: "Pengantar Teknik Tata Rias Wajah",
            items: [
              "Definisi dan etimologi tata rias wajah",
              "Penjelasan khusus tentang tata rias wajah dasar",
            ],
          },
          {
            title: "Tujuan dan Manfaat Teknik Tata Rias Wajah",
            items: [],
          },
          {
            title: "Komponen Teknik Tata Rias Wajah",
            items: [
              "Bentuk Wajah",
              "Warna Kulit",
              "Jenis Kulit",
              "Koreksi Wajah",
            ],
          },
          {
            title: "Prosedur Tata Rias Wajah",
            items: [
              "Langkah-langkah detail",
              "Teknik aplikasi produk makeup",
              "Finishing dan touch up",
            ],
          },
          {
            title: "Persiapan Kerja",
            items: [
              "Persiapan area kerja",
              "Alat dan bahan yang diperlukan",
              "Fungsi masing-masing alat",
            ],
          },
          {
            title: "Persiapan Pribadi dan Klien",
            items: [
              "Standar penampilan dan sikap profesional",
              "Persiapan klien untuk kenyamanan dan keamanan",
            ],
          },
          {
            title: "Kegiatan Berkemas Pasca-Tata Rias",
            items: [],
          },
        ],
        metode: [
          "Teori dan konsep",
          "Demonstrasi teknik",
          "Praktik langsung",
          "Diskusi dan tanya jawab",
        ],
        durasi: "8 jam atau 2 hari",
        target: [
          "Mahasiswa tata rias",
          "Makeup artist pemula",
          "Profesional yang ingin meningkatkan keterampilan",
        ],
        evaluasi: [
          "Ujian tertulis untuk pemahaman teori",
          "Praktik tata rias wajah",
          "Penilaian persiapan dan kebersihan area kerja",
        ],
        sertifikasi:
          "Peserta yang berhasil menyelesaikan kelas dan lulus evaluasi akan menerima sertifikat kompetensi dalam Teknik Dasar Tata Rias Wajah.",
      },
    },
    {
      title: "Materi",
      content: [
        {
          image: TatariasBackground,
          title: "Konsep Modul",
          description:
            "Materi yang terdapat dalam E-Modul ini menyajikan pengetahuan tentang teknik dasar tata rias wajah.",
        },
        {
          image: FotoRambut,
          title: "Apa itu Teknik Tata Rias Wajah Dasar?",
          description:
            "Secara 'etimologi', kata tata rias terdiri dari kata 'tata' yang artinya atur, dan 'rias' yang artinya hias, sehingga tata rias merupakan tindakan mengatur atau menghias yang dalam dunia kecantikan tindakan menghias wajah. Pengertian tata rias wajah bisa diartikan sebagai seni mengubah penampilan wajah menjadi lebih sempurna menggunakan kosmetika yang dapat menutupi atau menyamarkan kekurangan-kekurangan yang ada pada wajah dan menonjolkan kelebihan yang ada pada wajah sehingga tercapai kecantikan yang sempurna. Tata rias wajah dasar adalah riasan wajah sehari-hari dengan penekanan pada penggunaan kosmetik yang minimal untuk mendapatkan hasil yang alami.",
        },
        {
          image: HairPhoto,
          title: "Tujuan Teknik Tata Rias Wajah Dasar",
          description: [
            "Meningkatkan penampilan wajah",
            "Menutupi kekurangan pada wajah",
            "Menonjolkan kelebihan pada wajah",
            "Memberikan kesan segar pada wajah",
            "Meningkatkan kepercayaan diri",
            "Menyesuaikan penampilan dengan acara atau kesempatan tertentu",
          ],
        },
      ],
      multiSectionContent: [
        {
          title: "Komponen Teknik Tata Rias Wajah Dasar",
          sections: [
            {
              image: Component1,
              subTitle: "Analisis Wajah",
              description:
                "Tata rias wajah dasar dimulai dengan menganalisis bentuk wajah, jenis kulit, dan warna kulit untuk menentukan teknik dan produk yang sesuai.",
            },
            {
              image: Component2,
              subTitle: "Persiapan Kulit",
              description:
                "Membersihkan, melembabkan, dan mempersiapkan kulit wajah sebelum aplikasi makeup untuk hasil yang lebih baik dan tahan lama.",
            },
            {
              image: Component3,
              subTitle: "Aplikasi Dasar",
              description:
                "Pengaplikasian primer, foundation, dan concealer untuk menciptakan kanvas yang sempurna dan menutupi ketidaksempurnaan.",
            },
            {
              image: Component4,
              subTitle: "Teknik Contouring",
              description: (
                <>
                  {
                    "Teknik contouring dan highlighting digunakan untuk membentuk struktur wajah dan memberikan dimensi. Beberapa teknik dasar meliputi:"
                  }
                  {
                    <ol>
                      <li>
                        <strong>Contouring pipi:</strong> Mengaplikasikan produk
                        lebih gelap di bawah tulang pipi untuk memberikan kesan
                        tulang pipi yang tinggi.
                      </li>
                      <li>
                        <strong>Highlight:</strong> Mengaplikasikan produk lebih
                        terang pada bagian-bagian wajah yang menonjol seperti
                        tulang pipi, batang hidung, dan dagu untuk memberikan
                        kesan bercahaya.
                      </li>
                    </ol>
                  }
                </>
              ),
            },
          ],
        },
        {
          title: "Langkah Prosedur Tata Rias Wajah Dasar",
          sections: [
            {
              image: Step1,
              subTitle: "Pertama",
              description: "Bersihkan wajah dan aplikasikan pelembab",
            },
            {
              image: Step2,
              subTitle: "Kedua",
              description:
                "Aplikasikan primer untuk mempersiapkan kulit dan membuat makeup lebih tahan lama",
            },
            {
              image: Step3,
              subTitle: "Ketiga",
              description:
                "Aplikasikan foundation sesuai dengan warna kulit, ratakan dengan beauty blender",
            },
            {
              image: Step4,
              subTitle: "Keempat",
              description:
                "Gunakan concealer untuk menutupi lingkaran hitam dan noda",
            },
            {
              image: Step5,
              subTitle: "Kelima",
              description:
                "Set makeup dengan bedak tabur atau padat untuk hasil yang tahan lama",
            },
            {
              image: Step6,
              subTitle: "Keenam",
              description:
                "Aplikasikan blush on, eyeshadow, mascara, dan lipstik untuk sentuhan akhir",
            },
          ],
        },
      ],
    },
    {
      title: "Video",
      content: [
        {
          sectionTitle: "Pengenalan",
          videos: [
            {
              title: "Pengenalan Tata Rias Wajah",
              src: "https://youtu.be/c96leQ_fRII",
            },
            {
              title: "Dasar-dasar Tata Rias",
              src: "https://youtu.be/c96leQ_fRII",
            },
          ],
        },
        {
          sectionTitle: "Tingkat Lanjut",
          videos: [
            {
              title: "Teknik Contouring Lanjutan",
              src: "https://youtu.be/c96leQ_fRII",
            },
            {
              title: "Tata Rias untuk Acara Khusus",
              src: "https://youtu.be/c96leQ_fRII",
            },
          ],
        },
      ],
    },
    {
      title: "Latihan",
      questions: {
        multipleChoice: [
          {
            question:
              "Tindakan mengubah penampilan wajah menjadi lebih sempurna menggunakan kosmetika adalah definisi dari…",
            options: [
              "Tata rias wajah",
              "Perawatan wajah",
              "Facial",
              "Massage wajah",
              "Peeling wajah",
            ],
            answer: 0,
          },
          {
            question: "Tujuan tata rias wajah adalah sebagai berikut, kecuali…",
            options: [
              "Meningkatkan penampilan",
              "Menutupi kekurangan",
              "Mengubah bentuk wajah secara permanen",
              "Menonjolkan kelebihan",
              "Memberikan kesan segar",
            ],
            answer: 2,
          },
          {
            question:
              "Profesional yang biasa menangani tata rias wajah disebut…",
            image: Component1,
            options: [
              "Perias",
              "Beautician",
              "Makeup Artist",
              "Estetisian",
              "Kosmetolog",
            ],
            answer: 2,
          },
          {
            question:
              "Produk yang digunakan untuk menyamarkan noda atau lingkaran hitam di bawah mata adalah…",
            options: [
              "Foundation",
              "Concealer",
              "Blush On",
              "Highlighter",
              "Bedak",
            ],
            answer: 1,
          },
          {
            question:
              "Teknik untuk membentuk struktur wajah dengan menggunakan produk yang lebih gelap dari warna kulit disebut…",
            options: [
              "Highlighting",
              "Contouring",
              "Strobing",
              "Baking",
              "Setting",
            ],
            answer: 1,
          },
          {
            question:
              "Proses mempersiapkan kulit sebelum aplikasi makeup agar hasil lebih tahan lama disebut…",
            options: [
              "Priming",
              "Setting",
              "Finishing",
              "Cleansing",
              "Moisturizing",
            ],
            answer: 0,
          },
          {
            question:
              "Alat berbentuk telur yang digunakan untuk meratakan foundation disebut…",
            options: [
              "Powder puff",
              "Makeup sponge",
              "Beauty blender",
              "Kuas foundation",
              "Spatula makeup",
            ],
            answer: 2,
          },
          {
            question:
              "Tata rias wajah yang dilakukan dengan cara mengaplikasikan kosmetik secara tipis untuk hasil yang natural disebut…",
            options: [
              "Tata rias panggung",
              "Tata rias karakter",
              "Tata rias fantasi",
              "Tata rias korektif",
              "Tata rias sehari-hari",
            ],
            answer: 4,
          },
          {
            question:
              "Untuk membuat mata terlihat lebih besar, produk yang diaplikasikan pada garis air mata adalah…",
            options: [
              "Eyeliner hitam",
              "Eyeliner putih atau nude",
              "Maskara",
              "Eyeshadow gelap",
              "Bulu mata palsu",
            ],
            answer: 1,
          },
          {
            question:
              "Berikut ini hal yang penting dilakukan saat selesai melakukan tata rias wajah, kecuali…",
            options: [
              "Mengaplikasikan setting spray",
              "Memberikan saran perawatan pasca makeup",
              "Melakukan koreksi akhir",
              "Membersihkan area kerja",
              "Mencuci wajah klien",
            ],
            answer: 4,
          },
        ],
        essay: [
          {
            question:
              "Jelaskan langkah-langkah dalam melakukan tata rias wajah dasar!",
            image: SalonSoal,
            keyWords: [
              "bersihkan wajah",
              "aplikasikan primer",
              "foundation",
              "concealer",
              "set dengan bedak",
            ],
          },
          {
            question: "Apa perbedaan antara highlighting dan contouring?",
            keyWords: [
              "terang",
              "gelap",
              "menonjolkan",
              "menyamarkan",
              "dimensi wajah",
            ],
          },
          {
            question:
              "Bagaimana cara memilih shade foundation yang tepat untuk kulit?",
            keyWords: [
              "uji di rahang",
              "sesuaikan undertone",
              "cek di bawah sinar alami",
              "pertimbangkan jenis kulit",
              "sesuaikan dengan musim",
            ],
          },
        ],
      },
    },
  ];

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

  return (
    <div className="tatarias-page">
      <Navbar />
      <div className="tatarias-container">
        <main>
          <section className="tatarias-hero">
            <div className="hero-content">
              <h1>Belajar Tatarias Untuk Pemula</h1>
              <p>Pemangkasan Rambut Teknik Uniform Layer</p>
              <button
                onClick={() => scrollToSection("course-summary")}
                className="cta-button"
              >
                Gabung Kelas
              </button>
            </div>
            <div className="hero-media">
              <div className="video-container">
                <div className="video-wrapper">
                  <div className="video-inner">
                    <div id="youtube-player"></div>
                    {(!isHeroPlaying ||
                      !isHeroVideoReady ||
                      Object.values(activeVideos).some(Boolean)) && (
                      <div className="video-cover">
                        <div className="cover-content">
                          {Object.values(activeVideos).some(Boolean) ? (
                            <div className="video-warning">
                              <h3>Video sedang diputar di section lain</h3>
                              <p>
                                Matikan video terlebih dahulu untuk melanjutkan
                              </p>
                            </div>
                          ) : (
                            <div className="cover-text">
                              <h2>Teknik Uniform Layer</h2>
                              <p>Tutorial Lengkap Pemangkasan Rambut</p>
                            </div>
                          )}
                          <button
                            className="cover-play-btn"
                            onClick={handleHeroPlayPause}
                            aria-label="Play video"
                            disabled={Object.values(activeVideos).some(Boolean)}
                          >
                            <Play size={40} />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="video-controls">
                      <button
                        className="play-pause-btn"
                        onClick={handleHeroPlayPause}
                        aria-label={isHeroPlaying ? "Pause" : "Play"}
                      >
                        {isHeroPlaying ? (
                          <Pause size={24} />
                        ) : (
                          <Play size={24} />
                        )}
                      </button>
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
                        <button
                          className="mute-btn"
                          onClick={toggleHeroMute}
                          aria-label={isHeroMuted ? "Unmute" : "Mute"}
                        >
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
                          aria-label="Volume"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="services-section" id="course-summary">
            <h2>Course Summary</h2>
            <Tabs
              selectedIndex={activeTab}
              onSelect={(index) => setActiveTab(index)}
              className="services-tabs"
            >
              <TabList>
                {services.map((service, index) => (
                  <Tab key={index}>
                    {service.icon}
                    <h3>{service.title}</h3>
                  </Tab>
                ))}
              </TabList>

              {services.map((service, index) => (
                <TabPanel key={index}>
                  {service.descriptions &&
                    service.descriptions.map((desc, i) => (
                      <p key={i}>{desc}</p>
                    ))}
                  {service.title === "Pengenalan" && (
                    <div className="service-details">
                      {service.details.map((detailSet, i) => (
                        <div key={i} className="competency-section">
                          <h4>{detailSet.title}</h4>
                          <ul className="service-details">
                            {detailSet.items.map((item, j) => (
                              <li key={j}>
                                <BsFillCheckCircleFill />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  {service.title === "Apa yang dibutuhkan" && (
                    <ul className="service-details equipment-list">
                      {service.details.map((detail, i) => (
                        <li key={i}>
                          {detail.icon}
                          {detail.text}
                        </li>
                      ))}
                    </ul>
                  )}
                  {service.title === "Video" &&
                    renderVideoSection(service.videos, "service")}
                </TabPanel>
              ))}
            </Tabs>
          </section>

          <section id="class-course">
            <h2>Class Course</h2>
            <Tabs className="tatarias-tabs">
              <TabList>
                {tatariases.map((style, index) => (
                  <Tab key={index}>{style.title}</Tab>
                ))}
              </TabList>

              {tatariases.map((style, index) => (
                <TabPanel key={index}>
                  {style.title === "Deskripsi Kelas" ? (
                    <div className="tatarias-content">
                      <img src={style.image} alt={style.title} />
                      <div className="tatarias-info">
                        <h3>{style.description}</h3>
                        <h4>Ringkasan Kelas</h4>
                        <p>{style.content.ringkasan}</p>
                        <h4>Tujuan Pembelajaran</h4>
                        <ul>
                          {style.content.tujuan.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        <h4>Materi Kelas</h4>
                        {style.content.materi.map((section, i) => (
                          <div key={i}>
                            <h5>●&nbsp;&nbsp;{section.title}</h5>
                            {section.items.length > 0 && (
                              <ul>
                                {section.items.map((item, j) => (
                                  <li key={j}>{item}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                        <h4>Metode Pembelajaran</h4>
                        <ul>
                          {style.content.metode.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        <h4>Durasi</h4>
                        <p>{style.content.durasi}</p>
                        <h4>Target Peserta</h4>
                        <ul>
                          {style.content.target.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        <h4>Evaluasi</h4>
                        <ul>
                          {style.content.evaluasi.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        <h4>Sertifikasi</h4>
                        <p>{style.content.sertifikasi}</p>
                      </div>
                    </div>
                  ) : style.title === "Materi" ? (
                    <>
                      {style.content.map((classInfo, i) => (
                        <React.Fragment key={i}>
                          {renderClassDescription(classInfo)}
                        </React.Fragment>
                      ))}
                      {style.multiSectionContent.map((sectionContent, i) => (
                        <React.Fragment key={i}>
                          {renderMultiSectionContent(
                            sectionContent.title,
                            sectionContent.sections
                          )}
                        </React.Fragment>
                      ))}
                      {renderFlexibleContentSection(
                        flexibleContent.title,
                        flexibleContent.contents
                      )}
                    </>
                  ) : style.title === "Video" ? (
                    <div className="video-tatarias">
                      <h2 className="video-main-title">Video Materi</h2>
                      {style.content.map((section, sectionIndex) => (
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
                            section.videos,
                            `course-${sectionIndex}`
                          )}
                        </div>
                      ))}
                    </div>
                  ) : style.title === "Latihan" ? (
                    <div className="exercise-section" ref={exerciseSectionRef}>
                      <h3>{style.title}</h3>
                      <div className="multiple-choice">
                        <h4>Pilihan Ganda:</h4>
                        {style.questions.multipleChoice.map((q, i) => (
                          <div
                            key={i}
                            className={`question ${
                              errors[`mc-${i}`] ? "unanswered" : ""
                            }`}
                          >
                            <div className="question-header">
                              <div className="question-number">
                                Soal {i + 1}
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
                              {q.options.map((option, j) => (
                                <li key={j}>
                                  <label>
                                    <input
                                      type="radio"
                                      name={`mc-${i}`}
                                      value={j}
                                      checked={mcAnswers[i] === j}
                                      onChange={() => handleMCAnswer(i, j)}
                                      disabled={showResults}
                                    />
                                    {option}
                                  </label>
                                </li>
                              ))}
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
                      <div className="essay">
                        <h4>Essay:</h4>
                        {style.questions.essay.map((q, i) => (
                          <div
                            key={i}
                            className={`question ${
                              errors[`essay-${i}`] ? "unanswered" : ""
                            }`}
                          >
                            <div className="question-header">
                              <div className="question-number">
                                Soal {i + 1}
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
                                  {q.keyWords.map((keyword, j) => (
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
                      {!showResults ? (
                        <button
                          onClick={handleSubmit}
                          className="submit-button"
                        >
                          Submit
                        </button>
                      ) : (
                        <div className="results" ref={resultsRef}>
                          <h4>Hasil:</h4>
                          <p>Skor Anda: {score}%</p>
                          <button
                            onClick={handleReset}
                            className="reset-button"
                          >
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </TabPanel>
              ))}
            </Tabs>
          </section>
        </main>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
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
      <Footer theme="dark" />
    </div>
  );
};

export default Tatarias;
