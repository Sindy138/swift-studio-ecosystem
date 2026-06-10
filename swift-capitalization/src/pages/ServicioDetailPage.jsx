import { useParams } from "react-router-dom";

const ServicioDetailPage = () => {
  const { slug } = useParams();
  return (
    <main style={{ padding: "8rem 2rem", textAlign: "center" }}>
      <h1>Servicio: {slug}</h1>
      <p>Página en construcción — Fase 5</p>
    </main>
  );
};

export default ServicioDetailPage;
