import AOS from "aos";
import "aos/dist/aos.css";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BsFillCheckCircleFill,
  BsFillPauseFill,
  BsFillPlayCircleFill,
} from "react-icons/bs";
import { GiCloak, GiTowel } from "react-icons/gi";
import { CgCalendarDates, CgCheckO } from "react-icons/cg";
import {
  FaRuler,
  FaScissors,
  FaSprayCan,
  FaSnowman,
  FaBottleDroplet,
} from "react-icons/fa6";
import { PiHairDryerFill } from "react-icons/pi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import YouTube from "react-youtube";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../css/Hairstyle.css";

import HairstyleBackground from "../assets/images/Class Hairstyle.png";
import FotoRambut from "../assets/images/Foto Rambut.png";
import MaterialImage from "../assets/images/Hairstyle Material.png";
import gunting1 from "../assets/images/hairstylegunting1.png";
import gunting2 from "../assets/images/hairstylegunting2.png";
import gunting3 from "../assets/images/hairstylegunting3.png";
import gunting4 from "../assets/images/hairstylegunting4.png";
import gunting5 from "../assets/images/hairstylegunting5.png";
import Component1 from "../assets/images/hairstylekomponen1.jpg";
import Component2 from "../assets/images/hairstylekomponen2.jpg";
import Component3 from "../assets/images/hairstylekomponen3.jpg";
import Component4 from "../assets/images/hairstylekomponen4.jpg";
import Step1 from "../assets/images/hairstylelangkah1.jpg";
import Step2 from "../assets/images/hairstylelangkah2.png";
import Step3 from "../assets/images/hairstylelangkah3.jpg";
import Step4 from "../assets/images/hairstylelangkah4.jpg";
import Step5 from "../assets/images/hairstylelangkah5.png";
import Step6 from "../assets/images/hairstylelangkah6.jpeg";
import nomor1 from "../assets/images/hairstylenomor1.png";
import nomor10 from "../assets/images/hairstylenomor10.png";
import nomor11 from "../assets/images/hairstylenomor11.png";
import nomor12 from "../assets/images/hairstylenomor12.png";
import nomor2 from "../assets/images/hairstylenomor2.png";
import nomor3 from "../assets/images/hairstylenomor3.png";
import nomor4 from "../assets/images/hairstylenomor4.png";
import nomor5 from "../assets/images/hairstylenomor5.png";
import nomor6 from "../assets/images/hairstylenomor6.png";
import nomor7 from "../assets/images/hairstylenomor7.png";
import nomor8 from "../assets/images/hairstylenomor8.png";
import nomor9 from "../assets/images/hairstylenomor9.png";
import FotoKlien from "../assets/images/Hairstyle Klien.png";
import Bahagia from "../assets/images/Pribadi Hairstyle.png";
import SalonSoal from "../assets/images/SalonSoal.png";
import PilihanGanda from "../assets/images/Sudut 90.png";
import HairPhoto from "../assets/images/Uniform Layer.png";

