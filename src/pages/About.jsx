import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../css/About.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfilPengembang from "../assets/images/profil_pengembang.jpeg";

function About() {
  useEffect(() => {
    AOS.init({});
  }, []);

  return (
    <>
      <Navbar />
      <div className="about-container" id="about">
        <link
          href="https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@400;700;900&family=Poppins:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <div
          className="about-card"
          data-aos-offset="0"
          data-aos="slide-up"
          data-aos-once="false"
        >
          <div
            className="image-about"
            data-aos-offset="0"
            data-aos="fade-right"
            data-aos-once="false"
          >
            <img src={ProfilPengembang} alt="Profil Pengembang" width={500} />
          </div>
          <div
            className="about-title-container"
            data-aos="fade-up"
            data-aos-offset="0"
            data-aos-once="false"
          >
            <div className="about-title">
              <h1>
                Profil <span>Pengembang</span>
              </h1>
            </div>
            <div className="about-desc">
              <p>
                <strong>Nama:</strong> Azzaitun Nurhanum
              </p>
              <p>
                <strong>NIM:</strong> 1516619016
              </p>
              <p>
                <strong>Program Studi:</strong> Pendidikan Tata Rias
              </p>
              <p>
                <strong>Fakultas:</strong> Teknik
              </p>
              <p>
                <strong>Dosen Pembimbing I:</strong> Nurnina Ayuningtyas, S.Pd.,
                M.Pd
              </p>
              <p>
                <strong>Dosen Pembimbing II:</strong> Titin Supiani, S.Pd., M.Pd
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
