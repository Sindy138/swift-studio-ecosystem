import React, { useState, useEffect } from "react";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/ServiceGrid.module.css";

/**
 * SERVICE GRID - The Core (5 Pilares)
 * Grid de servicios con tarjetas interactivas y animadas
 * Estructura unificada: Cada tarjeta procesa sus propios textos rotativos
 */
const ServiceGrid = ({ config = SECTOR_CONFIG.services }) => {
  const { title, subtitle, description, serviceCards } = config;

  // Estados para controlar de forma síncrona el índice del texto rotativo y el fade
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fade, setFade] = useState(true);

  // Efecto para la rotación global de los textos en todas las tarjetas
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        // Rotación cíclica basada en un estándar de 4 elementos
        setCurrentIdx((prevIdx) => (prevIdx + 1) % 4);
        setFade(true);
      }, 300); // Duración del fade-out en milisegundos
    }, 3000); // Cambio de texto cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles["services-section"]} id="services">
      <div className={styles["services-container"]}>
        {/* Header */}
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>{title}</h2>
          <p className={styles["section-subtitle"]}>{subtitle}</p>
          <p className={styles["section-description"]}>{description}</p>
        </div>

        {/* Services Grid */}
        <div className={styles["services-grid"]}>
          {serviceCards.map((service) => {
            // Usamos las 'features' de tu content.js como la lista de textos que van a rotar
            const rotatingTexts =
              service.features && service.features.length > 0
                ? service.features
                : ["Optimización", "Eficiencia", "Resultados"];

            // Evitamos desbordamientos de índice si alguna tarjeta tiene menos características
            const textToShow = rotatingTexts[currentIdx % rotatingTexts.length];

            return (
              <div key={service.id} className={styles["service-card"]}>
                {/* Cabecera superior de la tarjeta principal */}
                <h4 className={styles["card-main-title"]}>{service.name}</h4>
                <p className={styles["card-main-desc"]}>
                  {service.shortDescription}
                </p>

                {/* SUB-CARD INTERNA: Contenedor con borde animado interactivo */}
                <div className={styles["card-wrapper"]}>
                  <div className={styles["card-inner"]}>
                    <div className={styles["card-sub-header"]}>
                      <span className={styles["memory-label"]}>
                        Core Vitals OK
                      </span>
                      <span className={styles["sparkle-icon"]}>✦</span>
                    </div>

                    <p className={styles["pref-label"]}>USER PREFERENCE:</p>

                    <div className={styles["rotating-text-container"]}>
                      <p
                        className={styles["rotating-text"]}
                        style={{
                          opacity: fade ? 1 : 0,
                          transition: "opacity 0.3s ease-in-out",
                        }}
                      >
                        {textToShow}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botón de acción o enlace inferior de la tarjeta */}
                <a href={service.link} className={styles["service-cta"]}>
                  {service.ctaText}
                  <span className={styles.arrow}>→</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Secondary CTA */}
        <div className={styles["services-cta-section"]}>
          <h3>¿Quieres conocer todos los detalles?</h3>
          <a
            href="/servicios"
            className={`${styles.btn} ${styles["btn-secondary"]}`}
          >
            Explorar Todos los Servicios
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