const Hairstyle = () => {
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
      const heroSection = document.querySelector(".hairstyle-hero");
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
      hairstyles.find((style) => style.title === "Latihan")?.questions
        ?.multipleChoice || [];
    const essayQuestions =
      hairstyles.find((style) => style.title === "Latihan")?.questions?.essay ||
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
      hairstyles.find((style) => style.title === "Latihan")?.questions
        ?.multipleChoice || [];
    const essayQuestions =
      hairstyles.find((style) => style.title === "Latihan")?.questions?.essay ||
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
    <div className="hairstyle-content">
      <img src={classInfo.image} alt={classInfo.title} />
      <div className="hairstyle-info">
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
        "Website kami menyediakan semua yang kamu butuhkan untuk belajar Hairstyle secara mandiri. Mulai dari video tutorial berkualitas tinggi, panduan langkah demi langkah, hingga forum diskusi yang aktif. Semua dikemas dalam satu platform yang mudah diakses dan dinavigasi.",
      ],
      details: [
        {
          title: "Dibuat untuk",
          items: [
            "Orang yang ingin belajar Teknik Pangkas.",
            "Pemula yang ingin belajar Teknik Uniform Layer.",
            "Orang yang ingin belajar hal baru.",
          ],
        },
        {
          title: "Kompetensi Dasar",
          items: [
            "Menerapkan pemangkasan rambut Teknik uniform layer.",
            "Menganalisis berbagai jenis kulit dan bentuk wajah untuk menentukan teknik riasan yang sesuai.",
            "Memilih produk kosmetik yang tepat sesuai dengan jenis kulit, warna kulit, dan tujuan riasan.",
            "Merawat peralatan dan bahan riasan agar tetap bersih dan awet.",
          ],
        },
        {
          title: "Indikator Pencapaian Kompetensi",
          items: [
            "Menguraikan konsep dasar pemangkasan rambut Teknik uniform layer.",
            "Memilih alat pemangkasan rambut sesuai fungsi dan cara penggunaan alat.",
            "Menganalisis Teknik pemangkasan rambut Teknik uniform layer sesuai dengan konsep pemangkasan.",
            "Merencanakan pemangkasan rambut Teknik uniform layer sesuai dengan prosedur.",
          ],
        },
      ],
    },
    {
      title: "Apa yang dibutuhkan",
      icon: <CgCheckO />,
      descriptions: [
        "Untuk mengikuti kursus ini dengan efektif, Anda akan memerlukan beberapa peralatan dan bahan penting. Berikut adalah daftar lengkap yang akan membantu Anda mempersiapkan diri untuk memulai perjalanan belajar Hairstyle Anda.",
      ],
      details: [
        { icon: <FaScissors />, text: "Gunting profesional" },
        { icon: <FaRuler />, text: "Sisir dan sikat rambut" },
        {
          icon: <FaSprayCan />,
          text: "Produk styling (gel, mousse, hairspray)",
        },
        { icon: <PiHairDryerFill />, text: "Pengering rambut" },
        { icon: <GiCloak />, text: "Cape potong rambut" },
        { icon: <FaBottleDroplet />, text: "Botol semprot" },
        { icon: <GiTowel />, text: "Handuk kecil" },
        {
          icon: <FaSnowman />,
          text: "Mannequin head untuk latihan",
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
          title: "Pengenalan Alat dan Bahan",
          src: "https://www.youtube.com/watch?v=c96leQ_fRII",
          type: "youtube",
        },
        {
          title: "Dasar-dasar Pemangkasan",
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
          "Berbagai alat pemangkasan rambut dapat digunakan, dengan ketentuan memenuhi standar minimal kebutuhan, kelayakan dan aman digunakan, contohnya:",
        categories: [
          {
            title: "Pertama",
            description: "Gunting Pangkas Bilah Satu",
            items: [
              {
                subtitle: "Bentuk 4 1/2",
                image: gunting1,
                description:
                  "Memangkas rambut secara umum, layer dan untuk sudut pemangkasan",
              },
              {
                subtitle: "Bentuk 5",
                image: gunting2,
                description:
                  "Memangkas rambut secara umum, layer dan untuk sudut pemangkasan",
              },
              {
                subtitle: "Bentuk 5 1/2",
                image: gunting3,
                description:
                  "Memangkas rambut secara umum, layer dan untuk sudut pemangkasan",
              },
            ],
          },
          {
            title: "Kedua",

            description: "Gunting Penipis",
            items: [
              {
                subtitle: "Bentuk Satu Bilah",
                image: gunting4,
                description:
                  "Memangkas garis pemangkasan lengkung karena memiliki gigi yang lebih panjang.",
              },
              {
                subtitle: "Bentuk Dua Bilah",
                image: gunting5,
                description: "Memangkas garis pemangkasan lurus",
              },
            ],
          },
          {
            title: "Ketiga",
            description: "Alat Penunjang Pemangkasan",
            items: [
              {
                subtitle: "Cape Penyampoan",
                image: nomor1,
                description:
                  "Melindungi baju klien dari percikan air saat pencucian rambut",
              },
              {
                subtitle: "Cape Pangkas",
                image: nomor2,
                description:
                  "Menghalangi rambut yang telah dipangkas agar tidak menempel pada baju atau kulit klien",
              },
              {
                subtitle: "Handuk Kecil",
                image: nomor3,
                description:
                  "Mengeringkan rambut dan melindungi bagian tengkuk klien dari pecikan kosmetik",
              },
              {
                subtitle: "Sisir Besar",
                image: nomor4,
                description:
                  "Menyisir rambut secara umum setelah memncuci rambut",
              },
              {
                subtitle: "Sisir Berekor",
                image: nomor5,
                description: "Memudahkan pembagian (parting) rambut",
              },
              {
                subtitle: "Sisir Pangkas",
                image: nomor6,
                description: "Alat bantu pemangkasan",
              },
              {
                subtitle: "Sisir Leher",
                image: nomor7,
                description:
                  "Membersihkan leher dan bahu dari sisa potongan rambut",
              },
              {
                subtitle: "Sisir Blow",
                image: nomor8,
                description:
                  "Membentuk volume pada rambut selama proses penataan Teknik blowdryer",
              },
              {
                subtitle: "Jepit Bergerigi",
                image: nomor9,
                description: "Untuk menjepit rambut yang telah di parting",
              },
              {
                subtitle: "Jepit Bebek",
                image: nomor10,
                description:
                  "Untuk menejpit dan membagi section rambut yang akan dipangkas",
              },
              {
                subtitle: "Water Sprayer",
                image: nomor11,
                description:
                  "Membasahi rambut agar ujung rambut tetap dalam keadaan basah saat pemangkasan",
              },
              {
                subtitle: "Hair Dryer",
                image: nomor12,
                description:
                  "Mengeringkan rambut dengan suhuh yag dapat diatur sesuai kebutuhan",
              },
            ],
          },
        ],
      },
      {
        subtitle: "Persiapan Pribadi",
        description: "Seorang hairstylist harus memperhatikan hal-hal berikut:",
        items: [
          "Mengenakan riasan wajah sehingga wajah tampak segar dan cerah",
          "Rambut ditata rapi dan tidak mengganggu pekerjaan",
          "Memakai baju kerja tidak kusut, licin dan bersih/tidak bernoda, tidak terlalu sempit",
          "Mengenakan sepatu dengan hak rendah dan terbuat dari karet agar tidak licin",
          "Tidak mengenakan perhiasan yang menyolok kecuali jam tangan",
          "Menjaga bau mulut dan bau badan sehingga kebersihan gigi dan badan harus dijaga",
          "Jaga kebersihan kuku dan kulit",
          "Tampilkan ekspresi wajah yang ramah, dan sikap selalu ingin membantu pelanggan",
          "Jaga suara bicara dan komunikasi dengan sopan",
          "Siap mental dan penuh percaya diri",
        ],
      },
      {
        subtitle: "Persiapan Klien",
        description: [
          "Persiapan klien dilakukan untuk meingkatkan daya Tarik dan kenyamanan selama pelayanan pemangkasan. Berikan alas bahu dan pasangkan cape pemangkasan yang bersih dan menutup baju klien dengan sempurna, sehingga baju klien tidak kotor oleh serpihan potongan rambut.",
          "Setelah menyelasikan Tindakan pemangkasan, kegiatan berkemas dilakukan untuk merapihkan Kembali area kerja sehingga bersih, kegiatan yang dilakukan dalam berkemas seperti :",
        ],
        items: [
          "Membersihkan alat-alat yang sudah dipakai, simpan kembali pada tempatnya",
          "Menyimpan kosmetik pada tempatnya.",
          "Membersihkan ruangan, membuang sampah pada tempatnya",
          "Mematikan semua aliran listrik (apabila sudah tidak digunakan)",
        ],
      },
    ],
  };

  const hairstyles = [
    {
      title: "Deskripsi Kelas",
      image: MaterialImage,
      description: "Teknik Pemangkasan Rambut Uniform Layer",
      content: {
        ringkasan:
          "Kelas ini menyajikan pengetahuan komprehensif tentang teknik pemangkasan rambut Uniform Layer, mulai dari konsep dasar hingga prosedur praktis. Peserta akan mempelajari definisi, tujuan, komponen, dan langkah-langkah detail dalam melakukan pemangkasan Uniform Layer.",
        tujuan: [
          "Memahami konsep dan prinsip dasar teknik Uniform Layer",
          "Mengidentifikasi tujuan dan manfaat pemangkasan Uniform Layer",
          "Mengenali komponen-komponen penting dalam teknik Uniform Layer",
          "Melaksanakan prosedur pemangkasan Uniform Layer dengan benar",
          "Mempersiapkan area kerja, alat, dan bahan yang diperlukan",
          "Menerapkan persiapan pribadi dan klien yang tepat",
          "Melakukan kegiatan berkemas pasca-pemangkasan",
        ],
        materi: [
          {
            title: "Pengantar Teknik Uniform Layer",
            items: [
              "Definisi dan etimologi pemangkasan",
              "Penjelasan khusus tentang Uniform Layer",
            ],
          },
          {
            title: "Tujuan dan Manfaat Teknik Uniform Layer",
            items: [],
          },
          {
            title: "Komponen Teknik Uniform Layer",
            items: ["Bentuk", "Tekstur", "Struktur", "Sudut Pemangkasan"],
          },
          {
            title: "Prosedur Pemangkasan Uniform Layer",
            items: [
              "Langkah-langkah detail",
              "Teknik pengambilan dan pemangkasan rambut",
              "Cross check dan finishing",
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
            title: "Kegiatan Berkemas Pasca-Pemangkasan",
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
          "Penata rambut pemula",
          "Profesional yang ingin meningkatkan keterampilan",
        ],
        evaluasi: [
          "Ujian tertulis untuk pemahaman teori",
          "Praktik pemangkasan Uniform Layer",
          "Penilaian persiapan dan kebersihan area kerja",
        ],
        sertifikasi:
          "Peserta yang berhasil menyelesaikan kelas dan lulus evaluasi akan menerima sertifikat kompetensi dalam Teknik Pemangkasan Rambut Uniform Layer.",
      },
    },
    {
      title: "Materi",
      content: [
        {
          image: HairstyleBackground,
          title: "Konsep Modul",
          description:
            "Materi yang terdapat dalam E-Modul ini menyajikan pengetahuan tentang pemangkasan rambut Teknik uniform layer.",
        },
        {
          image: FotoRambut,
          title: "Apa itu Teknik Uniform Layer ?",
          description:
            "Secara “ethymologi”, kata pemangkasan terdiri dari kata “pangkas” yang artinya potong, sehingga pemangkasan merupakan tindakan memotong yang mana dalam dunia kecantikan tindakan pemangkasan rambut. Pengertian pemangkasan bisa diartikan sebagai tindakan untuk mengurangi panjang rambut semula dengan teknik-teknik tertentu, disesuaikan dengan bentuk wajah, jenis rambut, perawatan, pekerjaan dan kepribadian seseorang sehingga menghasilkan model pangkasan yang diinginkan oleh seseorang. Berdasarkan sudut pemangkatan, teknik pemangkasan dibagi dalam tiga teknik utama yaitu Pemangkasan teknik Solid, Pemangkasan teknik Graduasi, dan Pemangkasan teknik Layer. Pemangkasan bertrap penuh dikenal dengan istilah layer adalah pemangkasan yang dilakukan dengan sudut elevasi 90°-180°. Pemangkasan uniform layer adalah pemangkasan dengan sudut elevasi 90° merupakan bentuk pemangkasan mengikuti bentuk kepala, kepanjangan rambut yang sama.",
        },
        {
          image: HairPhoto,
          title: "Tujuan Teknik Uniform Layer",
          description: [
            "Memperindah bentuk kepala",
            "Mempermudah pengaturan rambut",
            "Memberi kesan wajah oval",
            "Mempertajam garis wajah",
            "Mencegah rambut jatuh ke depan wajah",
            "Mengikuti model yang sedang berlaku dan sebagainya",
          ],
        },
      ],
      multiSectionContent: [
        {
          title: "Komponen Teknik Uniform Layer",
          sections: [
            {
              image: Component1,
              subTitle: "Bentuk",
              description:
                "Pemangkasan Uniform Layer menunjukkan bentuk desain guntingan rambut yang membulat sesuai dengan bentuk kepala, dengan kepanjangan rambut yang sama panjang.",
            },
            {
              image: Component2,
              subTitle: "Tekstur",
              description:
                "Susunan permukaan rambut bertekstur aktif (seluruh cahaya yang jatuh diserap seluruhnya dan tidak ada cahaya yang dipantulkan kembali) Jatuhnya ujung-ujung rambut tersusun dengan teratur.",
            },
            {
              image: Component3,
              subTitle: "Struktur",
              description:
                "Struktur kerangka pemangkasan di setiap kepanjangan rambut jatuh di daerah yang sama, struktur kerangka pemangkasan uniform layer dengan kepanjangan rambut yang sama.",
            },
            {
              image: Component4,
              subTitle: "Sudut Pemangkasan",
              description: (
                <>
                  {
                    "Uniform layer memiliki sudut sudut dan ketebalan rambut yang terbagi rata di seluruh kepala. Uniform layer memiliki sudut pemangkasan 90°. Setiap teknik pemangkasan memiliki pola garis yang berbeda. Adapun pola garis pemangkasan pada Uniform Layer yaitu:"
                  }
                  {
                    <ol>
                      <li>
                        <strong>Garis pola pangkas melengkung:</strong>{" "}
                        Pemangkasan dilakukan dengan menggunakan pola pangkas
                        hairline. Rambut sekeliling hairline dipangkas sesuai
                        desain dan panjang yang diinginkan. Setelah itu
                        dilanjutkan pemangkasan dari luar (Eksterior) ke arah
                        dalam (Interior) dengan patokan pola tersebut.
                      </li>
                      <li>
                        <strong>Garis pola pangkas datar:</strong> Pemangkasan
                        dengan patokan dari bagian dalam dengan panjang yang
                        diinginkan, kemudian pangkas ke arah luar.
                      </li>
                    </ol>
                  }
                </>
              ),
            },
          ],
        },
        {
          title: "Langkah Prosedur Pemangkasan",
          sections: [
            {
              image: Step1,
              subTitle: "Pertama",
              description: "Pahami garis pemangkasan uniform layer",
            },
            {
              image: Step2,
              subTitle: "Kedua",
              description:
                "Ambil rambut mulai dari bagian poni tengah seperti pola pemangkasan uniform layer, dengan sudut pemangkasan 90°",
            },
            {
              image: Step3,
              subTitle: "Ketiga",
              description:
                "Lanjutkan Pemangkasan pada daerah interior dengan mengambil guide line dari potongan sebelumnya. Pemangkasan dilakukan dengan sudut 90°",
            },
            {
              image: Step4,
              subTitle: "Keempat",
              description:
                "Lakukan hal yang sama pada bagian eksterior sesuai guide line, lakukan secara bertahap, hingga selesai pemangkasan",
            },
            {
              image: Step5,
              subTitle: "Kelima",
              description:
                "Lakukan crosss check, yakinkan seluruh bagian rambut sudah rata dan lurus juga simetris.",
            },
            {
              image: Step6,
              subTitle: "Keenam",
              description: "Hasil akhir pemangkasan",
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
              title: "Pengenalan Hairstyle",
              src: "https://youtu.be/c96leQ_fRII",
            },
            {
              title: "Hairstyle",
              src: "https://youtu.be/c96leQ_fRII",
            },
          ],
        },
        {
          sectionTitle: "Tingkat Lanjut",
          videos: [
            {
              title: "Hairstyle Belajar",
              src: "https://youtu.be/c96leQ_fRII",
            },
            {
              title: "Hairstyle Akhir",
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
              "Tindakan mengurangi panjang rambut semula dengan teknik tertentu, sesuai dengan bentuk wajah, jenis rambut, perawakan, pekerjaan dan kepribadian seseorang adalah definisi dari…",
            options: [
              "Pemangkasan",
              "Pewarnaan",
              "Pengeritingan",
              "Pelurusan",
              "Styling",
            ],
            answer: 0,
          },
          {
            question:
              "Tujuan pemangkasan rambut adalah sebagai berikut, kecuali…",
            image: PilihanGanda,
            options: [
              "Mengurangi Panjang Rambut",
              "Mengikuti Trend",
              "Mengubah Bentuk Kepala",
              "Merapikan Rambut",
              "Mengubah Penampilan",
            ],
            answer: 2,
          },
          {
            question:
              "Karyawan salon yang biasa menangani pemangkasan disebut…",
            options: ["Pelayan", "Capster", "Beauticient", "Suster", "Blester"],
            answer: 1,
          },
          {
            question:
              "Susunan permukaan rambut yang dapat diraba, dilihat dan dirasakan adalah…",
            options: [
              "Struktur Rambut",
              "Tekstur Rambut",
              "Pola Pemangkasan",
              "Arah Pemangkasan",
              "Arah Pertumbuhan Rambut",
            ],
            answer: 1,
          },
          {
            question:
              "Penipisan pada rambut yang tebal dapat dilakukan dengan menggunakan alat…",
            options: [
              "Gunting",
              "Gunting Penipisan",
              "Gunting Bilah Satur",
              "Mata Pisau",
              "Cutter",
            ],
            answer: 1,
          },
          {
            question:
              "Pengeringan rambut yang dilakukan dengan cara menggunakan sisir blow juga dikenal dengan Teknik…",
            options: [
              "Teknik blow dry",
              "Teknik block dry",
              "Teknik parting dry",
              "Teknik natural dry",
              "Teknik finger dry",
            ],
            answer: 0,
          },
          {
            question:
              "Jepit gerigi atau jepit bebek dalam proses pemangkasan digunakan untuk…",
            options: [
              "Menjepit rambut yang diparting",
              "Menjepit cape klien",
              "Meringkas rambut",
              "Membuat rambut menjadi berombak",
              "Menjepit rambut operator",
            ],
            answer: 0,
          },
          {
            question:
              "Pemangkasan yang dilakukan dengan cara mengurangi sebagian panjang rambut dengan sudut pengangkatan 90° dinamakan dengan Teknik Pemangkasan…",
            options: [
              "Solid",
              "Graduation",
              "Uniform Layer",
              "Increase Layer",
              "Convace",
            ],
            answer: 2,
          },
          {
            question:
              "Saat melakukan pemangkasan rambut, rambut harus dalam keadaan basah agar mempermudah dalam pemangkasan. Alat yang digunakan adalah…",
            options: [
              "Gunting Pangkas",
              "Sprayer",
              "Cape Pangkas",
              "Shower",
              "Hairdryer",
            ],
            answer: 1,
          },
          {
            question:
              "Berikut ini hal yang penting dilakukan saat selesai melakukan pemangkasan rambut, kecuali…",
            options: [
              "Penataaan Rambut",
              "Melakukan Pembersihan area leher dan bahu",
              "Memberikan saran pasca pemangkasan",
              "Melakukan Pengecekan",
              "Menentukan guide line",
            ],
            answer: 4,
          },
        ],
        essay: [
          {
            question:
              "Jelaskan langkah-langkah dalam melakukan pemangkasan teknik uniform layer!",
            image: SalonSoal,
            keyWords: [
              "basahi rambut",
              "bagi rambut",
              "sudut 90 derajat",
              "potong merata",
              "periksa hasil",
            ],
          },
          {
            question: "Apa perbedaan antara texturizing dan blunt cutting?",
            keyWords: [
              "tekstur",
              "ujung rambut",
              "volume",
              "garis lurus",
              "ketebalan",
            ],
          },
          {
            question:
              "Bagaimana cara memastikan hasil pemangkasan uniform layer sudah tepat?",
            keyWords: [
              "simetris",
              "panjang sama",
              "jatuh merata",
              "bentuk bulat",
              "cek dari berbagai sudut",
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
    <div className="hairstyle-page">
      <Navbar />
      <div className="hairstyle-container">
        <main>
          <section className="hairstyle-hero">
            <div className="hero-content">
              <h1>Belajar hairstyle Untuk Pemula</h1>
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
            <Tabs className="hairstyle-tabs">
              <TabList>
                {hairstyles.map((style, index) => (
                  <Tab key={index}>{style.title}</Tab>
                ))}
              </TabList>

              {hairstyles.map((style, index) => (
                <TabPanel key={index}>
                  {style.title === "Deskripsi Kelas" ? (
                    <div className="hairstyle-content">
                      <img src={style.image} alt={style.title} />
                      <div className="hairstyle-info">
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
                    <div className="video-hairstyle">
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
      <Footer currentPage="hairstyling" />
    </div>
  );
};

export default Hairstyle;
