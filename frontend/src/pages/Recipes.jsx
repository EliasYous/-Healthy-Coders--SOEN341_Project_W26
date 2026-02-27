import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Recipes.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null); //for editing/viewing
  const [viewingRecipe, setViewingRecipe] = useState(null);
  
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
    ingredients: '',
    prepTime: '',
    prepSteps: '',
    cost: '',
    difficulty: 'Easy',
    dietaryTags: '',
    isPublic: true
  });

  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

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

 const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      ingredients: formData.ingredients.split(',').map(i => i.trim()),
      prepSteps: formData.prepSteps.split('\n').map(s => s.trim()),
      dietaryTags: formData.dietaryTags.split(',').map(t => t.trim()),
      prepTime: parseInt(formData.prepTime),
      cost: parseFloat(formData.cost)
    };
    
    try {
      await axios.post('/api/recipes', data); //can put if else axios.put if editing recipe
      setShowModal(false);
      fetchRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      ingredients: '',
      prepTime: '',
      prepSteps: '',
      cost: '',
      difficulty: 'Easy',
      dietaryTags: '',
      isPublic: true
    });
  };

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };


 return (
    <div className="recipes-page">
      <header className="recipes-header">
        <h2 className="recipes-title">Recipes</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setEditingRecipe(null); setShowModal(true); }}>
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
                <label>Ingredients {viewingRecipe ? '' : '(comma separated)'}</label>
                <textarea 
                  name="ingredients" 
                  value={viewingRecipe ? viewingRecipe.ingredients.join(', ') : formData.ingredients} 
                  onChange={handleInputChange} 
                  required 
                  disabled={!!viewingRecipe}
                />
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

              <div className="recipe-actions">
                <button type="button" className="btn btn-outline" onClick={() => { setShowModal(false); setViewingRecipe(null); }}>
                  {viewingRecipe ? 'Close' : 'Cancel'}
                </button>
                {!viewingRecipe && (
                  <button type="submit" className="btn btn-primary">
                    {editingRecipe ? 'Update' : 'Create'}
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