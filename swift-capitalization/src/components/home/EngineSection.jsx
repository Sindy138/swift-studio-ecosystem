import { FiMonitor, FiGitMerge, FiBarChart2, FiUsers } from "react-icons/fi";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/EngineSection.module.css";

const ICON_MAP = {
  Monitor: FiMonitor,
  GitMerge: FiGitMerge,
  BarChart2: FiBarChart2,
  Users: FiUsers,
};

const CTA_ORBS = [
  { size: 180, left: "3%",  top: "-30%", dur: "18s", del: "0s",   op: 0.55 },
  { size: 110, left: "83%", top: "5%",   dur: "22s", del: "-6s",  op: 0.45 },
  { size: 260, left: "58%", top: "35%",  dur: "28s", del: "-11s", op: 0.3  },
  { size: 90,  left: "14%", top: "52%",  dur: "20s", del: "-4s",  op: 0.5  },
  { size: 200, left: "38%", top: "-25%", dur: "25s", del: "-15s", op: 0.25 },
];

const EngineSection = ({ config = SECTOR_CONFIG.engine }) => {
  const { title, description, leftCol, advantages, cta, ctaBanner } = config;

  return (
    <section className={styles["engine-section"]} id="engine">
      <div className={styles["engine-container"]}>
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>{title}</h2>
          <p className={styles["section-description"]}>{description}</p>
        </div>

        <hr className={styles.divider} />

        <div className={styles["engine-body"]}>
          <div className={styles["left-col"]}>
            <h3 className={styles["left-heading"]}>{leftCol.heading}</h3>
            <p className={styles["left-body"]}>{leftCol.body}</p>
            <a href={cta.link} className={styles["cta-btn"]}>
              {cta.text} →
            </a>
          </div>

          <div className={styles["right-col"]}>
            {advantages.map((advantage) => {
              const Icon = ICON_MAP[advantage.iconName];
              return (
                <div key={advantage.id} className={styles["pill-card"]}>
                  {Icon && (
                    <div
                      className={styles["pill-icon"]}
                      style={{
                        background: advantage.iconBg,
                        color: advantage.iconColor,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                  )}
                  <div className={styles["pill-text"]}>
                    <strong className={styles["pill-title"]}>
                      {advantage.title}
                    </strong>
                    <p className={styles["pill-description"]}>
                      {advantage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className={styles["cta-banner"]}>
        {CTA_ORBS.map((orb, i) => (
          <div
            key={i}
            className={styles["cta-orb"]}
            style={{
              width: orb.size + "px",
              height: orb.size + "px",
              left: orb.left,
              top: orb.top,
              opacity: orb.op,
              animationDuration: orb.dur,
              animationDelay: orb.del,
            }}
          />
        ))}
        <div className={styles["cta-banner-content"]}>
          <h3 className={styles["cta-banner-headline"]}>{ctaBanner.headline}</h3>
          <p className={styles["cta-banner-subtext"]}>{ctaBanner.subtext}</p>
          <a href={ctaBanner.buttonLink} className={styles["cta-banner-btn"]}>
            {ctaBanner.button}
          </a>
        </div>
      </div>
    </section>
  );
};

export default EngineSection;
