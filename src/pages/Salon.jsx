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
import { FaRuler, FaScissors, FaSprayCan } from "react-icons/fa6";
import { PiHairDryerFill } from "react-icons/pi";
import { GiCloak } from "react-icons/gi";
import { GiTowel } from "react-icons/gi";
import { RiBearSmileFill } from "react-icons/ri";
import { SiNeutralinojs } from "react-icons/si";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import YouTube from "react-youtube";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../css/Salon.css";

import SalonBackground from "../assets/images/Class Salon.png";
import FotoRambut from "../assets/images/Foto Rambut.png";
import Bahagia from "../assets/images/Pribadi Salon.png";
import FotoKlien from "../assets/images/Salon Klien.png";
import Component1 from "../assets/images/Salon komponen1.png";
import Component2 from "../assets/images/Salon komponen2.png";
import Component3 from "../assets/images/Salon komponen3.png";
import Component4 from "../assets/images/Salon komponen4.png";
import Step1 from "../assets/images/Salon langkah1.png";
import Step2 from "../assets/images/Salon langkah2.png";
import Step3 from "../assets/images/Salon langkah3.png";
import Step4 from "../assets/images/Salon langkah4.png";
import Step5 from "../assets/images/Salon langkah5.png";
import Step6 from "../assets/images/Salon langkah6.png";
import MaterialImage from "../assets/images/Salon Material.png";
import foto1 from "../assets/images/Salon nomor1.png";
import foto10 from "../assets/images/Salon nomor10.png";
import foto11 from "../assets/images/Salon nomor11.png";
import foto12 from "../assets/images/Salon nomor12.png";
import foto13 from "../assets/images/Salon nomor13.png";
import foto14 from "../assets/images/Salon nomor14.png";
import foto15 from "../assets/images/Salon nomor15.png";
import foto16 from "../assets/images/Salon nomor16.png";
import foto17 from "../assets/images/Salon nomor17.png";
import foto2 from "../assets/images/Salon nomor2.png";
import foto3 from "../assets/images/Salon nomor3.png";
import foto4 from "../assets/images/Salon nomor4.png";
import foto5 from "../assets/images/Salon nomor5.png";
import foto6 from "../assets/images/Salon nomor6.jpg";
import foto7 from "../assets/images/Salon nomor7.png";
import foto8 from "../assets/images/Salon nomor8.png";
import foto9 from "../assets/images/Salon nomor9.png";
import SalonSoal from "../assets/images/SalonSoal.png";
import HairPhoto from "../assets/images/Uniform Layer.png";

