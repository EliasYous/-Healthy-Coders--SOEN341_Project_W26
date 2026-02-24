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


 
  

};

export default Recipes; 