import React, { useState, useEffect } from "react";
import "../css/Service.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { courseAPI } from "../services/api";
import FALLBACK_IMAGE from "../assets/images/coursePhoto.png";

const ServiceCard = ({ title, description, image, slug }) => (
  <div className="service-card">
    <Link to={`/belajar/${slug}`}>
      <div className="service-card-image">
        <img
          src={image || FALLBACK_IMAGE}
          alt={title}
          onError={(e) => {
            e.target.onerror = null; // cegah infinite loop kalau FALLBACK_IMAGE juga gagal
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className="service-card-body">
        <h3 className="service-card-title">{title}</h3>
        <p className="service-card-desc">{description}</p>
      </div>
    </Link>
  </div>
);

const Service = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({});
  }, []);

  useEffect(() => {
    courseAPI
      .getAll()
      .then((res) => setCourses(res.data))
      .catch((err) => {
        console.error("Gagal mengambil data course:", err);
        setError("Gagal memuat materi. Silakan coba lagi nanti.");
      })
      .finally(() => setLoading(false));
  }, []);

  // penting: AOS.init() di atas jalan sebelum card course ada di DOM
  // (karena fetch-nya async), jadi perlu di-refresh setelah data masuk
  useEffect(() => {
    if (!loading) AOS.refresh();
  }, [loading, courses]);

  return (
    <section className="our-service-container">
      <div
        className="our-service-title"
        data-aos="fade-up"
        data-aos-offset="350"
      >
        <span className="subtitle">MATERI KAMI</span>
        <h1>
          Materi Yang <span className="highlight">Tersedia</span>
        </h1>
      </div>

      {loading && <p className="service-status">Memuat materi...</p>}
      {error && <p className="service-status service-status-error">{error}</p>}
      {!loading && !error && courses.length === 0 && (
        <p className="service-status">Belum ada materi tersedia.</p>
      )}

      {!loading && !error && courses.length > 0 && (
        <div
          className="service-container"
          data-aos="slide-up"
          data-aos-offset="350"
          data-aos-once="false"
        >
          {courses.map((course) => (
            <ServiceCard key={course._id} {...course} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Service;
