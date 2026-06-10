import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { getPostBySlug, CATEGORY_COLORS, formatDate } from "../utils/blog";
import useInView from "../hooks/useInView";
import styles from "./styles/BlogPostPage.module.css";

const HUB_URL = import.meta.env.VITE_HUB_URL || "https://hub.swiftstudio.com";

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [articleRef, articleInView] = useInView({ threshold: 0.05 });
  const [ctaRef, ctaInView] = useInView();

  if (!post) {
    return (
      <main className={styles.notFound}>
        <h1>Artículo no encontrado</h1>
        <p>El artículo que buscas no existe o ha sido eliminado.</p>
        <Link to="/blog">Volver al blog</Link>
      </main>
    );
  }

  const color = CATEGORY_COLORS[post.category] || "#aa73fa";

  return (
    <main>
      {/* JSON-LD BlogPosting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            author: { "@type": "Organization", name: post.author },
            datePublished: post.date,
            publisher: { "@type": "Organization", name: "Swift Studio" },
            url: typeof window !== "undefined" ? window.location.href : "",
          }),
        }}
      />

      {/* Hero del artículo */}
      <section className={styles.hero}>
        <div ref={heroRef} className={styles.heroContainer}>
          <Link
            to="/blog"
            className={`${styles.backLink} ${styles.fadeIn} ${heroInView ? styles.visible : ""}`}
          >
            <FiArrowLeft size={14} /> Volver al blog
          </Link>
          <span
            className={`${styles.heroCategory} ${styles.fadeIn} ${styles.delay1} ${heroInView ? styles.visible : ""}`}
            style={{ color }}
          >
            {post.category}
          </span>
          <h1
            className={`${styles.heroTitle} ${styles.fadeIn} ${styles.delay2} ${heroInView ? styles.visible : ""}`}
          >
            {post.title}
          </h1>
          <div
            className={`${styles.heroMeta} ${styles.fadeIn} ${styles.delay3} ${heroInView ? styles.visible : ""}`}
          >
            <span>{post.author}</span>
            <span className={styles.heroMetaDot} />
            <span>{formatDate(post.date)}</span>
            <span className={styles.heroMetaDot} />
            <span>{post.readTime} min de lectura</span>
          </div>
        </div>
      </section>

      {/* Cuerpo del artículo */}
      <section className={styles.articleSection}>
        <div ref={articleRef} className={styles.articleContainer}>
          <div
            className={`${styles.articleBody} ${styles.fadeIn} ${articleInView ? styles.visible : ""}`}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div ref={ctaRef} className={styles.ctaContainer}>
          <div
            className={`${styles.ctaBox} ${styles.fadeIn} ${ctaInView ? styles.visible : ""}`}
          >
            <h2 className={styles.ctaHeadline}>
              ¿Quieres aplicar esto en tu negocio?
            </h2>
            <p className={styles.ctaSubheadline}>
              Cuéntanos dónde estás y te decimos cómo podemos ayudarte a llegar
              donde quieres.
            </p>
            <a
              href={HUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              Empezar ahora
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPostPage;
