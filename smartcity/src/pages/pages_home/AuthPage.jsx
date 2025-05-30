import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/components_home/Navbar';
import Footer from '../../components/components_home/Footer';
import './AuthPage.css';
import axios from 'axios';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(searchParams.get('signup') === 'true');
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('administrator');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'name') {
      setName(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else if (name === 'role') {
      setRole(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }

        const response = await axios.post('http://localhost:5050/api/users/register', {
          name,
          email,
          password,
          role
        });

        if (response.data.token) {
          localStorage.setItem('userInfo', JSON.stringify(response.data));
          redirectBasedOnRole(response.data.role);
        }
      } else {
        const response = await axios.post('http://localhost:5050/api/users/signin', {
          email,
          password
        });

        if (response.data.token) {
          localStorage.setItem('userInfo', JSON.stringify(response.data));
          redirectBasedOnRole(response.data.role);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'administrator':
        navigate('/da');
        break;
      case 'analyst':
        navigate('/dl');
        break;
      case 'technicien':
        navigate('/technicien');
        break;
      default:
        navigate('/');
    }
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
                {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
                <button
                  className="text-button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setIsResetPassword(false);
                  }}
                >
                  {isSignUp ? 'Se connecter' : "S'inscrire"}
                </button>
              </p>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isResetPassword ? (
              <>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {isSignUp && (
                  <>
                    <div className="form-group">
                      <label htmlFor="name">Nom complet</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="role">Rôle</label>
                      <select
                        id="role"
                        name="role"
                        value={role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="administrator">Administrateur</option>
                        <option value="analyst">Analyste</option>
                        <option value="technicien">Technicien</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
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
                    value={password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {isSignUp && (
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
              </>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {isResetPassword
                ? 'Envoyer les instructions'
                : isSignUp
                ? 'Créer un compte'
                : 'Se connecter'}
            </button>
          </form>

          {/* {!isSignUp && !isResetPassword && (
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
          )} */}

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
      <Footer />
    </>
  );
};

export default AuthPage;