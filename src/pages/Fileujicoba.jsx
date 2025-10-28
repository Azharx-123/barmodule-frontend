import React, { useState, useRef, useEffect, useCallback } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "react-tabs/style/react-tabs.css";
import "../css/Hairstyle.css";
import AOS from "aos";
import "aos/dist/aos.css";
import MaterialImage from "../assets/images/Hairstyle Material.png";

const Hairstyle = () => {
  useEffect(() => {
    AOS.init({});
  }, []);
  const [activeTab, setActiveTab] = useState(0);
  const heroVideoRef = useRef(null);
  const timeUpdateIntervalRef = useRef(null);
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
      },
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
            question: "Apa perbedaan antara texturizing dan blunt cutting?",
            keyWords: [
              "tekstur",
              "ujung rambut",
              "volume",
              "garis lurus",
              "ketebalan",
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
                  {style.title === "Latihan" ? (
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

export default Hairstyle;
