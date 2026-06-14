import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import styles from "./Footer.module.css";

const HUB_URL =
  import.meta.env.VITE_HUB_URL || "https://ecommerce.swiftstudio.com";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles["footer-container"]}>
        {/* Logo + tagline + social */}
        <div className={styles["footer-brand"]}>
          <Link to="/" className={styles["footer-logo"]}>
            <img src="/logos/logos-footer.svg" alt="Swift Studio" />
          </Link>
          <p className={styles["footer-tagline"]}>
            Agencia 360º — Fotografía · Social Media · SEO · Content ·
            Automatización
          </p>
          <div className={styles["social-icons"]}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook size={20} />
            </a>
          </div>
        </div>

        {/* Servicios */}
        <div className={styles["footer-nav"]}>
          <h4 className={styles["footer-heading"]}>Servicios</h4>
          <ul>
            <li>
              <Link to="/servicios/seo">SEO</Link>
            </li>
            <li>
              <Link to="/servicios/social-media">Social Media</Link>
            </li>
            <li>
              <Link to="/servicios/fotografia">Fotografía</Link>
            </li>
            <li>
              <Link to="/servicios/content">Content</Link>
            </li>
            <li>
              <Link to="/servicios/automatizacion">Automatización</Link>
            </li>
          </ul>
        </div>

        {/* Empresa */}
        <div className={styles["footer-nav"]}>
          <h4 className={styles["footer-heading"]}>Empresa</h4>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/quienes-somos">Quiénes Somos</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles["footer-bottom"]}>
        <div className={styles["footer-bottom-inner"]}>
          <p>© {currentYear} Swift Studio. Todos los derechos reservados.</p>
          <a
            href={HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["hub-link"]}
          >
            Acceder a Swift Studio 360º →
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
