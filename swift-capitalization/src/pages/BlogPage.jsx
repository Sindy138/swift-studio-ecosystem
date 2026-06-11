import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { getAllPosts, CATEGORIES, CATEGORY_COLORS, formatDate } from "../utils/blog";
import useInView from "../hooks/useInView";
import SEO from "../components/SEO";
import styles from "./styles/BlogPage.module.css";

const posts = getAllPosts();

const BlogCard = ({ post, index, inView }) => {
  const color = CATEGORY_COLORS[post.category] || "#aa73fa";
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`${styles.card} ${styles.fadeIn} ${styles[`delay${(index % 3) + 1}`]} ${inView ? styles.visible : ""}`}
    >
      <div className={styles.cardBody}>
        <span className={styles.cardCategory} style={{ color }}>
          {post.category}
        </span>
        <h2 className={styles.cardTitle}>{post.title}</h2>
        <p className={styles.cardExcerpt}>{post.excerpt}</p>
        <div className={styles.cardMeta}>
          <span>{formatDate(post.date)}</span>
          <span className={styles.cardMetaDot} />
          <span>{post.readTime} min de lectura</span>
        </div>
        <span className={styles.cardCta}>
          Leer artículo <FiArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [cardsRef, cardsInView] = useInView({ threshold: 0.05 });

  const filtered =
    activeCategory === "Todos"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <main>
      <SEO
        title="Blog de Marketing Digital — Estrategia, Visual y Automatización"
        description="Artículos sobre SEO, marketing de contenidos, fotografía profesional y automatización n8n para empresas. Recursos prácticos del equipo de Swift Studio."
        canonical="/blog"
      />
      {/* Hero */}
      <section className={styles.hero}>
        <div ref={heroRef} className={styles.heroContainer}>
          <span
            className={`${styles.heroLabel} ${styles.fadeIn} ${heroInView ? styles.visible : ""}`}
          >
            Blog
          </span>
          <h1
            className={`${styles.heroHeadline} ${styles.fadeIn} ${styles.delay1} ${heroInView ? styles.visible : ""}`}
          >
            Estrategia, visual y automatización
          </h1>
          <p
            className={`${styles.heroSubheadline} ${styles.fadeIn} ${styles.delay2} ${heroInView ? styles.visible : ""}`}
          >
            Artículos prácticos sobre SEO, fotografía de marca y automatización
            de marketing. Sin relleno, con ejemplos reales.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <nav className={styles.filtersSection} aria-label="Filtrar por categoría">
        <div className={styles.filtersContainer}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Cards */}
      <section className={styles.cardsSection}>
        <div ref={cardsRef} className={styles.cardsContainer}>
          <div className={styles.cardsGrid}>
            {filtered.length > 0 ? (
              filtered.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} inView={cardsInView} />
              ))
            ) : (
              <p className={styles.emptyState}>
                No hay artículos en esta categoría todavía.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
