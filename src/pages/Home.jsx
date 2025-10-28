import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../css/Home.css";
import FotoSMK1 from "../assets/images/SMK-foto-1.jpg";
import FotoSMK2 from "../assets/images/SMK-foto-2.png";
import FotoSMK3 from "../assets/images/SMK-foto-3.png";
import NavbarHome from "../components/NavbarHome";
import Navbar from "../components/Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../components/Footer";
import Pengenalan from "../sections/Pengenalan";
import Explore from "../sections/Explore";
import Service from "../sections/Service";
import PDFplayer from "../components/PDFplayer";
import Review from "../sections/Review";
import Logo from "../sections/Logo";
import Contact from "../sections/Contact";

import Waloon from "../assets/images/logo-brand/waloon.png";
import Spariyon from "../assets/images/logo-brand/Spariyon.png";
import Pantene from "../assets/images/logo-brand/pantene.png";
import M from "../assets/images/logo-brand/M.png";
import Glory from "../assets/images/logo-brand/glory.png";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  fade: true,
  cssEase: "linear",
  arrows: false,
  swipe: false,
  pauseOnHover: false,
  pauseOnFocus: false,
};

const brands = [
  { name: "Brand 1", logo: Waloon },
  { name: "Brand 2", logo: Spariyon },
  { name: "Brand 3", logo: Pantene },
  { name: "Brand 4", logo: M },
  { name: "Brand 5", logo: Glory },
];

const WelcomeSection = ({ onStartLearning }) => (
  <div
    className="welcome-section"
    data-aos="fade-up"
    data-aos-offset="500"
    data-aos-duration="500"
  >
    <Slider {...sliderSettings}>
      {[FotoSMK1, FotoSMK2, FotoSMK3].map((foto, index) => (
        <div key={index} className="welcome-slide">
          <img src={foto} alt={`SMK Foto ${index + 1}`} />
        </div>
      ))}
    </Slider>
    <div className="welcome-content">
      <h1 className="welcome-title">
        Selamat datang di <span className="highlight">Barmodule</span>
      </h1>
      <p className="welcome-description">
        Mari belajar bersama kami dan wujudkan mimpi mu
      </p>
      <button className="welcome-button" onClick={onStartLearning}>
        Mulai Belajar
      </button>
    </div>
  </div>
);

const MainContent = ({ scrollToService, serviceRef, contentRef }) => (
  <div ref={contentRef}>
    <Navbar />
    <Pengenalan scrollToService={scrollToService} />
    <div ref={serviceRef}>
      <Service />
    </div>
    <Explore />
    <PDFplayer
      pdfUrl={process.env.PUBLIC_URL + "/pdfs/Teknik Membentuk Alis.pdf"}
      title="Buku Panduan Pembuatan Masker Beras Merah dan Yoghurt"
    />
    <Review scrollToService={scrollToService} />
    <Logo
      brands={brands}
      text="Brand yang Sudah Mempercayai Kami" // opsional
    />
    <Contact />
  </div>
);

function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const serviceRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const scrollToService = () => {
    serviceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStartLearning = () => {
    setShowWelcome(false);
    setTimeout(() => {
      if (contentRef.current) {
        const navbarHeight =
          document.querySelector(".navbar")?.offsetHeight || 0;
        const yOffset = -navbarHeight; // Adjust this value if needed
        const y =
          contentRef.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "instant" });
      }
    }, 0);
  };

  return (
    <div className="home-component">
      {showWelcome ? (
        <>
          <NavbarHome />
          <WelcomeSection onStartLearning={handleStartLearning} />
        </>
      ) : (
        <MainContent
          scrollToService={scrollToService}
          serviceRef={serviceRef}
          contentRef={contentRef}
        />
      )}
      <Footer />
    </div>
  );
}

export default Home;