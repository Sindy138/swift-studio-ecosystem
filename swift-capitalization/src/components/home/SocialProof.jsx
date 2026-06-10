import { useState } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/SocialProof.module.css";

const VISIBLE_COUNT = 3;

const SocialProof = ({ config = SECTOR_CONFIG.socialProof }) => {
  const { title, subtitle, logos, testimonials } = config;
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalPositions = Math.max(1, testimonials.length - VISIBLE_COUNT + 1);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPositions);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPositions) % totalPositions);
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + VISIBLE_COUNT,
  );

  return (
    <section className={styles["social-proof-section"]} id="social-proof">
      <div className={styles["social-proof-container"]}>
        {/* Header */}
        <div className={styles["section-header"]}>
          <h2 className={styles["section-title"]}>{title}</h2>
          <p className={styles["section-subtitle"]}>{subtitle}</p>
        </div>

        {/* Logos Infinite Ticker */}
        <div className={styles["logos-section"]}>
          <div className={styles["ticker-wrapper"]}>
            <div className={styles["ticker-track"]}>
              {[...logos, ...logos].map((logo, i) => (
                <div key={`${logo.id}-${i}`} className={styles["logo-item"]}>
                  <img src={logo.image} alt={logo.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className={styles["testimonials-section"]}>
          <h3 className={styles["testimonials-title"]}>
            Lo que dicen nuestros clientes
          </h3>

          <div className={styles["testimonial-carousel"]}>
            <div className={styles["testimonials-grid"]}>
              {visibleTestimonials.map((testimonial) => (
                <div key={testimonial.id} className={styles["testimonial-card"]}>
                  <div className={styles.stars}>
                    {Array(testimonial.rating).fill(null).map((_, i) => (
                      <FaStar key={i} color="#ffe66d" />
                    ))}
                  </div>
                  <blockquote className={styles["testimonial-quote"]}>
                    "{testimonial.quote}"
                  </blockquote>
                  <div className={styles["testimonial-author"]}>
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className={styles["author-avatar"]}
                    />
                    <div className={styles["author-info"]}>
                      <p className={styles["author-name"]}>{testimonial.author}</p>
                      <p className={styles["author-role"]}>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className={styles["carousel-controls"]}>
            <button
              className={styles["carousel-btn"]}
              onClick={prevTestimonial}
              aria-label="Testimonial anterior"
            >
              <FaChevronLeft size={13} />
            </button>
            <button
              className={styles["carousel-btn"]}
              onClick={nextTestimonial}
              aria-label="Siguiente testimonial"
            >
              <FaChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
