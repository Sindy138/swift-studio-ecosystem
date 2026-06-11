import { Link } from "react-router-dom";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/SEOAuthority.module.css";

const SEOAuthority = ({ config = SECTOR_CONFIG.seoAuthority }) => {
  const { title, subtitle, keyStats, authorityContent } = config;

  return (
    <section className={styles["seo-authority-section"]} id="seo-authority">
      <div className={styles["authority-container"]}>

        {/* Header */}
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>{title}</h2>
          <p className={styles["section-subtitle"]}>{subtitle}</p>
        </div>

        {/* Stats en plano — sin cards */}
        <div className={styles["key-stats-grid"]}>
          {keyStats.map((stat, idx) => (
            <div key={idx} className={styles["stat-item"]}>
              <div className={styles["stat-metric"]}>{stat.metric}</div>
              <div className={styles["stat-label"]}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Authority Content — plano y centrado */}
        <div className={styles["authority-content"]}>
          <p className={styles["authority-paragraph"]}>
            {authorityContent.mainText}
          </p>

          </div>

        {/* CTA — igual que ServiceGrid */}
        <div className={styles["authority-cta-section"]}>
          <h3>Listo para potenciar tu presencia digital</h3>
          <Link to="/contacto" className={styles["cta-btn"]}>
            Solicitar Consulta Gratuita
          </Link>
        </div>

      </div>
    </section>
  );
};

export default SEOAuthority;
