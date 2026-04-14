import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Recipes.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [viewingRecipe, setViewingRecipe] = useState(null);
  
const UNITS = [
    { value: '', label: 'No unit (whole items)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'l', label: 'Liters (l)' },
    { value: 'oz', label: 'Ounces (oz)' },
    { value: 'lb', label: 'Pounds (lb)' },
    { value: 'cup', label: 'Cups' },
    { value: 'tbsp', label: 'Tablespoons' },
    { value: 'tsp', label: 'Teaspoons' }
  ];
  const [ingQty, setIngQty] = useState('');
  const [ingUnit, setIngUnit] = useState('g');
  const [ingName, setIngName] = useState('');

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    maxTime: '',
    maxCost: '',
    dietaryTags: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    ingredients: [],
    prepTime: '',
    prepSteps: '',
    cost: '',
    difficulty: 'Easy',
    dietaryTags: '',
    isPublic: true
  });

  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  // Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        ...filters
      }).toString();
      const response = await axios.get(`/api/recipes?${queryParams}`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchRecipes]);

  // Handle form submission for both creating and updating recipes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...formData,
      prepSteps: formData.prepSteps.split('\n').map(s => s.trim()),
      dietaryTags: formData.dietaryTags.split(',').map(t => t.trim()),
      prepTime: parseInt(formData.prepTime),
      cost: parseFloat(formData.cost)
    };
    
    // Send PUT request to update existing recipe or POST request to create new recipe
    try {
      if (editingRecipe) {
        await axios.put(`/api/recipes/${editingRecipe.id}`, data);
        showNotification('Recipe updated successfully!', 'success');
      } else {
        // CREATE: Create new recipe
        await axios.post('/api/recipes', data);
        showNotification('Recipe created successfully!', 'success');
      }
      // Close modal and reset all states
      setShowModal(false);
      setEditingRecipe(null);
      setViewingRecipe(null);
      resetForm();
      fetchRecipes(); // Refresh the recipes list to show updated data

    } catch (error) {
      console.error('Error saving recipe:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred';
      showNotification(`Failed to ${editingRecipe ? 'update' : 'create'} recipe: ${errorMessage}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Reset the form to clear all input fields
  const resetForm = () => {
    setFormData({
      title: '',
      ingredients: [],
      prepTime: '',
      prepSteps: '',
      cost: '',
      difficulty: 'Easy',
      dietaryTags: '',
      isPublic: true
    });
    setIngQty('');
    setIngUnit('g');
    setIngName('');
  };

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Edit a recipe - populate form with existing data
  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title,
      ingredients: recipe.ingredients || [],
      prepTime: recipe.prep_time,
      prepSteps: recipe.prep_steps.join('\n'),
      cost: recipe.cost,
      difficulty: recipe.difficulty,
      dietaryTags: recipe.dietary_tags ? recipe.dietary_tags.join(', ') : '',
      isPublic: recipe.is_public ?? true
    });
    setIngQty('');
    setIngUnit('g');
    setIngName('');
    setShowModal(true); // Open the modal in edit mode
  };

  // View a recipe - display details in read-only mode
  const handleView = (recipe) => {
    setViewingRecipe(recipe);
    setShowModal(true); // Open the modal in read-only mode
  };
  
  // Delete a recipe with confirmation
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`/api/recipes/${id}`);
        showNotification('Recipe deleted successfully!', 'success');
        fetchRecipes(); // Refresh the recipes list to show updated data
      } catch (error) {
        console.error('Error deleting recipe:', error);
        showNotification('Failed to delete recipe. Please try again.', 'error');
      }
    }
  };

  const handleAddIngredient = (e) => {
    if (e) e.preventDefault();
    if (!ingQty || !ingName.trim()) return;
    const itemString = `${ingQty}${ingUnit ? ' ' + ingUnit : ''} ${ingName.trim()}`;
    setFormData({ ...formData, ingredients: [...formData.ingredients, itemString] });
    setIngQty('');
    setIngUnit('g');
    setIngName('');
  };

  const handleRemoveIngredient = (idx) => {
    const newIngs = [...formData.ingredients];
    newIngs.splice(idx, 1);
    setFormData({ ...formData, ingredients: newIngs });
  };

 return (
    <div className="recipes-page">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
        </div>
      )}
      
      <header className="recipes-header">
        <h2 className="recipes-title">Recipes</h2>
        {/* Action button for creating a new recipe */}
        <button className="btn btn-primary" onClick={() => { resetForm(); setViewingRecipe(null); setEditingRecipe(null); setShowModal(true); }}>
          + Create Recipe
        </button>
      </header>


      <section className="search-filter-section card">
        <div className="search-bar form-group">
          <input
            type="text"
            placeholder="Search by title or ingredient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters-grid">
          <div className="form-group">
            <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="number"
              name="maxTime"
              placeholder="Max Prep Time (min)"
              value={filters.maxTime}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="maxCost"
              placeholder="Max Cost ($)"
              value={filters.maxCost}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="dietaryTags"
              placeholder="Dietary Tags (vegan, gf...)"
              value={filters.dietaryTags}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </section>

{/* Display Recipes Section */}
      
      {/* Loading State - Shows while fetching recipes from the API */}
      {loading ? (
        <div className="empty-state">Loading your delicious recipes...</div>
      
      /* Success State - Shows when recipes are successfully loaded and array is not empty */
      ) : recipes.length > 0 ? (
        <div className="recipes-grid">
          {/* Map through each recipe and create a card for it with unique key */}
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card card">
              <div className="recipe-content">
                
                {/* Display tags for difficulty, privacy, and dietary restrictions */}
                <div className="recipe-tags">
                  <span className="tag">{recipe.difficulty}</span>
                  {/* Show "Private" badge only if recipe is not public */}
                  {!recipe.is_public && <span className="tag private-tag">Private</span>}
                  {recipe.dietary_tags?.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <h3>{recipe.title}</h3>
                
                {/* Quick info section: Prep time and cost with emoji icons */}
                <div className="recipe-info">
                  <span>⏱️ {recipe.prep_time} mins</span>
                  <span>💰 ${recipe.cost}</span>
                </div>
                
                {/* Action buttons for viewing and editing recipes */}
                <div className="recipe-actions">
                  <button className="btn btn-outline" onClick={() => handleView(recipe)}>View</button>
                  {recipe.user_id === currentUser.id && (
                    <>
                      <button className="btn btn-outline" onClick={() => handleEdit(recipe)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(recipe.id)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      
      /* Empty State - Shows when no recipes match the search/filter criteria */
      ) : (
        <div className="empty-state">
          <h3>No recipes found</h3>
          <p>Try adjusting your filters or create your first recipe!</p>
        </div>
      )}


  {/* Modal for Creating/Editing/Viewing Recipes */}
  {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {viewingRecipe ? 'Recipe Details' : editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}
            </h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={viewingRecipe ? viewingRecipe.title : formData.title} 
                  onChange={handleInputChange} 
                  required 
                  disabled={!!viewingRecipe}
                />
              </div>
              <div className="form-group">
                <label>Ingredients</label>
                {viewingRecipe ? (
                  <ul style={{ paddingLeft: '20px' }}>
                    {viewingRecipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
                  </ul>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={ingQty}
                        onChange={(e) => setIngQty(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddIngredient(); } }}
                        placeholder="Qty"
                        className="form-control"
                        style={{ width: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                      <select
                        value={ingUnit}
                        onChange={(e) => setIngUnit(e.target.value)}
                        className="form-control"
                        style={{ width: '120px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        {UNITS.map(u => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={ingName}
                        onChange={(e) => setIngName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddIngredient(); } }}
                        placeholder="Item name"
                        className="form-control"
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                      <button type="button" onClick={handleAddIngredient} className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>Add</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {formData.ingredients.map((ing, idx) => (
                        <span key={idx} style={{
                          background: '#e3f2fd', padding: '6px 12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1976d2', border: '1px solid #bbdefb'
                        }}>
                          {ing}
                          <button type="button" onClick={() => handleRemoveIngredient(idx)} style={{ background: 'none', border: 'none', color: '#f44336', cursor: 'pointer', fontSize: '16px', padding: 0 }} title="Remove">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Prep Time (mins)</label>
                  <input 
                    type="number" 
                    name="prepTime" 
                    value={viewingRecipe ? viewingRecipe.prep_time : formData.prepTime} 
                    onChange={handleInputChange} 
                    required 
                    disabled={!!viewingRecipe}
                  />
                </div>
                <div className="form-group">
                  <label>Cost ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="cost" 
                    value={viewingRecipe ? viewingRecipe.cost : formData.cost} 
                    onChange={handleInputChange} 
                    required 
                    disabled={!!viewingRecipe}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Preparation Steps {viewingRecipe ? '' : '(one per line)'}</label>
                <textarea 
                  name="prepSteps" 
                  value={viewingRecipe ? viewingRecipe.prep_steps.join('\n') : formData.prepSteps} 
                  onChange={handleInputChange} 
                  required 
                  rows="4" 
                  disabled={!!viewingRecipe}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Difficulty</label>
                  <select 
                    name="difficulty" 
                    value={viewingRecipe ? viewingRecipe.difficulty : formData.difficulty} 
                    onChange={handleInputChange}
                    disabled={!!viewingRecipe}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Dietary Tags {viewingRecipe ? '' : '(comma separated)'}</label>
                  <input 
                    type="text" 
                    name="dietaryTags" 
                    value={viewingRecipe ? (viewingRecipe.dietary_tags ? viewingRecipe.dietary_tags.join(', ') : '') : formData.dietaryTags} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Vegan, Gluten-Free" 
                    disabled={!!viewingRecipe}
                  />
                </div>
              </div>
              
              {!viewingRecipe && (
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="isPublic" 
                      checked={formData.isPublic} 
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })} 
                    />
                    Public Recipe (Share with others)
                  </label>
                </div>
              )}

              {/* Action buttons for closing the modal and submitting the form */}
              <div className="recipe-actions">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => { 
                    setShowModal(false); 
                    setViewingRecipe(null); 
                    setEditingRecipe(null);
                    resetForm();
                  }}
                  disabled={saving}
                >
                  {viewingRecipe ? 'Close' : 'Cancel'}
                </button>
                {!viewingRecipe && (
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : editingRecipe ? 'Update' : 'Create'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

};

export default Recipes; 