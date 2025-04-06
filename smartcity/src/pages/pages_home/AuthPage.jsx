import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/components_home/Navbar';
import Footer from '../../components/components_home/Footer';
import './AuthPage.css';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('signup') === 'true');
  const [isResetPassword, setIsResetPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'user'
  });
  useEffect(() => {
    if( formData==='')
      return;
    console.log('function component did update')
    
  })
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'authentification à implémenter
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h2>{isResetPassword ? 'Réinitialiser le mot de passe' : (isSignUp ? 'Créer un compte' : 'Se connecter')}</h2>
            {!isResetPassword && (
              <p>
                {isSignUp 
                  ? 'Déjà un compte ?' 
                  : 'Pas encore de compte ?'}
                <button 
                  className="text-button" 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setIsResetPassword(false);
                  }}
                >
                  {isSignUp ? 'Se connecter' : 'S\'inscrire'}
                </button>
              </p>
            )}
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isResetPassword ? (
              <>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {isSignUp && (
                  <div className="form-group">
                    <label htmlFor="name">Nom complet</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                
                {isSignUp && (
                  <>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}
            
            <button type="submit" className="btn btn-primary btn-block">
              {isResetPassword 
                ? 'Envoyer les instructions' 
                : (isSignUp ? 'Créer un compte' : 'Se connecter')}
            </button>
          </form>

          {!isSignUp && !isResetPassword && (
            <div className="auth-footer">
              <button 
                className="text-button" 
                onClick={() => {
                  setIsResetPassword(true);
                  setIsSignUp(false);
                }}
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          {isResetPassword && (
            <div className="auth-footer">
              <button 
                className="text-button" 
                onClick={() => {
                  setIsResetPassword(false);
                  setIsSignUp(false);
                }}
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default AuthPage;