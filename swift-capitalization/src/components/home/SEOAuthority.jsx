import { useState, useEffect, useRef } from "react";
import {
  LuSearch,
  LuShare2,
  LuCamera,
  LuFileText,
  LuWorkflow,
} from "react-icons/lu";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/SEOAuthority.module.css";

const ICON_MAP = {
  seo: LuSearch,
  social: LuShare2,
  fotografia: LuCamera,
  blogs: LuFileText,
  automatizacion: LuWorkflow,
};

const ORBS = [
  { w: 3, l: "8%", t: "20%", dur: "17s", del: "-2s", op: 0.55 },
  { w: 2, l: "18%", t: "78%", dur: "21s", del: "-5s", op: 0.35 },
  { w: 4, l: "29%", t: "11%", dur: "19s", del: "-8s", op: 0.55 },
  { w: 2, l: "43%", t: "86%", dur: "24s", del: "-10s", op: 0.35 },
  { w: 3, l: "62%", t: "19%", dur: "22s", del: "-3s", op: 0.55 },
  { w: 5, l: "76%", t: "73%", dur: "27s", del: "-11s", op: 0.42 },
  { w: 2, l: "88%", t: "28%", dur: "20s", del: "-6s", op: 0.55 },
  { w: 3, l: "92%", t: "86%", dur: "28s", del: "-14s", op: 0.28 },
  { w: 2, l: "10%", t: "48%", dur: "23s", del: "-8s", op: 0.38 },
  { w: 4, l: "54%", t: "7%", dur: "18s", del: "-1s", op: 0.55 },
];

const SEOAuthority = ({ config = SECTOR_CONFIG.services }) => {
  const { title, subtitle, serviceCards } = config;
  const [isActive, setIsActive] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isActive &&
        stageRef.current &&
        !stageRef.current.contains(e.target)
      ) {
        setIsActive(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isActive]);

  return (
    <section className={styles["seo-section"]} id="seo-authority">
      <div className={styles.grain} />

      {ORBS.map((orb, i) => (
        <div
          key={i}
          className={styles.orb}
          style={{
            width: orb.w + "px",
            height: orb.w + "px",
            left: orb.l,
            top: orb.t,
            animationDuration: orb.dur,
            animationDelay: orb.del,
            opacity: orb.op,
          }}
        />
      ))}

      <div className={styles["content-shell"]}>
        {/* Topline */}
        <header className={styles.topline}>
          <div className={styles["brand-block"]}>
            <p className={styles.kicker}>{title}</p>
            <h2 className={styles.title}>{subtitle}</h2>
          </div>
          <div className={styles["corner-mark"]} aria-hidden="true">
            <span className={styles["corner-dot"]} />
            Swift Studio · 2025
          </div>
        </header>

        {/* Authority Stage */}
        <section
          ref={stageRef}
          className={`${styles["authority-stage"]} ${isActive ? styles["is-active"] : ""}`}
          aria-label="Servicios SEO Authority"
        >
          <div className={`${styles["orbital-ring"]} ${styles["ring-one"]}`} />
          <div className={`${styles["orbital-ring"]} ${styles["ring-two"]}`} />
          <div
            className={`${styles["orbital-ring"]} ${styles["ring-three"]}`}
          />
          <span className={`${styles["orbit-node"]} ${styles["node-a"]}`} />
          <span className={`${styles["orbit-node"]} ${styles["node-b"]}`} />
          <span className={`${styles["orbit-node"]} ${styles["node-c"]}`} />

          {serviceCards.map((service, i) => {
            const Icon = ICON_MAP[service.id];
            return (
              <article
                key={service.id}
                className={`${styles.service} ${styles[`service-${i + 1}`]}`}
              >
                <div className={styles["service-inner"]}>
                  <span className={styles["service-icon"]}>
                    {Icon && <Icon size={15} strokeWidth={1.8} />}
                  </span>
                  <p className={styles["service-title"]}>{service.name}</p>
                </div>
                <div className={styles["service-line"]} />
                <div className={styles["service-submenu"]}>
                  {service.features.map((feature, j) => (
                    <div key={j} className={styles["submenu-item"]}>
                      {feature}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}

          <button
            className={styles["core-wrap"]}
            type="button"
            aria-label="Mostrar servicios"
            onClick={() => setIsActive((prev) => !prev)}
          >
            <div className={styles.glow} />
            <div className={styles["icon-shell"]}>
              <img
                src="/seo/icon-seo.png"
                alt="Swift Studio Core"
                className={styles["authority-icon"]}
                loading="lazy"
              />
            </div>
          </button>
        </section>

        {/* Bottomline */}
        <footer className={styles.bottomline}>
          <p className={styles.hint}>
            Toca el núcleo para explorar los servicios
          </p>
        </footer>
      </div>
    </section>
  );
};

export default SEOAuthority;
