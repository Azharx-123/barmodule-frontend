import React from "react";
import {
  FiMail,
  FiPhone,
  FiYoutube,
  FiTwitter,
  FiInstagram,
} from "react-icons/fi";
import "../css/Footer.css";

const ContactItem = ({ icon: Icon, text }) => (
  <div className="contact-item">
    <Icon className="icon" />
    <span>{text}</span>
  </div>
);

const SocialLink = ({ href, icon: Icon, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <Icon className="icon" />
    <span>{label}</span>
  </a>
);

const Footer = ({ theme = "original" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer footer-${theme}`}>
      <div
        className="footer-content"
        data-aos="fade-up"
        data-aos-offset="50"
        data-aos-duration="500"
        data-aos-delay="100"
        data-aos-once="false"
      >
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ContactItem icon={FiMail} text="info@smkn7tangsel.sch.id" />
          <ContactItem icon={FiPhone} text="(021) 73491027" />
        </div>
        <div className="footer-section">
          <h4>Social Media</h4>
          <div className="social-links">
            <SocialLink
              href="https://www.youtube.com/@SMKN7TANGSEL"
              icon={FiYoutube}
              label="YouTube"
            />
            <SocialLink
              href="https://twitter.com/smkn7tangsel"
              icon={FiTwitter}
              label="Twitter"
            />
            <SocialLink
              href="https://www.instagram.com/smkn7tangsel/"
              icon={FiInstagram}
              label="Instagram"
            />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p
          data-aos="zoom-in"
          data-aos-offset="50"
          data-aos-duration="500"
          data-aos-delay="100"
          data-aos-once="false"
        >
          &copy; {currentYear} SMKN 7 TANGERANG SELATAN. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
