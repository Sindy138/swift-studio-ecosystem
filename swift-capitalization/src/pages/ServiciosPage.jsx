import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import SECTOR_CONFIG from "../config/content";
import useInView from "../hooks/useInView";
import SEO from "../components/SEO";
import styles from "./styles/ServiciosPage.module.css";

const SERVICE_ORDER = [
  "seo",
  "social-media",
  "fotografia",
  "content",
  "automatizacion",
];

const ServiciosGrid = () => {
  const [ref, inView] = useInView({ threshold: 0.08 });
  const { servicios } = SECTOR_CONFIG;

  return (
    <section className={styles.servicesSection}>
      <div ref={ref} className={styles.servicesContainer}>
        <div className={styles.servicesGrid}>
          {SERVICE_ORDER.map((slug, i) => {
            const servicio = servicios[slug];
            if (!servicio) return null;
            const { hero, meta } = servicio;
            return (
              <Link
                key={slug}
                to={`/servicios/${slug}`}
                className={`${styles.serviceCard} ${styles.fadeIn} ${styles[`delay${i + 1}`]} ${inView ? styles.visible : ""}`}
              >
                <span
                  className={styles.serviceCardTag}
                  style={{ color: hero.color }}
                >
                  {hero.tag}
                </span>
                <h2 className={styles.serviceCardTitle}>{hero.headline}</h2>
                <p className={styles.serviceCardDescription}>
                  {meta.description}
                </p>
                <span className={styles.serviceCardCta}>
                  Ver servicio <FiArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ServiciosPage = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });

  return (
    <main>
      <SEO
        title="Servicios de Marketing Digital"
        description="SEO, Social Media, Fotografía profesional, Content Marketing y Automatización n8n. Un ecosistema completo de servicios para marcas que quieren resultados reales."
        canonical="/servicios"
      />
      <section className={styles.hero}>
        <div ref={heroRef} className={styles.heroContainer}>
          <span className={`${styles.heroLabel} ${styles.fadeIn} ${heroInView ? styles.visible : ""}`}>
            Servicios
          </span>
          <h1
            className={`${styles.heroHeadline} ${styles.fadeIn} ${styles.delay1} ${heroInView ? styles.visible : ""}`}
          >
            Todo lo que tu marca necesita para crecer
          </h1>
          <p
            className={`${styles.heroSubheadline} ${styles.fadeIn} ${styles.delay2} ${heroInView ? styles.visible : ""}`}
          >
            Desde SEO y contenido hasta automatización y fotografía. Un ecosistema
            completo de servicios diseñado para marcas que quieren resultados reales.
          </p>
        </div>
      </section>

      <ServiciosGrid />
    </main>
  );
};

export default ServiciosPage;
