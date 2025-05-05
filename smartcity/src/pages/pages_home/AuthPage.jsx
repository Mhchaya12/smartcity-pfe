import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/components_home/Navbar';
import Footer from '../../components/components_home/Footer';
import { signin, register } from '../../actions/userActions';
import './AuthPage.css';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;

  const [isSignUp, setIsSignUp] = useState(searchParams.get('signup') === 'true');
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('administrator');

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

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
    if (isSignUp) {
      if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }
      dispatch(register(name, email, password, role));
    } else {
      dispatch(signin(email, password));
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
          {loading && <div className="loading-message">Chargement...</div>}

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
      <Footer />
    </>
  );
};

export default AuthPage;