import React, { useEffect } from "react";
import Image1 from "../assets/images/card1.2.png";
import Image2 from "../assets/images/card1.3.png";
import Image3 from "../assets/images/card1.4.png";
import Image4 from "../assets/images/card1.5.png";
import "../css/Service.css";
import AOS from "aos";
import "aos/dist/aos.css";

const serviceData = [
  {
    id: 1,
    title: "Tata Rias",
    description:
      "Seni dan teknik dalam menciptakan tampilan yang berbeda dan menarik melalui pengaturan, styling, dan perawatan rambut.",
    image: Image1,
    link: "/belajar-tatarias",
  },
  {
    id: 2,
    title: "Salon",
    description:
      "Salon adalah tempat yang menyediakan berbagai layanan kecantikan dan perawatan diri, seperti potong rambut, perawatan kulit, manikur, pedikur, dan pijat.",
    image: Image2,
    link: "/belajar-salon",
  },
  {
    id: 3,
    title: "Treatment",
    description:
      "Treatment di salon merupakan proses perawatan khusus yang ditawarkan untuk merawat dan memanjakan tubuh dan kulit.",
    image: Image3,
    link: "/belajar-treatment-rambut",
  },
  {
    id: 4,
    title: "Hairstyle",
    description:
      "Hairstyling adalah seni dan teknik dalam menciptakan tatanan rambut yang berbeda dan menarik.",
    image: Image4,
    link: "/belajar-hairstyling",
  },
];

const ServiceCard = ({ title, description, image, link }) => (
  <div className="service-card">
    <a href={link}>
      <div className="service-card-image">
        <img src={image} alt={title} width={100} height={100} />
      </div>
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-desc">{description}</p>
    </a>
  </div>
);

const Service = () => {
  useEffect(() => {
    AOS.init({});
  }, []);

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
      <div
        className="service-container"
        data-aos="slide-up"
        data-aos-offset="350"
        data-aos-once="false"
      >
        {serviceData.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </section>
  );
};

export default Service;
