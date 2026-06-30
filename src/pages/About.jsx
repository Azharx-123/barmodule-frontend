import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../css/About.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfilPengembang from "../assets/images/profil_pengembang.jpeg";

function About() {
  useEffect(() => {
    AOS.init({ duration: 700, once: false, easing: "ease-out-cubic" });
  }, []);

  return (
    <>
      <Navbar />
      <link
        href="https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@400;700;900&family=Poppins:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="ab-hero">
        <div className="ab-hero__overlay" />
        <div className="ab-hero__content" data-aos="fade-up">
          <span className="ab-eyebrow">Tentang Kami</span>
          <h1>
            Media Pembelajaran
            <br />
            <span>Tata Rias</span> Digital
          </h1>
          <p>
            Platform interaktif berbasis web untuk mendukung proses belajar Tata
            Rias yang menyenangkan dan efektif.
          </p>
        </div>
        <div className="ab-hero__wave" />
      </section>

      {/* ── TENTANG WEBSITE ──────────────────────── */}
      <section className="ab-section" id="tentang-website">
        <div className="ab-container">
          <div className="ab-section__head" data-aos="fade-up">
            <span className="ab-tag">Website</span>
            <h2>
              Tentang <span>Website</span> Ini
            </h2>
            <p className="ab-section__sub">
              Dirancang khusus sebagai media pembelajaran digital yang inovatif
              dan mudah diakses oleh seluruh siswa.
            </p>
          </div>

          <div className="ab-cards" data-aos="fade-up" data-aos-delay="80">
            <div className="ab-card ab-card--hover">
              <div className="ab-card__icon">🎯</div>
              <h3>Tujuan</h3>
              <p>
                Membantu siswa memahami materi Tata Rias secara mendalam melalui
                pendekatan digital yang interaktif dan terstruktur.
              </p>
            </div>
            <div className="ab-card ab-card--hover" data-aos-delay="120">
              <div className="ab-card__icon">📚</div>
              <h3>Fitur Utama</h3>
              <p>
                Menyajikan materi pembelajaran, kuis interaktif, video tutorial,
                dan sumber belajar lain dalam satu platform terpadu.
              </p>
            </div>
            <div className="ab-card ab-card--hover" data-aos-delay="160">
              <div className="ab-card__icon">✨</div>
              <h3>Manfaat</h3>
              <p>
                Meningkatkan minat dan pemahaman siswa terhadap mata pelajaran
                Tata Rias melalui pengalaman belajar yang modern dan menarik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO SEKOLAH ─────────────────────────── */}
      <section className="ab-section ab-section--alt" id="info-sekolah">
        <div className="ab-container">
          <div className="ab-split" data-aos="fade-up">
            {/* Ganti div di bawah dengan <img src={GambarSekolah} ... /> jika tersedia */}
            <div className="ab-split__visual" data-aos="fade-right">
              <div className="ab-school-thumb">
                <span>🏫</span>
              </div>
            </div>

            <div
              className="ab-split__info"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <span className="ab-tag">Institusi</span>
              <h2>
                Informasi <span>Sekolah</span>
              </h2>
              <div className="ab-detail-list">
                <div className="ab-detail">
                  <span className="ab-detail__label">Nama Sekolah</span>
                  <span className="ab-detail__value">
                    SMK Negeri [Nama Sekolah]
                  </span>
                </div>
                <div className="ab-detail">
                  <span className="ab-detail__label">Alamat</span>
                  <span className="ab-detail__value">
                    Jl. [Alamat Sekolah], [Kota]
                  </span>
                </div>
                <div className="ab-detail">
                  <span className="ab-detail__label">Jurusan</span>
                  <span className="ab-detail__value">Tata Kecantikan</span>
                </div>
                <div className="ab-detail">
                  <span className="ab-detail__label">Akreditasi</span>
                  <span className="ab-detail__value">A</span>
                </div>
                <div className="ab-detail">
                  <span className="ab-detail__label">Nomor Telepon</span>
                  <span className="ab-detail__value">(021) XXX-XXXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO MATA PELAJARAN ──────────────────── */}
      <section className="ab-section" id="info-mapel">
        <div className="ab-container">
          <div className="ab-section__head" data-aos="fade-up">
            <span className="ab-tag">Kurikulum</span>
            <h2>
              Informasi <span>Mata Pelajaran</span>
            </h2>
          </div>

          <div className="ab-subject" data-aos="fade-up" data-aos-delay="80">
            <div className="ab-subject__lead">
              <h3>Tata Rias</h3>
              <p>
                Mata pelajaran yang mempelajari teknik dan seni merias wajah
                serta perawatan kecantikan secara komprehensif sesuai standar
                kompetensi nasional.
              </p>
            </div>
            <div className="ab-subject__grid">
              <div className="ab-meta">
                <span className="ab-meta__ico">📋</span>
                <div>
                  <span className="ab-meta__label">Kompetensi Dasar</span>
                  <span className="ab-meta__val">Tata Rias Wajah Dasar</span>
                </div>
              </div>
              <div className="ab-meta">
                <span className="ab-meta__ico">⏰</span>
                <div>
                  <span className="ab-meta__label">Alokasi Waktu</span>
                  <span className="ab-meta__val">X JP / Minggu</span>
                </div>
              </div>
              <div className="ab-meta">
                <span className="ab-meta__ico">🏆</span>
                <div>
                  <span className="ab-meta__label">Kelas</span>
                  <span className="ab-meta__val">X & XI Tata Kecantikan</span>
                </div>
              </div>
              <div className="ab-meta">
                <span className="ab-meta__ico">📖</span>
                <div>
                  <span className="ab-meta__label">Kurikulum</span>
                  <span className="ab-meta__val">Merdeka Belajar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROFIL PENGEMBANG ────────────────────── */}
      <section className="ab-section ab-section--alt" id="profil-pengembang">
        <div className="ab-container">
          <div className="ab-section__head" data-aos="fade-up">
            <span className="ab-tag">Pengembang</span>
            <h2>
              Profil <span>Pengembang</span>
            </h2>
          </div>

          <div className="ab-dev" data-aos="slide-up">
            <div className="ab-dev__photo" data-aos="fade-right">
              <img src={ProfilPengembang} alt="Profil Pengembang" />
            </div>
            <div
              className="ab-dev__body"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <div className="ab-dev__heading">
                <h3>Ahmad Azhar Riyadin</h3>
                <span className="ab-dev__badge">Pengembang Website</span>
              </div>
              <div className="ab-detail-list">
                <div className="ab-detail">
                  <span className="ab-detail__label">NIM</span>
                  <span className="ab-detail__value">1512621055</span>
                </div>
                <div className="ab-detail">
                  <span className="ab-detail__label">Program Studi</span>
                  <span className="ab-detail__value">
                    Pendidikan Teknik Informatika & Komputer
                  </span>
                </div>
                <div className="ab-detail">
                  <span className="ab-detail__label">Fakultas</span>
                  <span className="ab-detail__value">Teknik</span>
                </div>
                <div className="ab-detail">
                  <span className="ab-detail__label">Pembimbing I</span>
                  <span className="ab-detail__value">
                    Ressy Dwitias Sari, S.T., M.T.I.
                  </span>
                </div>
                <div className="ab-detail">
                  <span className="ab-detail__label">Pembimbing II</span>
                  <span className="ab-detail__value">
                    Via Tuhamah Fauziastuti, S.Si, M.Ed.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUMBER REFERENSI ─────────────────────── */}
      <section className="ab-section ab-section--dark" id="referensi">
        <div className="ab-container">
          <div className="ab-section__head" data-aos="fade-up">
            <span className="ab-tag ab-tag--dark">Pustaka</span>
            <h2 className="ab-head--light">
              Sumber <span>Referensi</span>
            </h2>
            <p className="ab-section__sub ab-sub--light">
              Daftar rujukan yang digunakan dalam penyusunan materi pembelajaran
              pada website ini.
            </p>
          </div>

          <div className="ab-refs" data-aos="fade-up" data-aos-delay="80">
            <div className="ab-ref">
              <span className="ab-ref__num">01</span>
              <p>
                Kusantati, H., Prihatin, T., &amp; Wiana, W. (2008).{" "}
                <em>Tata Kecantikan Kulit untuk SMK Jilid 1</em>. Direktorat
                Pembinaan Sekolah Menengah Kejuruan.
              </p>
            </div>
            <div className="ab-ref">
              <span className="ab-ref__num">02</span>
              <p>
                Andiyanto &amp; Ayu Isni Karim. (2010).{" "}
                <em>The Make Over: Rahasia Rias Wajah Sempurna</em>. Gramedia
                Pustaka Utama.
              </p>
            </div>
            <div className="ab-ref">
              <span className="ab-ref__num">03</span>
              <p>
                Primadiati, R. (2001).{" "}
                <em>Kecantikan, Kosmetika &amp; Estetika</em>. Gramedia Pustaka
                Utama.
              </p>
            </div>
            <div className="ab-ref">
              <span className="ab-ref__num">04</span>
              <p>
                Rusman. (2012).{" "}
                <em>Belajar dan Pembelajaran Berbasis Komputer</em>. Alfabeta.
              </p>
            </div>
            <div className="ab-ref">
              <span className="ab-ref__num">05</span>
              <p>
                Arsyad, A. (2014). <em>Media Pembelajaran</em>. Rajawali Pers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;
