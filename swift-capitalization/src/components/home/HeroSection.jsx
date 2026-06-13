import { Link } from "react-router-dom";
import { CiDesktopMouse2 } from "react-icons/ci";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/HeroSection.module.css";

const HeroSection = ({ config = SECTOR_CONFIG.hero }) => {
  const { valueProp, cta, backgroundType, backgroundUrl } = config;

  return (
    <section className={styles.heroSection} id="hero">
      {backgroundType === "video" && (
        <video className={styles.heroBg} autoPlay muted loop playsInline>
          <source src={backgroundUrl} type="video/mp4" />
        </video>
      )}
      {backgroundType === "image" && (
        <img src={backgroundUrl} alt="" className={styles.heroBg} />
      )}

      <div className={styles.heroOverlay} />

      <div className={styles.heroContent}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroHeadline}>{valueProp.headline}</h1>
          <p className={styles.heroSubheadline}>{valueProp.subheadline}</p>

          <div className={styles.heroCtaGroup}>
            <Link to={cta.primary.link} className={styles.btnPrimary}>
              {cta.primary.text}
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <CiDesktopMouse2 size={36} />
      </div>
    </section>
  );
};

export default HeroSection;
