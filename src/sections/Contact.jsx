import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import "../css/Contact.css";

function Contact() {
  const formRef = useRef(null);

  const [focused, setFocused] = useState({
    name: false,
    email: false,
    title: false,
    message: false,
  });

  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handleFocus = (field) =>
    setFocused((prev) => ({ ...prev, [field]: true }));

  const handleBlur = (field) =>
    setFocused((prev) => ({ ...prev, [field]: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });

    try {
      await emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setFormStatus({ loading: false, success: true, error: null });
      formRef.current.reset();

      setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, success: false }));
      }, 5000);
    } catch (err) {
      setFormStatus({
        loading: false,
        success: false,
        error: "Gagal mengirim pesan. Silakan coba lagi.",
      });
    }
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
          Contact <span>Learning Management System.</span>
        </h3>
        <h1 className="animate-in">Hubungi Tim Kami</h1>
      </div>

      <div className="contact-form">
        <form
          ref={formRef}
          className="contact-form-container animate-in"
          onSubmit={handleSubmit}
        >

          <div className={`form__group ${focused.name ? "focused" : ""}`}>
            <label htmlFor="name" className="form__label">Nama</label>
            <input
              type="text"
              className="form__field"
              name="name"     
              id="name"
              required
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
            />
          </div>

          <div className={`form__group ${focused.email ? "focused" : ""}`}>
            <label htmlFor="email" className="form__label">Email</label>
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
            <label htmlFor="title" className="form__label">Title</label>
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
            <label htmlFor="message" className="form__label">Message</label>
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

          {formStatus.success && (
            <p className="form-feedback form-feedback--success">
              ✅ Pesan berhasil dikirim ke info@smkn7tangsel.sch.id!
            </p>
          )}
          {formStatus.error && (
            <p className="form-feedback form-feedback--error">
              ❌ {formStatus.error}
            </p>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={formStatus.loading}
          >
            {formStatus.loading ? "Mengirim..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;