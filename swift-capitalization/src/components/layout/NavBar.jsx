import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import styles from "./NavBar.module.css";

const NAV_LINKS = [
  { label: "Quiénes Somos", to: "/quienes-somos" },
  { label: "Servicios", to: "/servicios" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
];

const HUB_URL = import.meta.env.VITE_HUB_URL || "https://ecommerce.swiftstudio.com";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  // Cerrar al cambiar de ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <nav className={styles.navbar} ref={navRef}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img
            src="/logos/logo-swift.svg"
            alt="Swift Studio"
            className={styles.logoImage}
          />
        </Link>

        {/* Desktop menu */}
        <ul className={styles.desktopMenu}>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? styles.active : ""}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={HUB_URL}
              className={styles.btnDashboard}
              target="_blank"
              rel="noopener noreferrer"
            >
              360º
            </a>
          </li>
        </ul>

        {/* Hamburger button — solo mobile */}
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
        >
          {isOpen ? <RiCloseLine size={28} /> : <RiMenu3Line size={28} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!isOpen}
      >
        <ul className={styles.mobileLinks}>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? styles.activeMobile : ""}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={HUB_URL}
              className={styles.btnDashboardMobile}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
            >
              360º
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
