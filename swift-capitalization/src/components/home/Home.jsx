import React from "react";
import HeroSection from "./HeroSection";
import SocialProof from "./SocialProof";
import ServiceGrid from "./ServiceGrid";
import EngineSection from "./EngineSection";
import SEOAuthority from "./SEOAuthority";
import SECTOR_CONFIG from "../../config/content";
import "./styles/Home.css";

const Home = () => {
  return (
    <main className="home-page" itemScope itemType="https://schema.org/WebPage">
      <meta
        itemProp="description"
        content={SECTOR_CONFIG.hero.valueProp.headline}
      />

      {/* 1. Hero Section - Propuesta de Valor + CTA */}
      <HeroSection config={SECTOR_CONFIG.hero} />

      {/* 2. Social Proof - Logos + Testimonios */}
      <SocialProof config={SECTOR_CONFIG.socialProof} />

      {/* 3. SEO Authority - Autoridad + Structured Data */}
      <SEOAuthority config={SECTOR_CONFIG.services} />

      {/* 4. Engine Section - Diferenciación Tecnológica */}
      <EngineSection config={SECTOR_CONFIG.engine} />
    </main>
  );
};

export default Home;
