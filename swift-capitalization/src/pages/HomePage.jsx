import Home from "../components/home/Home";
import SEO from "../components/SEO";

const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Swift Studio",
  description: "Agencia digital que combina marketing, fotografía y automatización avanzada con n8n.",
  url: "https://swiftstudio.com",
  email: "contact@swiftstudio.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "ES",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "150",
  },
};

const HomePage = () => (
  <>
    <SEO
      title="Agencia de Marketing Digital & Automatización"
      description="Swift Studio — Agencia digital que combina SEO, Social Media, Fotografía y Automatización avanzada con n8n. Resultados medibles para empresas que quieren crecer."
      canonical="/"
      jsonLd={LOCAL_BUSINESS_LD}
    />
    <Home />
  </>
);

export default HomePage;
