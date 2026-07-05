import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import Image1 from "../assets/images/logounj.png";
import Image2 from "../assets/images/logosmk7.png";
import "../css/Navbar.css";

// Data statis untuk modal Explore (di luar "Materi" — halaman umum seperti About)
const searchData = [
  {
    category: "About",
    keywords: ["Visi", "Misi", "Sejarah", "Tujuan Pembelajaran", "Kontak"],
    path: "/about",
  },
];

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [materiOpen, setMateriOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userAvatar, setUserAvatar] = useState(
    localStorage.getItem("userAvatar") || null,
  );
  const [avatarError, setAvatarError] = useState(false);

  // ─── Daftar course dinamis untuk dropdown "Materi" ─────────────────────────
  // Menggantikan link statis Tatarias/Salon/Treatment/Hairstyle — sekarang
  // diambil langsung dari database sesuai title & slug course masing-masing.
  const [navCourses, setNavCourses] = useState([]);
  const [navCoursesLoaded, setNavCoursesLoaded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    setAvatarError(false);
  }, [userAvatar]);

  // Ambil daftar course untuk dropdown Materi (public, tidak perlu token)
  useEffect(() => {
    api
      .get("/courses")
      .then((res) => {
        const data = res.data;
        setNavCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Gagal memuat daftar course untuk navbar:", err);
        setNavCourses([]);
      })
      .finally(() => setNavCoursesLoaded(true));
  }, []);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");

    if (token) {
      setIsLoggedIn(true);
      setUserName(name || "User");
      setUserRole(role || "user");
      // tampilkan avatar dari cache dulu biar gak kedip
      const cachedAvatar = localStorage.getItem("userAvatar");
      if (cachedAvatar) setUserAvatar(cachedAvatar);

      // lalu ambil yang terbaru dari server
      api
        .get("/users/profile")
        .then((res) => {
          const avatarUrl = res.data?.avatar;
          if (avatarUrl) {
            setUserAvatar(avatarUrl);
            localStorage.setItem("userAvatar", avatarUrl);
          } else {
            setUserAvatar(null);
            localStorage.removeItem("userAvatar");
          }
        })
        .catch((err) => {
          console.error("Gagal mengambil avatar:", err);
        });
    } else {
      setIsLoggedIn(false);
      setUserAvatar(null);
    }
  }, [location]);

  useEffect(() => {
    const handleAvatarUpdate = (e) => {
      setUserAvatar(e.detail);
    };
    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () =>
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
  }, []);

  const isAtAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMateriOpen(false);
  };

  const isActive = (path) => location.pathname === path;

