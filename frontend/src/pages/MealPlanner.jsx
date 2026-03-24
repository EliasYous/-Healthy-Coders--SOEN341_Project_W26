import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


  const handleSave = async (e) => { //task 53
    e.preventDefault();
    if (!selectedRecipeId) {
       setErrorMsg('Please select a recipe.');
       return;
    }

    try {
      if (selectedSlot.existingPlanId && !selectedRecipeId) {
      }
      await axios.post('/api/meal-plans', { //task 50
         recipeId: selectedRecipeId,
         dayOfWeek: selectedSlot.day,
         mealType: selectedSlot.type,
         weekStartDate: weekStartDateString
      });
      setShowModal(false);
    } catch (error) {
      console.error('Saving meal plan failed', error);
      setErrorMsg('Failed to save meal plan.');
    }
  };
