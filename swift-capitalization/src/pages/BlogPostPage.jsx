import { useParams } from "react-router-dom";

const BlogPostPage = () => {
  const { slug } = useParams();
  return (
    <main style={{ padding: "8rem 2rem", textAlign: "center" }}>
      <h1>Post: {slug}</h1>
      <p>Página en construcción — Fase 6</p>
    </main>
  );
};

export default BlogPostPage;
