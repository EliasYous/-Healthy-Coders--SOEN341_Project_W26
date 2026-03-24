import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedRecipeId) {
       setErrorMsg('Please select a recipe.');
       return;
    }

    const isDuplicate = mealPlans.some(mp =>  //task 53
       String(mp.recipe_id) === String(selectedRecipeId) && 
       (mp.day_of_week !== selectedSlot.day || mp.meal_type !== selectedSlot.type)
    );
    if (isDuplicate) {
       setErrorMsg('This recipe is already scheduled for this week. Please choose another one to add variety!');
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
