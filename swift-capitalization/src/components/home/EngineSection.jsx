import { FiTrendingUp, FiGitMerge, FiBarChart2, FiUsers, FiXCircle, FiCheckCircle } from "react-icons/fi";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/EngineSection.module.css";

const ICON_MAP = {
  TrendingUp: FiTrendingUp,
  GitMerge: FiGitMerge,
  BarChart2: FiBarChart2,
  Users: FiUsers,
};

const HUB_URL = import.meta.env.VITE_HUB_URL || "https://ecommerce.swiftstudio.com";

const EngineSection = ({ config = SECTOR_CONFIG.engine }) => {
  const { title, description, advantages, cta } = config;

  return (
    <section className={styles["engine-section"]} id="engine">
      <div className={styles["engine-container"]}>

        {/* Header */}
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>{title}</h2>
          <p className={styles["section-description"]}>{description}</p>
        </div>

        {/* Advantages — flex centrado */}
        <div className={styles["advantages-grid"]}>
          {advantages.map((advantage) => {
            const IconComponent = ICON_MAP[advantage.iconName];
            return (
              <div key={advantage.id} className={styles["advantage-card"]}>
                {IconComponent && (
                  <div className={styles["advantage-icon"]}>
                    <IconComponent size={32} />
                  </div>
                )}
                <h3 className={styles["advantage-title"]}>{advantage.title}</h3>
                <p className={styles["advantage-description"]}>{advantage.description}</p>
              </div>
            );
          })}
        </div>

        {/* Comparación */}
        <div className={styles["comparison-section"]}>
          <h3 className={styles["comparison-title"]}>Comparación</h3>
          <div className={styles["comparison-table"]}>
            <div className={`${styles["comparison-column"]} ${styles.traditional}`}>
              <h4>Agencia Tradicional</h4>
              <ul>
                <li><FiXCircle size={15} color="#ff6b6b" />Múltiples herramientas sin integración</li>
                <li><FiXCircle size={15} color="#ff6b6b" />Reportes manuales cada 15 días</li>
                <li><FiXCircle size={15} color="#ff6b6b" />Equipo disperso en especialidades</li>
                <li><FiXCircle size={15} color="#ff6b6b" />ROI difícil de medir</li>
                <li><FiXCircle size={15} color="#ff6b6b" />Procesos lentos y burocráticos</li>
              </ul>
            </div>
            <div className={`${styles["comparison-column"]} ${styles.modern}`}>
              <h4>Swift Studio</h4>
              <ul>
                <li><FiCheckCircle size={15} color="#4ecdc4" />Dashboard centralizado en tiempo real</li>
                <li><FiCheckCircle size={15} color="#4ecdc4" />Datos live y automatización n8n</li>
                <li><FiCheckCircle size={15} color="#4ecdc4" />Equipo integrado + especialistas</li>
                <li><FiCheckCircle size={15} color="#4ecdc4" />ROI visible al día siguiente</li>
                <li><FiCheckCircle size={15} color="#4ecdc4" />Escalable y ágil</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={styles["engine-cta-section"]}>
          <a
            href={HUB_URL}
            className={styles["cta-btn"]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {cta.text}
          </a>
          <p className={styles["cta-subtitle"]}>
            Acceso a tu panel de control y gestión de proyectos
          </p>
        </div>

      </div>
    </section>
  );
};

export default EngineSection;
