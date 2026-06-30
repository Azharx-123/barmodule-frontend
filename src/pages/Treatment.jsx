import AOS from "aos";
import "aos/dist/aos.css";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BsFillCheckCircleFill,
  BsFillPauseFill,
  BsFillPlayCircleFill,
} from "react-icons/bs";
import { FaSnowman } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import { GiCloak, GiTowel, GiComb } from "react-icons/gi";
import { CgCalendarDates, CgCheckO } from "react-icons/cg";
import { FaSprayCan, FaBottleDroplet } from "react-icons/fa6";
import { PiHairDryerFill } from "react-icons/pi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import YouTube from "react-youtube";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../css/Treatment.css";

import TreatmentBackground from "../assets/images/Class Treatment.png";
import FotoRambut from "../assets/images/Foto Rambut.png";
import FotoKlien from "../assets/images/Treatment Klien.png";
import Bahagia from "../assets/images/Pribadi Treatment.png";
import Component1 from "../assets/images/Treatment komponen1.png";
import Component2 from "../assets/images/Treatment komponen2.png";
import Component3 from "../assets/images/Treatment komponen3.png";
import Component4 from "../assets/images/Treatment komponen4.png";
import Step1 from "../assets/images/Treatment langkah1.png";
import Step2 from "../assets/images/Treatment langkah2.png";
import Step3 from "../assets/images/Treatment langkah3.png";
import Step4 from "../assets/images/Treatment langkah4.png";
import Step5 from "../assets/images/Treatment langkah5.png";
import Step6 from "../assets/images/Treatment langkah6.png";
import Step7 from "../assets/images/Treatment langkah7.png";
import Step8 from "../assets/images/Treatment langkah8.png";
import TreatmentImage from "../assets/images/Treatment Material.png";
import foto1 from "../assets/images/Treatment nomor1.png";
import foto2 from "../assets/images/Treatment nomor2.png";
import foto3 from "../assets/images/Treatment nomor3.jpg";
import foto4 from "../assets/images/Treatment nomor4.png";
import foto5 from "../assets/images/Treatment nomor5.png";
import HairPhoto from "../assets/images/Uniform Layer.png";

