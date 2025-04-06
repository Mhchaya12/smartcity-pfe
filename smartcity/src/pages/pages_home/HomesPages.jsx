import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/components_home/Navbar';
import Footer from '../../components/components_home/Footer';
import './HomePage.css';

const HomePage = () => {
  return (
    <>
    <Navbar/>
      <div className="home-page">
        <section className="hero">
          <div className="hero-content">
            <h1>Bienvenue sur Smart City</h1>
            <p>La solution complète pour administrateurs, analystes et techniciens.</p>
            <div className="hero-buttons">
              <Link to="/auth?signup=true" className="btn btn-primary btn-lg">
                Commencer Maintenant
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/smart-city_7438283 (2).png" alt="" />
          </div> 
        </section>

        <section className="features">
          <h2>Nos fonctionnalités principales</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/icons/product-manager_13271224 (1).png" alt="Administration" />
              </div>
              <h3>Pour les administrateurs</h3>
              <p>Gestion complète des utilisateurs, tableaux de bord et permissions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/icons/data-analysis_2979962.png" alt="Analyse" />
              </div>
              <h3>Pour les analystes</h3>
              <p>Outils d'analyse avancés, visualisations de données et génération de rapports.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/icons/support_3323044.png" alt="Technicien" />
              </div>
              <h3>Pour les techniciens</h3>
              <p>Gestion des capteurs, suivi des interventions technique.</p>
            </div>
          </div>
        </section>

        <section className="testimonials">
          <h2>Ils nous font confiance</h2>
          <div className="testimonials-slider">
            <div className="testimonial-card">
              <p className="testimonial-text">"Cette plateforme a révolutionné notre façon de travailler. Gain de temps et d'efficacité considérable."</p>
              <div className="testimonial-author">
                <img src="/images/icicode.png" alt="Portrait de client" />
                <div>
                  <h4>Chayma Mhalhli</h4>
                  <p>Directrice IT, Entreprise IciCode</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Prêt à améliorer votre gestion ?</h2>
          <p>Rejoignez des milliers d'utilisateurs satisfaits.</p>
          <Link to="/auth?signup=true" className="btn btn-primary btn-lg">
            S'inscrire 
          </Link>
        </section>
      </div>
      <Footer/>
    </>
  );
};

export default HomePage;