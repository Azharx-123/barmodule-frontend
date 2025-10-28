import React, { useState } from "react";
import "../css/Pengenalan.css";
import { BsFillPlayFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import MainImage from "../assets/images/main-image.png";
import { FaTimes } from "react-icons/fa";

function Pengenalan({ scrollToService }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handlePlayButtonClick = () => {
    setIsVideoOpen(true);
  };

  const handleCloseModal = () => {
    setIsVideoOpen(false);
  };

  return (
    <div className="main-section-container">
      <link
        href="https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@400;700;900&family=Poppins:wght@500;600&display=swap"
        rel="stylesheet"
      />
      <div
        className="text-main-container"
        data-aos="fade-right"
        data-aos-offset="0"
        data-aos-duration="500"
        data-aos-once="false"
      >
        <h1 className="main-title" style={{ color: "#34364A" }}>
          Mari belajar tentang Tata Rias bersama <span>BARMODULE.</span>
        </h1>
        <p className="main-subtitle">
          Barmodule adalah program pembelajaran tata rias rambut yang dibuat
          oleh tata rias UNJ untuk sekolah binaan SMK Negeri 7
        </p>

        <div className="button-container">
          <button className="button-main" onClick={scrollToService}>
            Mulai Belajar
          </button>
          <div className="button-tonton">
            <div className="play-tonton">
              <Link className="circle" to="#" onClick={handlePlayButtonClick}>
                <BsFillPlayFill size={25} />
              </Link>
            </div>
            <span className="tonton">Tonton Video</span>
          </div>
        </div>
      </div>

      <div
        className="image-main-container"
        data-aos="fade-left"
        data-aos-offset="0"
        data-aos-duration="500"
        data-aos-once="false"
      >
        <img src={MainImage} alt="Main Visual" width={600} />
      </div>

      {isVideoOpen && (
        <div className="video-modal-pengenalan">
          <div className="video-modal-content-pengenalan">
            <span
              className="close-button-pengenalan"
              onClick={handleCloseModal}
            >
              <FaTimes />
            </span>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/e9dP9dCbYhM"
              title="Tutotial Cool Sculpting"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pengenalan;
