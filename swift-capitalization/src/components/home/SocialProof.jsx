import { IoMdFlame } from "react-icons/io";
import SECTOR_CONFIG from "../../config/content";
import styles from "./styles/SocialProof.module.css";
import { motion } from "framer-motion";

const SocialProof = ({ config = SECTOR_CONFIG.socialProof }) => {
  const { title, subtitle, logos, testimonials } = config;

  return (
    <section className={styles["social-proof-section"]} id="social-proof">
      <div className={styles["social-proof-container"]}>
        {/* Header */}
        <div className={styles["section-header"]}>
          <motion.h2
            className={styles["section-title"]}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {title}
          </motion.h2>
          <motion.p
            className={styles["section-subtitle"]}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>
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

        {/* Testimonials Ticker */}
        <div className={styles["testimonials-section"]}>
          <h3 className={styles["testimonials-title"]}>
            Lo que dicen nuestros clientes
          </h3>

          <div className={styles["testimonials-ticker-wrapper"]}>
            <div className={styles["testimonials-ticker-track"]}>
              {[...testimonials, ...testimonials].map((testimonial, i) => (
                <div
                  key={`${testimonial.id}-${i}`}
                  className={styles["testimonial-card"]}
                >
                  <div className={styles["card-header"]}>
                    <div className={styles["header-left"]} />
                    <div className={styles["header-right"]}>
                      <div className={styles.flames}>
                        {Array(i % 2 === 0 ? 2 : 3)
                          .fill(null)
                          .map((_, j) => (
                            <IoMdFlame key={j} />
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles["card-body"]}>
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
                        <p className={styles["author-name"]}>
                          {testimonial.author}
                        </p>
                        <p className={styles["author-role"]}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