const Salon = () => {
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
      const heroSection = document.querySelector(".salon-hero");
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
      salones.find((style) => style.title === "Latihan")?.questions
        ?.multipleChoice || [];
    const essayQuestions =
      salones.find((style) => style.title === "Latihan")?.questions?.essay ||
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
      salones.find((style) => style.title === "Latihan")?.questions
        ?.multipleChoice || [];
    const essayQuestions =
      salones.find((style) => style.title === "Latihan")?.questions?.essay ||
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
    <div className="salon-content">
      <img src={classInfo.image} alt={classInfo.title} />
      <div className="salon-info">
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
        "Website kami menyediakan semua yang kamu butuhkan untuk belajar teknik salon secara mandiri. Mulai dari video tutorial berkualitas tinggi, panduan langkah demi langkah, hingga forum diskusi yang aktif. Semua dikemas dalam satu platform yang mudah diakses dan dinavigasi.",
      ],
      details: [
        {
          title: "Dibuat untuk",
          items: [
            "Orang yang ingin belajar teknik dasar salon.",
            "Pemula yang ingin belajar perawatan rambut.",
            "Orang yang ingin belajar tata rias wajah.",
          ],
        },
        {
          title: "Kompetensi Dasar",
          items: [
            "Menerapkan teknik dasar perawatan rambut.",
            "Menganalisis berbagai jenis kulit dan bentuk wajah untuk perawatan yang sesuai.",
            "Memilih produk kosmetik yang tepat sesuai dengan jenis kulit dan rambut.",
            "Merawat peralatan dan bahan salon agar tetap bersih dan awet.",
          ],
        },
        {
          title: "Indikator Pencapaian Kompetensi",
          items: [
            "Menguraikan konsep dasar perawatan rambut dan kulit.",
            "Memilih alat perawatan sesuai fungsi dan cara penggunaan.",
            "Menganalisis teknik perawatan sesuai dengan kebutuhan klien.",
            "Merencanakan perawatan sesuai dengan prosedur standar salon.",
          ],
        },
      ],
    },
    {
      title: "Apa yang dibutuhkan",
      icon: <CgCheckO />,
      descriptions: [
        "Untuk mengikuti kursus ini dengan efektif, Anda akan memerlukan beberapa peralatan dan bahan penting. Berikut adalah daftar lengkap yang akan membantu Anda mempersiapkan diri untuk memulai perjalanan belajar di dunia salon.",
      ],
      details: [
        { icon: <FaScissors />, text: "Peralatan salon profesional" },
        { icon: <FaRuler />, text: "Alat ukur dan sisir" },
        {
          icon: <FaSprayCan />,
          text: "Produk perawatan rambut dan kulit",
        },
        { icon: <PiHairDryerFill />, text: "Pengering rambut profesional" },
        { icon: <GiCloak />, text: "Jubah salon" },
        { icon: <SiNeutralinojs />, text: "Peralatan sterilisasi" },
        { icon: <GiTowel />, text: "Handuk bersih" },
        {
          icon: <RiBearSmileFill />,
          text: "Boneka latihan untuk praktek",
        },
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
          title: "Pengenalan Peralatan Salon",
          src: "https://www.youtube.com/watch?v=c96leQ_fRII",
          type: "youtube",
        },
        {
          title: "Dasar-dasar Perawatan",
          src: "https://youtu.be.com/watch?v=7RGiRqOVxeo",
          type: "youtube",
        },
      ],
    },
  ];

  const flexibleContent = {
    title: "Persiapan Kerja Salon",
    contents: [
      {
        subtitle: "Persiapan Area Kerja",
        description:
          "Kondisi salon dalam keadaan nyaman, bersih dari kotoran dan debu",
      },
      {
        subtitle: "Persiapan Alat dan Bahan",
        description:
          "Berbagai alat perawatan dapat digunakan, dengan ketentuan memenuhi standar minimal kebutuhan, kelayakan dan aman digunakan, contohnya:",
        categories: [
          {
            title: "Pertama",
            description: "Peralatan Dasar Salon",
            items: [
              {
                subtitle: "Gunting Salon",
                image: foto1,
                description: "Untuk memotong rambut dengan berbagai teknik",
              },
              {
                subtitle: "Sisir Profesional",
                image: foto2,
                description: "Untuk menyisir dan menata rambut",
              },
              {
                subtitle: "Alat Cukur",
                image: foto3,
                description: "Untuk mencukur dan merapikan rambut",
              },
            ],
          },
          {
            title: "Kedua",
            description: "Peralatan Styling",
            items: [
              {
                subtitle: "Hair Dryer",
                image: foto4,
                description: "Mengeringkan dan menata rambut",
              },
              {
                subtitle: "Curling Iron",
                image: foto5,
                description: "Membuat gelombang dan keriting pada rambut",
              },
            ],
          },
          {
            title: "Ketiga",
            description: "Peralatan Pendukung",
            items: [
              {
                subtitle: "Jubah Salon",
                image: foto6,
                description: "Melindungi pakaian klien",
              },
              {
                subtitle: "Handuk",
                image: foto7,
                description: "Mengeringkan rambut dan melindungi klien",
              },
              {
                subtitle: "Semprotan Air",
                image: foto8,
                description: "Membasahi rambut saat perawatan",
              },
              {
                subtitle: "Sisir Besar",
                image: foto9,
                description: "Menyisir rambut setelah pencucian",
              },
              {
                subtitle: "Sisir Ekor",
                image: foto10,
                description: "Memudahkan pembagian rambut",
              },
              {
                subtitle: "Sisir Styling",
                image: foto11,
                description: "Menata dan membentuk rambut",
              },
              {
                subtitle: "Sikat Leher",
                image: foto12,
                description: "Membersihkan area leher dari potongan rambut",
              },
              {
                subtitle: "Sikat Blow",
                image: foto13,
                description: "Menata rambut saat menggunakan pengering",
              },
              {
                subtitle: "Jepit Rambut",
                image: foto14,
                description: "Menjepit bagian rambut saat penataan",
              },
              {
                subtitle: "Jepit Salon",
                image: foto15,
                description: "Mengatur bagian rambut saat perawatan",
              },
              {
                subtitle: "Botol Spray",
                image: foto16,
                description: "Menyemprotkan air atau produk perawatan",
              },
              {
                subtitle: "Pengering Rambut",
                image: foto17,
                description:
                  "Mengeringkan rambut dengan suhu yang dapat diatur",
              },
            ],
          },
        ],
      },
      {
        subtitle: "Persiapan Pribadi",
        description: "Seorang ahli salon harus memperhatikan hal-hal berikut:",
        items: [
          "Mengenakan riasan wajah yang profesional",
          "Rambut ditata rapi dan profesional",
          "Memakai seragam salon yang bersih dan rapi",
          "Mengenakan sepatu yang nyaman dan aman",
          "Tidak mengenakan perhiasan berlebihan",
          "Menjaga kebersihan mulut dan tubuh",
          "Menjaga kebersihan kuku dan kulit",
          "Menampilkan sikap ramah dan profesional",
          "Berkomunikasi dengan sopan",
          "Siap mental dan percaya diri",
        ],
      },
      {
        subtitle: "Persiapan Klien",
        description: [
          "Persiapan klien dilakukan untuk meningkatkan kenyamanan selama perawatan. Berikan jubah salon yang bersih dan pastikan klien merasa nyaman.",
          "Setelah menyelesaikan perawatan, lakukan pembersihan area kerja:",
        ],
        items: [
          "Membersihkan dan mensterilkan alat-alat",
          "Menyimpan produk dengan benar",
          "Membersihkan area salon",
          "Mematikan peralatan listrik",
        ],
      },
      {
        subtitle: "Persiapan Pribadi",
        description:
          "Seorang hair stylist harus memperhatikan penampilan dan kesiapan diri sebelum melayani klien. Standar persiapan meliputi:",
        items: [
          "Mengenakan seragam salon yang bersih dan rapi",
          "Menjaga kebersihan dan kerapian diri",
          "Menggunakan sepatu anti slip yang nyaman",
          "Menata rambut dengan rapi",
          "Menjaga kebersihan kuku dan tangan",
          "Menggunakan aksesoris minimal",
          "Menjaga kesegaran nafas dan tubuh",
          "Mempersiapkan alat pelindung diri",
          "Menjaga postur yang baik",
          "Mempersiapkan kondisi fisik dan mental",
        ],
      },
      {
        subtitle: "Persiapan Klien",
        description:
          "Layanan salon yang profesional memerlukan prosedur yang terstandar. Berikut tahapan pelayanan salon yang perlu diperhatikan:",
        items: [
          "Melakukan konsultasi dengan klien tentang model yang diinginkan",
          "Menganalisa jenis rambut dan kulit kepala",
          "Mencatat riwayat perawatan sebelumnya",
          "Melakukan tes sensitivitas jika diperlukan",
          "Menjelaskan prosedur yang akan dilakukan",
          "Mengaplikasikan produk sesuai prosedur",
          "Memantau proses dan waktu processing",
          "Melakukan teknik styling sesuai permintaan",
          "Memberikan saran perawatan di rumah",
          "Membuat jadwal maintenance berikutnya",
        ],
      },
    ],
  };

  const salones = [
    {
      title: "Deskripsi Kelas",
      image: MaterialImage,
      description: "Teknik Dasar Perawatan Salon",
      content: {
        ringkasan:
          "Kelas ini menyajikan pengetahuan komprehensif tentang teknik dasar perawatan di salon, mulai dari konsep dasar hingga prosedur praktis. Peserta akan mempelajari definisi, tujuan, komponen, dan langkah-langkah detail dalam melakukan berbagai perawatan salon.",
        tujuan: [
          "Memahami konsep dan prinsip dasar teknik perawatan salon",
          "Mengidentifikasi tujuan dan manfaat setiap perawatan",
          "Mengenali komponen-komponen penting dalam teknik perawatan",
          "Melaksanakan prosedur perawatan dengan benar",
          "Mempersiapkan area kerja, alat, dan bahan yang diperlukan",
          "Menerapkan persiapan pribadi dan klien yang tepat",
          "Melakukan kegiatan berkemas pasca-perawatan",
        ],
        materi: [
          {
            title: "Pengantar Teknik Perawatan Salon",
            items: [
              "Definisi dan dasar perawatan salon",
              "Penjelasan khusus tentang berbagai jenis perawatan",
            ],
          },
          {
            title: "Tujuan dan Manfaat Perawatan Salon",
            items: [],
          },
          {
            title: "Komponen Teknik Perawatan",
            items: [
              "Analisis Kebutuhan",
              "Pemilihan Produk",
              "Teknik Aplikasi",
              "Evaluasi Hasil",
            ],
          },
          {
            title: "Prosedur Perawatan Salon",
            items: [
              "Langkah-langkah detail",
              "Teknik aplikasi produk",
              "Pemeriksaan hasil dan finishing",
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
            title: "Kegiatan Pasca-Perawatan",
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
          "Beautician pemula",
          "Profesional yang ingin meningkatkan keterampilan",
        ],
        evaluasi: [
          "Ujian tertulis untuk pemahaman teori",
          "Praktik perawatan salon",
          "Penilaian persiapan dan kebersihan area kerja",
        ],
        sertifikasi:
          "Peserta yang berhasil menyelesaikan kelas dan lulus evaluasi akan menerima sertifikat kompetensi dalam Teknik Perawatan Salon Dasar.",
      },
    },
    {
      title: "Materi",
      content: [
        {
          image: SalonBackground,
          title: "Konsep Modul",
          description:
            "Materi yang terdapat dalam E-Modul ini menyajikan pengetahuan tentang teknik-teknik perawatan salon dasar.",
        },
        {
          image: FotoRambut,
          title: "Apa itu Perawatan Salon?",
          description:
            "Perawatan salon adalah serangkaian tindakan profesional untuk merawat dan mempercantik penampilan seseorang. Ini mencakup perawatan rambut, kulit, kuku, dan berbagai treatment kecantikan lainnya. Setiap perawatan memiliki teknik dan prosedur khusus yang harus diikuti untuk mendapatkan hasil optimal.",
        },
        {
          image: HairPhoto,
          title: "Tujuan Perawatan Salon",
          description: [
            "Meningkatkan kesehatan rambut dan kulit",
            "Memperbaiki penampilan",
            "Merawat dan memelihara kecantikan",
            "Memberikan relaksasi",
            "Meningkatkan kepercayaan diri",
            "Mengatasi masalah kecantikan spesifik",
          ],
        },
      ],
      multiSectionContent: [
        {
          title: "Komponen Perawatan Salon",
          sections: [
            {
              image: Component1,
              subTitle: "Analisis",
              description:
                "Menganalisis kondisi dan kebutuhan klien untuk menentukan jenis perawatan yang sesuai.",
            },
            {
              image: Component2,
              subTitle: "Persiapan",
              description:
                "Mempersiapkan alat, bahan, dan area kerja sesuai dengan standar kebersihan dan keamanan.",
            },
            {
              image: Component3,
              subTitle: "Pelaksanaan",
              description:
                "Melakukan perawatan sesuai dengan prosedur dan teknik yang telah ditentukan.",
            },
            {
              image: Component4,
              subTitle: "Evaluasi",
              description:
                "Mengevaluasi hasil perawatan dan memberikan saran untuk perawatan lanjutan di rumah.",
            },
          ],
        },
        {
          title: "Langkah Prosedur Perawatan",
          sections: [
            {
              image: Step1,
              subTitle: "Konsultasi",
              description: "Melakukan konsultasi awal dengan klien",
            },
            {
              image: Step2,
              subTitle: "Analisis",
              description: "Menganalisis kondisi dan kebutuhan perawatan",
            },
            {
              image: Step3,
              subTitle: "Persiapan",
              description: "Menyiapkan alat dan bahan yang diperlukan",
            },
            {
              image: Step4,
              subTitle: "Perawatan",
              description: "Melakukan perawatan sesuai prosedur",
            },
            {
              image: Step5,
              subTitle: "Finishing",
              description: "Memberikan sentuhan akhir dan memeriksa hasil",
            },
            {
              image: Step6,
              subTitle: "Evaluasi",
              description: "Mengevaluasi hasil akhir perawatan",
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
              title: "Pengenalan Dunia Salon",
              src: "https://youtu.be/c96leQ_fRII",
            },
            {
              title: "Dasar-dasar Salon",
              src: "https://youtu.be/c96leQ_fRII",
            },
          ],
        },
        {
          sectionTitle: "Tingkat Lanjut",
          videos: [
            {
              title: "Teknik Perawatan Lanjutan",
              src: "https://youtu.be/c96leQ_fRII",
            },
            {
              title: "Perawatan Spesial",
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
              "Tindakan profesional untuk merawat dan mempercantik penampilan seseorang di salon disebut...",
            options: [
              "Perawatan salon",
              "Kosmetologi",
              "Terapi kecantikan",
              "Spa",
              "Beauty care",
            ],
            answer: 0,
          },
          {
            question:
              "Berikut ini yang bukan merupakan tujuan perawatan salon adalah...",
            options: [
              "Meningkatkan kesehatan",
              "Memperbaiki penampilan",
              "Mengubah kepribadian",
              "Memberikan relaksasi",
              "Meningkatkan kepercayaan diri",
            ],
            answer: 2,
          },
          {
            question:
              "Petugas salon yang menangani perawatan rambut disebut...",
            options: [
              "Hairdresser",
              "Beautician",
              "Therapist",
              "Stylist",
              "Konsultan",
            ],
            answer: 0,
          },
          {
            question:
              "Analisis awal yang dilakukan sebelum perawatan bertujuan untuk...",
            options: [
              "Menentukan harga",
              "Menentukan jenis perawatan",
              "Menghemat waktu",
              "Mempercepat proses",
              "Mengatur jadwal",
            ],
            answer: 1,
          },
          {
            question: "Alat sterilisasi di salon berfungsi untuk...",
            options: [
              "Membersihkan alat",
              "Mensterilkan peralatan",
              "Menyimpan alat",
              "Mengeringkan alat",
              "Mengatur suhu",
            ],
            answer: 1,
          },
          {
            question:
              "Teknik mengeringkan rambut dengan sikat bulat disebut...",
            options: [
              "Blow dry",
              "Hair dry",
              "Natural dry",
              "Quick dry",
              "Air dry",
            ],
            answer: 0,
          },
          {
            question: "Fungsi utama jubah salon adalah...",
            image: foto6,
            options: [
              "Melindungi pakaian klien",
              "Menyerap air",
              "Menghias klien",
              "Menghangatkan tubuh",
              "Menyerap keringat",
            ],
            answer: 0,
          },
          {
            question: "Tahap pertama dalam prosedur perawatan salon adalah...",
            options: [
              "Persiapan alat",
              "Konsultasi",
              "Analisis",
              "Pembersihan",
              "Perawatan",
            ],
            answer: 1,
          },
          {
            question:
              "Alat yang digunakan untuk membersihkan area leher setelah potong rambut adalah...",
            options: [
              "Sikat rambut",
              "Sikat leher",
              "Handuk",
              "Tissue",
              "Kuas",
            ],
            answer: 1,
          },
          {
            question:
              "Yang tidak termasuk dalam evaluasi hasil perawatan adalah...",
            options: [
              "Memeriksa hasil",
              "Memberikan saran",
              "Menawarkan produk",
              "Membuat janji",
              "Mengatur harga",
            ],
            answer: 4,
          },
        ],
        essay: [
          {
            question:
              "Jelaskan langkah-langkah dalam melakukan konsultasi awal dengan klien salon!",
            image: SalonSoal,
            keyWords: [
              "sapa klien",
              "tanya kebutuhan",
              "analisis kondisi",
              "rekomendasikan perawatan",
              "jelaskan prosedur",
            ],
          },
          {
            question: "Apa perbedaan antara perawatan salon dasar dan khusus?",
            keyWords: [
              "tingkat kompleksitas",
              "durasi perawatan",
              "alat khusus",
              "keahlian",
              "hasil",
            ],
          },
          {
            question:
              "Bagaimana cara memastikan kepuasan klien setelah perawatan?",
            keyWords: [
              "tanya pendapat",
              "evaluasi hasil",
              "berikan saran",
              "tawarkan produk",
              "jadwalkan perawatan lanjutan",
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
    <div className="salon-page">
      <Navbar />
      <div className="salon-container">
        <main>
          <section className="salon-hero">
            <div className="hero-content">
              <h1>Belajar Salon dari Awal sampai Mahir</h1>
              <p>Ilmu Salon Dasar</p>
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
                              <h2>Ilmu Salon dasar</h2>
                              <p>Tutorial Lengkap Salon Dasar</p>
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
            <Tabs className="salon-tabs">
              <TabList>
                {salones.map((style, index) => (
                  <Tab key={index}>{style.title}</Tab>
                ))}
              </TabList>

              {salones.map((style, index) => (
                <TabPanel key={index}>
                  {style.title === "Deskripsi Kelas" ? (
                    <div className="salon-content">
                      <img src={style.image} alt={style.title} />
                      <div className="salon-info">
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
                    <div className="video-salon">
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

export default Salon;