useEffect(() => {
  // Jika sedang di halaman admin, jangan aktifkan efek scroll
  if (isAtAdmin) {
    setScrolled(false);
    return;
  }

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  // Jalankan sekali saat pertama render
  handleScroll();

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, [isAtAdmin]);

  useEffect(() => {
    if (exploreOpen) {
      document.body.style.overflow = "hidden";
      searchRef.current?.focus();
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [exploreOpen]);

  // ─── Search di modal Explore: gabungkan data statis (About) + course dinamis ──
  useEffect(() => {
    if (searchTerm) {
      const combinedData = [
        ...searchData,
        ...navCourses.map((course) => ({
          category: course.title,
          keywords: [course.title, ...(course.searchKeywords || [])],
          path: `/belajar/${course.slug}`,
        })),
      ];

      const results = combinedData.reduce((acc, category) => {
        const matchingKeywords = category.keywords.filter((keyword) =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        if (matchingKeywords.length > 0) {
          acc.push({
            category: category.category,
            keywords: matchingKeywords,
            path: category.path,
          });
        }
        return acc;
      }, []);

      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchTerm, navCourses]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userAvatar");
    setIsLoggedIn(false);
    setUserAvatar(null);
    setShowUserMenu(false);
    navigate("/");
  };

  const NavLinks = ({ mobile = false }) => (
    <ul className={`nav-links ${mobile ? "mobile" : ""}`}>
      <li>
        <a href="/" className={isActive("/") ? "active-link" : ""}>
          Home
        </a>
      </li>
      <li>
        <a href="/about" className={isActive("/about") ? "active-link" : ""}>
          About
        </a>
      </li>
      <li className={`dropdown ${mobile && materiOpen ? "dropdown-open" : ""}`}>
  <span onClick={mobile ? () => setMateriOpen((prev) => !prev) : undefined}>
    Materi
  </span>
  <ul className="dropdown-menu">
    {!navCoursesLoaded ? (
      <li>
        <span style={{ opacity: 0.6, cursor: "default" }}>Memuat...</span>
      </li>
    ) : navCourses.length > 0 ? (
      navCourses.map((course) => (
        <li key={course._id}>
          <a
            href={`/belajar/${course.slug}`}
            className={isActive(`/belajar/${course.slug}`) ? "active-link" : ""}
            onClick={() => {
              setMateriOpen(false);
              setMobileMenuOpen(false);
            }}
          >
            {course.title}
          </a>
        </li>
      ))
    ) : (
      <li>
        <span style={{ opacity: 0.6, cursor: "default" }}>Belum ada kelas</span>
      </li>
    )}
  </ul>
</li>
      <li>
        <a
          onClick={(e) => {
            e.preventDefault();
            setExploreOpen(true);
          }}
          href="#explore"
          className={isActive("/#explore") ? "active-link" : ""}
          style={{ cursor: "pointer" }}
        >
          Explore
        </a>
      </li>
    </ul>
  );

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <img src={Image1} alt="Logo UNJ" width={70} />
            <img src={Image2} alt="Logo SMK7" width={70} />
          </div>

          {/* Desktop Navigation */}
          {!isAtAdmin && (
            <div className="navbar-menu desktop-menu">
              <NavLinks />
            </div>
          )}

          {/* Auth Section */}
          <div className="navbar-auth">
            {isLoggedIn ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {userRole === "admin" && (
                  <Link
                    to={isAtAdmin ? "/" : "/admin"}
                    className="admin-toggle-btn"
                  >
                    {isAtAdmin ? "🏠 Halaman Utama" : "🛠️ Admin Panel"}
                  </Link>
                )}
                <div className="user-menu-container" ref={userMenuRef}>
                  <button
                    className="user-button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {userAvatar && !avatarError ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="navbar-avatar"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <div className="navbar-avatar navbar-avatar-initials">
                        {getInitials(userName)}
                      </div>
                    )}
                    <span>{userName}</span>
                  </button>

                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <p className="user-name">{userName}</p>
                        <p className="user-role">{userRole}</p>
                      </div>
                      <hr />
                      <Link
                        to="/profile"
                        className="dropdown-link"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUser /> Profil Saya
                      </Link>
                      <hr />
                      <button
                        onClick={handleLogout}
                        className="dropdown-link logout"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">
                  Login
                </Link>
                <Link to="/register" className="register-btn">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <AiOutlineClose size={30} color="#FF33FC" />
            ) : (
              <BiMenu size={30} color="#FF33FC" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`navbar-mobile ${mobileMenuOpen ? "active" : ""}`}>
          <NavLinks mobile={true} />

          {/* Mobile Auth */}
          {!isLoggedIn && (
            <div className="mobile-auth">
              <Link to="/login" className="mobile-login-btn">
                Login
              </Link>
              <Link to="/register" className="mobile-register-btn">
                Daftar
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Explore Search Modal */}
      {exploreOpen && (
        <div className="explore-modal-overlay">
          <div className="explore-modal">
            <div className="explore-modal-header">
              <div className="explore-search-container">
                <BiSearch className="explore-search-icon" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search keywords..."
                  className="explore-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={() => setExploreOpen(false)}
                  className="explore-close-button"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>
            </div>

            <div className="explore-modal-content">
              {searchTerm === "" ? (
                <div className="explore-categories">
                  {searchData.map((category) => (
                    <div key={category.category} className="explore-category">
                      <h3>{category.category}</h3>
                      <div className="explore-keywords">
                        {category.keywords.map((keyword) => (
                          <a
                            key={keyword}
                            href={category.path}
                            className="explore-keyword"
                          >
                            {keyword}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}

                  {navCourses.map((course) => (
                    <div key={course._id} className="explore-category">
                      <h3>{course.title}</h3>
                      <div className="explore-keywords">
                        {(course.searchKeywords?.length > 0
                          ? course.searchKeywords
                          : [course.title]
                        ).map((keyword) => (
                          <a
                            key={keyword}
                            href={`/belajar/${course.slug}`}
                            className="explore-keyword"
                          >
                            {keyword}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="explore-categories">
                  {filteredResults.map((category) => (
                    <div key={category.category} className="explore-category">
                      <h3>{category.category}</h3>
                      <div className="explore-keywords">
                        {category.keywords.map((keyword) => (
                          <a
                            key={keyword}
                            href={category.path}
                            className="explore-keyword"
                          >
                            {keyword}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="explore-no-results">
                  No results found for "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
