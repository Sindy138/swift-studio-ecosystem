import { Link } from "react-router-dom";
import { FiTarget, FiCode, FiZap, FiGitMerge, FiTrendingUp } from "react-icons/fi";
import SECTOR_CONFIG from "../config/content";
import useInView from "../hooks/useInView";
import styles from "./styles/QuienesSomosPage.module.css";

const ICON_MAP = {
  Target: FiTarget,
  Code: FiCode,
  Zap: FiZap,
  GitMerge: FiGitMerge,
  TrendingUp: FiTrendingUp,
};

const { quienesSomos } = SECTOR_CONFIG;

/* ---------- Sección Origen ---------- */
const OrigenSection = () => {
  const [ref, inView] = useInView();
  const { origen } = quienesSomos;
  return (
    <section className={styles.origen}>
      <div ref={ref} className={styles.origenContainer}>
        <div className={`${styles.origenText} ${styles.fadeIn} ${inView ? styles.visible : ""}`}>
          <p className={styles.origenSubheadline}>{origen.subheadline}</p>
          <h2>{origen.headline}</h2>
          {origen.paragraphs.map((p, i) => (
            <p key={i} className={styles.origenParagraph}>{p}</p>
          ))}
        </div>
        <div className={`${styles.origenStat} ${styles.fadeIn} ${styles.delay2} ${inView ? styles.visible : ""}`}>
          <div className={styles.origenStatValue}>{origen.stat.value}</div>
          <div className={styles.origenStatLabel}>{origen.stat.label}</div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Sección Perfil ---------- */
const PerfilSection = () => {
  const [ref, inView] = useInView();
  const { perfil } = quienesSomos;
  return (
    <section className={styles.perfil}>
      <div ref={ref} className={styles.perfilContainer}>
        <div className={`${styles.sectionHeader} ${styles.fadeIn} ${inView ? styles.visible : ""}`}>
          <h2 className={styles.sectionTitle}>{perfil.headline}</h2>
          <p className={styles.sectionSubtitle}>{perfil.subheadline}</p>
        </div>
        <div className={styles.perfilGrid}>
          {perfil.areas.map((area, i) => {
            const IconComponent = ICON_MAP[area.iconName];
            return (
              <div
                key={i}
                className={`${styles.perfilArea} ${styles.fadeIn} ${i === 0 ? styles.delay1 : styles.delay2} ${inView ? styles.visible : ""}`}
              >
                <div className={styles.perfilAreaHeader}>
                  {IconComponent && (
                    <span className={styles.perfilAreaIcon}>
                      <IconComponent size={22} />
                    </span>
                  )}
                  <h3 className={styles.perfilAreaTitle}>{area.category}</h3>
                </div>
                <ul className={styles.skillList}>
                  {area.skills.map((skill, j) => (
                    <li key={j} className={styles.skillItem}>
                      <span className={styles.skillDot} />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ---------- Sección Filosofía ---------- */
const FilosofiaSection = () => {
  const [ref, inView] = useInView();
  const { filosofia } = quienesSomos;
  return (
    <section className={styles.filosofia}>
      <div ref={ref} className={styles.filosofiaContainer}>
        <div className={`${styles.filosofiaSectionHeader} ${styles.fadeIn} ${inView ? styles.visible : ""}`}>
          <h2 className={styles.filosofiaSectionTitle}>{filosofia.headline}</h2>
          <p className={styles.filosofiaSectionSubtitle}>{filosofia.subheadline}</p>
        </div>
        <div className={styles.principlesGrid}>
          {filosofia.principles.map((p, i) => {
            const IconComponent = ICON_MAP[p.iconName];
            const delayClass = styles[`delay${i + 1}`] || "";
            return (
              <div
                key={i}
                className={`${styles.principleCard} ${styles.fadeIn} ${delayClass} ${inView ? styles.visible : ""}`}
              >
                {IconComponent && (
                  <span className={styles.principleIcon}>
                    <IconComponent size={28} />
                  </span>
                )}
                <h3 className={styles.principleTitle}>{p.title}</h3>
                <p className={styles.principleDescription}>{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ---------- Página principal ---------- */
const QuienesSomosPage = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView();
  const { hero, cta } = quienesSomos;

  const [before, after] = hero.headline.split(hero.headlineAccent);

  return (
    <main>
      {/* JSON-LD AboutPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Quiénes Somos — Swift Studio",
            description: hero.subheadline,
            url: typeof window !== "undefined" ? `${window.location.origin}/quienes-somos` : "",
          }),
        }}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div ref={heroRef} className={styles.heroContainer}>
          <h1 className={`${styles.heroHeadline} ${styles.fadeIn} ${heroInView ? styles.visible : ""}`}>
            {before}
            <span className={styles.gradientText}>{hero.headlineAccent}</span>
            {after}
          </h1>
          <p className={`${styles.heroSubheadline} ${styles.fadeIn} ${styles.delay1} ${heroInView ? styles.visible : ""}`}>
            {hero.subheadline}
          </p>
        </div>
      </section>

      {/* Origen */}
      <OrigenSection />

      {/* Perfil */}
      <PerfilSection />

      {/* Filosofía */}
      <FilosofiaSection />

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div ref={ctaRef} className={styles.ctaContainer}>
          <div className={`${styles.ctaBox} ${styles.fadeIn} ${ctaInView ? styles.visible : ""}`}>
            <h2 className={styles.ctaHeadline}>{cta.headline}</h2>
            <p className={styles.ctaSubheadline}>{cta.subheadline}</p>
            <Link to="/contacto" className={styles.btnPrimary}>
              {cta.buttonText}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default QuienesSomosPage;
