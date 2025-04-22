import React, { useState } from 'react';
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
import { initialUsers } from '../../data/adminData'; // Correct import path
import '../../styles/User.css';

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [formMode, setFormMode] = useState('add'); // 'add', 'edit'
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    email: '',
    password: '',
    role: 'Technicien',
    status: 'Active'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
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
      id: null,
      username: '',
      email: '',
      password: '',
      role: 'Technicien',
      status: 'Active'
    });
    setFormMode('add');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formMode === 'add') {
      // Add new user
      const newUser = {
        ...formData,
        id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1
      };
      setUsers([...users, newUser]);
    } else {
      // Update existing user
      setUsers(users.map(user => 
        user.id === formData.id ? {...formData} : user
      ));
    }
    
    // Close form and reset
    setShowForm(false);
    resetForm();
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
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      setUsers(users.filter(user => user.id !== id));
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
        
        {/* Users Table */}
        <div className="um-table-container">
          <table className="um-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom d'utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? ( // Fixed typo: anatomie -> length
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
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
                      <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">Aucun utilisateur trouvé</td>
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
                  <label htmlFor="username">Nom d'utilisateur</label>
                  <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    value={formData.username} 
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
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Analyste des données">Analyste des données</option>
                    <option value="Technicien">Technicien</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">Statut</label>
                  <select 
                    id="status" 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactif">Inactif</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={handleCloseForm}>
                    Annuler
                  </button>
                  <button type="submit" className="submit-btn">
                    {formMode === 'add' ? 'Ajouter' : 'Mettre à jour'}
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