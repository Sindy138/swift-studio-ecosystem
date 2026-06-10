import { useParams, Link } from "react-router-dom";
import {
  FiAlertTriangle, FiSearch, FiTarget, FiFileText, FiLink,
  FiCalendar, FiUsers, FiZap, FiBarChart2, FiCamera, FiGlobe,
  FiSettings, FiGitMerge, FiEdit, FiLayers, FiShare2, FiMonitor,
} from "react-icons/fi";
import SECTOR_CONFIG from "../config/content";
import useInView from "../hooks/useInView";
import styles from "./styles/ServicioDetailPage.module.css";

const ICON_MAP = {
  AlertTriangle: FiAlertTriangle,
  Search: FiSearch,
  Target: FiTarget,
  FileText: FiFileText,
  Link: FiLink,
  Calendar: FiCalendar,
  Users: FiUsers,
  Zap: FiZap,
  BarChart2: FiBarChart2,
  Camera: FiCamera,
  Globe: FiGlobe,
  Settings: FiSettings,
  GitMerge: FiGitMerge,
  Edit: FiEdit,
  Layers: FiLayers,
  Share2: FiShare2,
  Monitor: FiMonitor,
};

const HUB_URL = import.meta.env.VITE_HUB_URL || "https://hub.swiftstudio.com";