const Treatment = () => {
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
      const heroSection = document.querySelector(".treatment-hero");
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
      treatments.find((style) => style.title === "Latihan")?.questions
        ?.multipleChoice || [];
    const essayQuestions =
      treatments.find((style) => style.title === "Latihan")?.questions?.essay ||
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
      treatments.find((style) => style.title === "Latihan")?.questions
        ?.multipleChoice || [];
    const essayQuestions =
      treatments.find((style) => style.title === "Latihan")?.questions?.essay ||
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
    <div className="treatment-content">
      <img src={classInfo.image} alt={classInfo.title} />
      <div className="treatment-info">
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
        "Website kami menyediakan program pelatihan lengkap untuk treatment dan styling rambut profesional. Dari teknik dasar hingga advanced, semua dikemas dalam platform yang mudah diakses dengan materi berkualitas tinggi, video tutorial, dan forum diskusi interaktif.",
      ],
      details: [
        {
          title: "Program Ditujukan Untuk",
          items: [
            "Calon hair stylist profesional",
            "Praktisi salon yang ingin meningkatkan keahlian",
            "Pemilik salon yang ingin memahami standar layanan",
          ],
        },
        {
          title: "Kompetensi Dasar",
          items: [
            "Menerapkan prosedur treatment rambut profesional",
            "Menganalisis kondisi dan kebutuhan rambut klien",
            "Memilih produk treatment yang sesuai dengan jenis rambut",
            "Melakukan perawatan dan styling rambut sesuai standar",
          ],
        },
        {
          title: "Indikator Pencapaian Kompetensi",
          items: [
            "Mampu melakukan diagnosa rambut secara akurat",
            "Menguasai teknik aplikasi produk treatment dengan benar",
            "Dapat melakukan massage dan teknik styling profesional",
            "Memberikan rekomendasi perawatan yang tepat untuk klien",
          ],
        },
      ],
    },
    {
      title: "Apa yang dibutuhkan",
      icon: <CgCheckO />,
      descriptions: [
        "Program ini memerlukan peralatan profesional untuk hasil optimal. Berikut adalah daftar peralatan yang diperlukan untuk mengikuti program dengan efektif.",
      ],
      details: [
        { icon: <FaSprayCan />, text: "Produk treatment profesional" },
        { icon: <PiHairDryerFill />, text: "Hair steamer" },
        { icon: <GiCloak />, text: "Cape treatment" },
        { icon: <GiTowel />, text: "Handuk khusus" },
        { icon: <GiComb />, text: "Sisir treatment" },
        { icon: <FaBottleDroplet />, text: "Botol aplikator" },
        { icon: <MdOutlineTimer />, text: "Timer profesional" },
        {
          icon: <FaSnowman />,
          text: "Mannequin head untuk praktik",
        },
      ],
    },
    {
      title: "Video",
      icon: <BsFillPlayCircleFill />,
      descriptions: ["Setiap modul dilengkapi video pembelajaran komprehensif"],
      videos: [
        {
          title: "Dasar-dasar Treatment Rambut",
          src: "https://www.youtube.com/watch?v=pGJNGtH_R0A",
          type: "youtube",
        },
        {
          title: "Teknik Massage Profesional",
          src: "https://www.youtube.com/watch?v=YQvNUHaGGiw",
          type: "youtube",
        },
      ],
    },
  ];

  const flexibleContent = {
    title: "Persiapan Program",
    contents: [
      {
        subtitle: "Persiapan Area Treatment",
        description: "Standar area kerja profesional yang nyaman dan higienis",
      },
      {
        subtitle: "Persiapan Alat dan Bahan",
        description:
          "Peralatan treatment lengkap dengan standar salon profesional:",
        categories: [
          {
            title: "Pertama",
            description: "Peralatan Dasar Treatment",
            items: [
              {
                subtitle: "Hair Steamer",
                image: foto1,
                description:
                  "Untuk treatment mendalam dan penetrasi produk optimal",
              },
              {
                subtitle: "Massage Tools",
                image: foto2,
                description: "Set peralatan untuk teknik massage profesional",
              },
              {
                subtitle: "Treatment Cape",
                image: foto3,
                description: "Pelindung profesional selama proses treatment",
              },
            ],
          },
          {
            title: "Kedua",
            description: "Produk Treatment Profesional",
            items: [
              {
                subtitle: "Deep Treatment Series",
                image: foto4,
                description:
                  "Range produk untuk berbagai jenis treatment rambut",
              },
              {
                subtitle: "Styling Products",
                image: foto5,
                description: "Produk styling profesional post-treatment",
              },
            ],
          },
        ],
      },
      {
        subtitle: "Persiapan Pribadi",
        description:
          "Terapis profesional harus mempersiapkan diri dengan standar yang tinggi. Berikut standar persiapan terapis:",
        items: [
          "Mengenakan seragam spa yang bersih dan nyaman",
          "Menjaga kebersihan diri secara menyeluruh",
          "Menggunakan sepatu khusus spa yang bersih",
          "Menata rambut dengan rapi dan terikat",
          "Menjaga kebersihan kuku (pendek dan bersih)",
          "Menghindari penggunaan perhiasan",
          "Menjaga kesegaran tubuh dan nafas",
          "Menggunakan masker jika diperlukan",
          "Mencuci tangan sebelum dan sesudah treatment",
          "Menjaga energi dan kondisi fisik",
        ],
      },
      {
        subtitle: "Persiapan Klien",
        description:
          "Layanan treatment memerlukan prosedur yang terstruktur dan profesional. Berikut tahapan yang perlu diperhatikan:",
        items: [
          "Melakukan konsultasi awal dan analisa kulit",
          "Menjelaskan prosedur treatment yang akan dilakukan",
          "Memastikan kenyamanan klien",
          "Melakukan pembersihan awal",
          "Mengaplikasikan produk sesuai jenis treatment",
          "Melakukan teknik massage yang tepat",
          "Memantau reaksi kulit klien",
          "Memberikan waktu relaksasi yang cukup",
          "Melakukan pembersihan akhir",
          "Memberikan saran perawatan lanjutan",
        ],
      },
    ],
  };

  const treatments = [
    {
      title: "Deskripsi Kelas",
      image: TreatmentImage,
      description: "Program Pelatihan Treatment & Styling Rambut Profesional",
      content: {
        ringkasan:
          "Program komprehensif yang mencakup teknik treatment, styling, dan perawatan rambut profesional. Dari diagnosa hingga finishing, peserta akan menguasai seluruh aspek perawatan rambut.",
        tujuan: [
          "Menguasai teknik diagnosa rambut profesional",
          "Memahami berbagai jenis treatment dan aplikasinya",
          "Menguasai teknik massage dan styling",
          "Mampu memberikan konsultasi profesional",
        ],
        materi: [
          {
            title: "Modul 1: Dasar Treatment",
            items: [
              "Pengenalan jenis rambut dan masalahnya",
              "Teknik diagnosa profesional",
            ],
          },
          {
            title: "Modul 2: Advanced Treatment",
            items: ["Teknik treatment spesifik", "Aplikasi produk profesional"],
          },
          {
            title: "Modul 3: Styling Profesional",
            items: ["Teknik styling dasar", "Advanced styling techniques"],
          },
        ],
        metode: [
          "Teori komprehensif",
          "Demonstrasi langsung",
          "Praktik intensif",
          "Evaluasi berkala",
        ],
        durasi: "24 jam atau 6 hari",
        target: [
          "Calon profesional hair treatment",
          "Hair stylist aktif",
          "Pemilik salon",
        ],
        evaluasi: [
          "Ujian teori treatment",
          "Praktik treatment lengkap",
          "Assessment teknik styling",
        ],
        sertifikasi:
          "Sertifikat Profesional Hair Treatment & Styling setelah menyelesaikan seluruh program.",
      },
    },
    {
      title: "Materi",
      content: [
        {
          image: TreatmentBackground,
          title: "Konsep Program",
          description:
            "Program ini menyajikan pengetahuan lengkap tentang treatment dan styling rambut profesional.",
        },
        {
          image: HairPhoto,
          title: "Apa itu Professional Hair Treatment?",
          description:
            "Treatment rambut profesional adalah serangkaian prosedur perawatan rambut menggunakan teknik dan produk profesional untuk mengatasi berbagai masalah rambut dan meningkatkan kesehatannya secara optimal.",
        },
        {
          image: FotoRambut,
          title: "Apa itu Professional Hair Treatment?",
          description:
            "Treatment rambut profesional adalah serangkaian prosedur perawatan rambut menggunakan teknik dan produk profesional untuk mengatasi berbagai masalah rambut dan meningkatkan kesehatannya secara optimal.",
        },
      ],
      multiSectionContent: [
        {
          title: "Komponen Dasar Treatment Wajah",
          sections: [
            {
              image: Component1,
              subTitle: "Analisis Kondisi Kulit",
              description:
                "Mengidentifikasi jenis kulit, masalah kulit, dan kondisi khusus untuk menentukan jenis treatment yang sesuai.",
            },
            {
              image: Component2,
              subTitle: "Pembersihan Mendalam",
              description:
                "Proses double cleansing untuk menghilangkan kotoran, makeup, dan sel kulit mati secara menyeluruh.",
            },
            {
              image: Component3,
              subTitle: "Eksfoliasi",
              description:
                "Pengangkatan sel kulit mati menggunakan scrub atau peeling untuk memperbarui sel kulit.",
            },
            {
              image: Component4,
              subTitle: "Perawatan Intensif",
              description: (
                <>
                  {
                    "Pemberian nutrisi dan bahan aktif sesuai kebutuhan kulit. Beberapa jenis perawatan meliputi:"
                  }
                  {
                    <ol>
                      <li>
                        <strong>Masker:</strong> Aplikasi masker sesuai jenis
                        kulit untuk memberikan nutrisi mendalam.
                      </li>
                      <li>
                        <strong>Serum:</strong> Penggunaan serum dengan
                        kandungan aktif untuk mengatasi masalah kulit spesifik.
                      </li>
                    </ol>
                  }
                </>
              ),
            },
          ],
        },
        {
          title: "Tahapan Prosedur Treatment Wajah",
          sections: [
            {
              image: Step1,
              subTitle: "Pertama",
              description:
                "Konsultasi dan analisis kondisi kulit untuk menentukan treatment yang sesuai",
            },
            {
              image: Step2,
              subTitle: "Kedua",
              description:
                "Pembersihan awal dengan milk cleanser atau deep cleanser",
            },
            {
              image: Step3,
              subTitle: "Ketiga",
              description:
                "Eksfoliasi dengan scrub atau peeling sesuai jenis kulit",
            },
            {
              image: Step4,
              subTitle: "Keempat",
              description:
                "Steam wajah untuk membuka pori-pori dan memudahkan ekstraksi komedo (jika diperlukan)",
            },
            {
              image: Step5,
              subTitle: "Kelima",
              description: "Aplikasi toner untuk menyeimbangkan pH kulit",
            },
            {
              image: Step6,
              subTitle: "Keenam",
              description:
                "Pemijatan wajah dengan cream massage untuk melancarkan peredaran darah",
            },
            {
              image: Step7,
              subTitle: "Ketujuh",
              description: "Penggunaan masker sesuai jenis dan kebutuhan kulit",
            },
            {
              image: Step8,
              subTitle: "Kedelapan",
              description:
                "Aplikasi serum, moisturizer, dan sunscreen sebagai tahap akhir",
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
              "Langkah pertama dalam melakukan treatment rambut profesional adalah...",
            options: [
              "Diagnosa rambut",
              "Aplikasi produk",
              "Massage",
              "Styling",
              "Blow dry",
            ],
            answer: 0,
          },
          {
            question: "Berapa lama waktu ideal untuk deep treatment?",
            options: [
              "5 menit",
              "10 menit",
              "15-20 menit",
              "30-45 menit",
              "60 menit",
            ],
            answer: 3,
          },
        ],
        essay: [
          {
            question: "Jelaskan prosedur lengkap melakukan hair spa treatment!",
            keyWords: [
              "diagnosa",
              "shampooing",
              "massage",
              "steam",
              "conditioning",
            ],
          },
          {
            question: "Bagaimana cara menangani rambut sangat kering?",
            keyWords: [
              "moisturizing",
              "deep conditioning",
              "protein treatment",
              "serum",
              "maintenance",
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
    <div className="treatment-page">
      <Navbar />
      <div className="treatment-container">
        <main>
          <section className="treatment-hero">
            <div className="hero-content">
              <h1>Perawatan Rambut Intensif</h1>
              <p>Teknik Treatment untuk Rambut Sehat dan Berkilau</p>
              <button
                onClick={() => scrollToSection("course-summary")}
                className="cta-button"
              >
                Mulai Belajar
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
                              <h2>Teknik Treatment Optimal</h2>
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
            <Tabs className="treatment-tabs">
              <TabList>
                {treatments.map((style, index) => (
                  <Tab key={index}>{style.title}</Tab>
                ))}
              </TabList>

              {treatments.map((style, index) => (
                <TabPanel key={index}>
                  {style.title === "Deskripsi Kelas" ? (
                    <div className="treatment-content">
                      <img src={style.image} alt={style.title} />
                      <div className="treatment-info">
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
                    <div className="video-treatment">
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

export default Treatment;
