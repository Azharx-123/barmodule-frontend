import React, { useState } from "react";
import "../css/Contact.css";

function Contact() {
  const [focused, setFocused] = useState({
    email: false,
    title: false,
    message: false,
  });

  const handleFocus = (field) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocused((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div
      className="contact-container"
      data-aos-offset="350"
      data-aos="zoom-in"
      data-aos-once="false"
    >
      <div className="contact-title">
        <h3 className="animate-in">
          Contact <span>Barmodule.</span>
        </h3>
        <h1 className="animate-in">Hubungi Tim Kami</h1>
      </div>

      <div className="contact-form">
        <form className="contact-form-container animate-in">
          <div className={`form__group ${focused.email ? "focused" : ""}`}>
            <label htmlFor="email" className="form__label">
              Email
            </label>
            <input
              type="email"
              className="form__field"
              name="email"
              id="email"
              required
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
            />
          </div>

          <div className={`form__group ${focused.title ? "focused" : ""}`}>
            <label htmlFor="title" className="form__label">
              Title
            </label>
            <input
              type="text"
              className="form__field"
              name="title"
              id="title"
              required
              onFocus={() => handleFocus("title")}
              onBlur={() => handleBlur("title")}
            />
          </div>

          <div className={`form__group ${focused.message ? "focused" : ""}`}>
            <label htmlFor="message" className="form__label">
              Message
            </label>
            <textarea
              className="form__field"
              name="message"
              id="message"
              rows="5"
              required
              onFocus={() => handleFocus("message")}
              onBlur={() => handleBlur("message")}
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