/* ---- Hero ---- */
const HeroSection = ({ data }) => {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return (
    <section className={styles.hero}>
      <div ref={ref} className={styles.heroContainer}>
        <span
          className={`${styles.serviceTag} ${styles.fadeIn} ${inView ? styles.visible : ""}`}
          style={{ borderColor: data.color, color: data.color }}
        >
          {data.tag}
        </span>
        <h1
          className={`${styles.heroHeadline} ${styles.fadeIn} ${styles.delay1} ${inView ? styles.visible : ""}`}
        >
          {data.headline}
        </h1>
        <p
          className={`${styles.heroSubheadline} ${styles.fadeIn} ${styles.delay2} ${inView ? styles.visible : ""}`}
        >
          {data.subheadline}
        </p>
        <div
          className={`${styles.heroCtas} ${styles.fadeIn} ${styles.delay3} ${inView ? styles.visible : ""}`}
        >
          <a
            href={HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            Empezar ahora
          </a>
          <Link to="/contacto" className={styles.btnSecondary}>
            Contactar
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ---- Problema ---- */
const ProblemaSection = ({ data }) => {
  const [ref, inView] = useInView();
  return (
    <section className={styles.problema}>
      <div ref={ref} className={styles.problemaContainer}>
        <div
          className={`${styles.sectionHeader} ${styles.fadeIn} ${inView ? styles.visible : ""}`}
        >
          <h2 className={styles.sectionTitleDark}>{data.headline}</h2>
        </div>
        <div className={styles.problemaGrid}>
          {data.points.map((point, i) => {
            const Icon = ICON_MAP[point.iconName];
            return (
              <div
                key={i}
                className={`${styles.problemaItem} ${styles.fadeIn} ${styles[`delay${(i % 4) + 1}`]} ${inView ? styles.visible : ""}`}
              >
                {Icon && (
                  <span className={styles.problemaIcon}>
                    <Icon size={20} />
                  </span>
                )}
                <p className={styles.problemaText}>{point.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ---- Solución ---- */
const SolucionSection = ({ data }) => {
  const [ref, inView] = useInView();
  return (
    <section className={styles.solucion}>
      <div ref={ref} className={styles.solucionContainer}>
        <div
          className={`${styles.sectionHeader} ${styles.fadeIn} ${inView ? styles.visible : ""}`}
        >
          <h2 className={styles.sectionTitleLight}>{data.headline}</h2>
          <p className={styles.sectionSubtitle}>{data.subheadline}</p>
        </div>
        <div className={styles.featuresGrid}>
          {data.features.map((feature, i) => {
            const Icon = ICON_MAP[feature.iconName];
            return (
              <div
                key={i}
                className={`${styles.featureCard} ${styles.fadeIn} ${styles[`delay${(i % 4) + 1}`]} ${inView ? styles.visible : ""}`}
              >
                {Icon && (
                  <span className={styles.featureIcon}>
                    <Icon size={24} />
                  </span>
                )}
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ---- Proceso ---- */
const ProcesoSection = ({ data }) => {
  const [ref, inView] = useInView();
  return (
    <section className={styles.proceso}>
      <div ref={ref} className={styles.procesoContainer}>
        <div
          className={`${styles.sectionHeader} ${styles.fadeIn} ${inView ? styles.visible : ""}`}
        >
          <h2 className={styles.sectionTitleDark}>{data.headline}</h2>
        </div>
        <div className={styles.stepsGrid}>
          {data.steps.map((step, i) => {
            const Icon = ICON_MAP[step.iconName];
            return (
              <div
                key={i}
                className={`${styles.stepItem} ${styles.fadeIn} ${styles[`delay${(i % 4) + 1}`]} ${inView ? styles.visible : ""}`}
              >
                <div className={styles.stepNumber}>{step.number}</div>
                {Icon && (
                  <span className={styles.stepIcon}>
                    <Icon size={24} />
                  </span>
                )}
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ---- Resultados ---- */
const ResultadosSection = ({ data }) => {
  const [ref, inView] = useInView();
  return (
    <section className={styles.resultados}>
      <div ref={ref} className={styles.resultadosContainer}>
        <div
          className={`${styles.sectionHeader} ${styles.fadeIn} ${inView ? styles.visible : ""}`}
        >
          <h2 className={styles.sectionTitleLight}>{data.headline}</h2>
        </div>
        <div className={styles.statsRow}>
          {data.stats.map((stat, i) => (
            <div
              key={i}
              className={`${styles.statItem} ${styles.fadeIn} ${styles[`delay${i + 1}`]} ${inView ? styles.visible : ""}`}
            >
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---- CTA ---- */
const CtaSection = ({ data }) => {
  const [ref, inView] = useInView();
  return (
    <section className={styles.ctaSection}>
      <div ref={ref} className={styles.ctaContainer}>
        <div
          className={`${styles.ctaBox} ${styles.fadeIn} ${inView ? styles.visible : ""}`}
        >
          <h2 className={styles.ctaHeadline}>{data.headline}</h2>
          <p className={styles.ctaSubheadline}>{data.subheadline}</p>
          <a
            href={HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            {data.buttonText}
          </a>
        </div>
      </div>
    </section>
  );
};

/* ---- Página principal ---- */
const ServicioDetailPage = () => {
  const { slug } = useParams();
  const servicio = SECTOR_CONFIG.servicios[slug];

  if (!servicio) {
    return (
      <main style={{ padding: "8rem 2rem", textAlign: "center" }}>
        <h1 style={{ marginBottom: "1rem" }}>Servicio no encontrado</h1>
        <p style={{ marginBottom: "2rem", color: "var(--color-text-light)" }}>
          El servicio que buscas no existe.
        </p>
        <Link to="/servicios" style={{ color: "#aa73fa", fontWeight: 600 }}>
          Ver todos los servicios
        </Link>
      </main>
    );
  }

  const { meta, hero, problema, solucion, proceso, resultados, cta } = servicio;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: meta.title,
            description: meta.description,
            provider: { "@type": "Organization", name: "Swift Studio" },
            url: typeof window !== "undefined" ? window.location.href : "",
          }),
        }}
      />

      <HeroSection data={hero} />
      <ProblemaSection data={problema} />
      <SolucionSection data={solucion} />
      <ProcesoSection data={proceso} />
      <ResultadosSection data={resultados} />
      <CtaSection data={cta} />
    </main>
  );
};

export default ServicioDetailPage;
