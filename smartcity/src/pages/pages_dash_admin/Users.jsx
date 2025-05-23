import React, { useState, useEffect } from 'react';
import Layout from '../../components/components_dash_admin/Layout/Layout';
import Header from '../../components/components_dash_admin/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faSearch, 
  faEdit, 
  faTrash, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../../styles/User.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'technicien',
    status: 'active'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        setError('Vous devez être connecté pour accéder à cette page');
        return;
      }

      const response = await axios.get('http://localhost:5050/api/users', {
        headers: { 
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setUsers(response.data);
      } else {
        setError('Aucun utilisateur trouvé');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response) {
        setError(err.response.data.message || 'Erreur lors du chargement des utilisateurs');
      } else if (err.request) {
        setError('Impossible de se connecter au serveur');
      } else {
        setError('Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'technicien',
      status: 'active'
    });
    setFormMode('add');
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        setError('Vous devez être connecté pour effectuer cette action');
        return;
      }

      const headers = { 
        'Authorization': `Bearer ${userInfo.token}`,
        'Content-Type': 'application/json'
      };

      if (formMode === 'add') {
        await axios.post('http://localhost:5050/api/users/add', formData, { headers });
      } else {
        await axios.put(`http://localhost:5050/api/users/${formData._id}`, formData, { headers });
      }

      await fetchUsers();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error submitting form:', err);
      if (err.response) {
        setError(err.response.data.message || 'Une erreur est survenue');
      } else if (err.request) {
        setError('Impossible de se connecter au serveur');
      } else {
        setError('Une erreur est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setFormData({
      ...user,
      password: '' // Clear password for security
    });
    setFormMode('edit');
    setShowForm(true);
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          setError('Vous devez être connecté pour effectuer cette action');
          return;
        }

        await axios.delete(`http://localhost:5050/api/users/${id}`, {
          headers: { 
            'Authorization': `Bearer ${userInfo.token}`,
            'Content-Type': 'application/json'
          }
        });
        await fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        if (err.response) {
          setError(err.response.data.message || 'Erreur lors de la suppression');
        } else if (err.request) {
          setError('Impossible de se connecter au serveur');
        } else {
          setError('Une erreur est survenue');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Add new user button click
  const handleAddNew = () => {
    resetForm();
    setFormMode('add');
    setShowForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <Layout>
      <Header title="Users" subtitle="Bienvenue, Chayma ! Voici les informations d'aujourd'hui" />
      <div className="user-management">
        <div className="um-header">
          <h1>Gestion des Utilisateurs</h1>
          <p>Définir les utilisateurs des systèmes urbains</p>
        </div>
        
        <div className="um-actions">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <button className="add-button" onClick={handleAddNew}>
            <FontAwesomeIcon icon={faPlus} /> Ajouter un utilisateur
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        {/* Users Table */}
        <div className="um-table-container">
          <table className="um-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="loading">Chargement...</td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="edit-btn" onClick={() => handleEdit(user)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-results">Aucun utilisateur trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* User Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{formMode === 'add' ? 'Ajouter un utilisateur' : 'Modifier un utilisateur'}</h2>
                <button className="close-btn" onClick={handleCloseForm}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nom d'utilisateur</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
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
                  <label htmlFor="password">
                    Mot de passe {formMode === 'edit' && '(laisser vide pour ne pas changer)'}
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange}
                    required={formMode === 'add'}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="role">Rôle</label>
                  <select 
                    id="role" 
                    name="role" 
                    value={formData.role} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="administrator">Administrateur</option>
                    <option value="analyst">Analyste des données</option>
                    <option value="technicien">Technicien</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">Statut</label>
                  <select 
                    id="status" 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={handleCloseForm}>
                    Annuler
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Chargement...' : (formMode === 'add' ? 'Ajouter' : 'Mettre à jour')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;