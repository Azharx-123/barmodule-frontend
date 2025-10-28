import React, { useState } from "react";
import ReactPlayer from "react-player";
import "../css/Explore.css";
import { BsFillPlayFill } from "react-icons/bs";
import hairstyle from "../assets/images/hairstyle.jpeg";
import treatment from "../assets/images/spa.jpeg";
import tatarias from "../assets/images/tatarias.jpeg";
import salon from "../assets/images/salon.jpeg";

import { FaTimes } from "react-icons/fa";

function Explore() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDurations, setVideoDurations] = useState({});

  const courses = [
    {
      image: tatarias,
      title: "Belajar Tatarias",
      description:
        "Proses mempelajari teknik-teknik merias wajah, mulai dari dasar hingga riasan khusus untuk berbagai acara",
      link: "/belajar-tatarias",
      video: "https://youtu.be/-elEJpllHYY",
    },
    {
      image: salon,
      title: "Pewarnaan Rambut Teknik Color Melt",
      description:
        "Teknik pewarnaan rambut yang menciptakan gradasi warna yang halus dan natural, seperti warna rambut yang terbakar matahari",
      link: "/belajar-salon",
      video: "https://youtu.be/T0c-nlllBGc",
    },
    {
      image: treatment,
      title: "Belajar Treatment Rambut",
      description:
        "Treatment rambut adalah proses perawatan khusus yang ditujukan untuk menjaga kesehatan, keindahan, dan kekuatan rambut",
      link: "/belajar-treatment-rambut",
      video: "https://www.youtube.com/watch?v=TfcxpEHWaYs",
    },
    {
      image: hairstyle,
      title: "Pemangkasan Rambut Teknik Uniform Layer",
      description:
        "Materi ini menyajikan pengetahuan tentang pemangkasan rambut Teknik uniform layer",
      link: "/teknik-uniform",
      video: "https://www.youtube.com/watch?v=bnP96FiczKY",
    },
  ];

  const handlePlayClick = (url) => {
    setVideoUrl(url);
    setIsPlaying(true);
  };

  const handleDuration = (duration, index) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const formattedDuration = `${minutes} menit ${
      seconds < 10 ? "0" : ""
    }${seconds} detik`;

    // Store the duration for the specific video
    setVideoDurations((prevDurations) => ({
      ...prevDurations,
      [index]: formattedDuration,
    }));
  };

  return (
    <div className="explore-container">
      <div
        className="explore-title"
        data-aos="zoom-in"
        data-aos-offset="400"
        data-aos-once="false"
      >
        Cari <span className="highlight">Materi</span>
      </div>
      <div
        className="card-container-materi"
        data-aos="fade-right"
        data-aos-offset="400"
        data-aos-once="false"
      >
        {courses.map((course, index) => (
          <div className="card-materi" key={index}>
            <div className="image-container">
              <img src={course.image} alt={course.title} />
            </div>
            <div className="title-text-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="bottom-text">
                <p>{videoDurations[index] || "Loading..."}</p>
                <div className="play-button-explore">
                  <div
                    className="circle-explore"
                    onClick={() => handlePlayClick(course.video)}
                  >
                    <BsFillPlayFill size={20} />
                  </div>
                </div>
              </div>
            </div>
            {/* Hidden ReactPlayer to load the video and get its duration */}
            <div style={{ display: "none" }}>
              <ReactPlayer
                url={course.video}
                onDuration={(duration) => handleDuration(duration, index)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal for playing video */}
      {isPlaying && (
        <div className="video-modal">
          <div className="video-content">
            <ReactPlayer url={videoUrl} playing controls />
            <button
              className="close-button"
              onClick={() => setIsPlaying(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Explore;
