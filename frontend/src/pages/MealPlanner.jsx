import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './MealPlanner.css';

// constants for the meal planner
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

// meal planner component
const MealPlanner = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const getTopOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0,0,0,0);
    return monday;
  };
  
  const [currentWeekTop, setCurrentWeekTop] = useState(() => getTopOfWeek(new Date()));
  const weekStartDateString = currentWeekTop.toISOString().split('T')[0]; // format the date as YYYY-MM-DD

  // navigation functions

  const previousWeek = () => {
    const prev = new Date(currentWeekTop);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekTop(prev);
  }

  const nextWeek = () => {
    const next = new Date(currentWeekTop);
    next.setDate(next.getDate() + 7);
    setCurrentWeekTop(next);
  }


  const fetchMealPlans = useCallback(async () => { //task 51
    try {
      setLoading(true);
      const res = await axios.get(`/api/meal-plans?weekStartDate=${weekStartDateString}`);
      setMealPlans(res.data);
    } catch (error) {
      console.error('Failed to fetch meal plans', error);
    } finally {
      setLoading(false);
    }
  }, [weekStartDateString]);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`/api/recipes`);
      setRecipes(res.data);
    } catch (error) {
      console.error('Failed to fetch recipes', error);
    }
  };

  useEffect(() => {
    fetchMealPlans();
    fetchRecipes();
  }, [fetchMealPlans]);


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
      fetchMealPlans();
    } catch (error) {
      console.error('Saving meal plan failed', error);
      setErrorMsg('Failed to save meal plan.');
    }
  };


  const handleRemove = async () => {
    if (!selectedSlot.existingPlanId) return;
     try {
       await axios.delete(`/api/meal-plans/${selectedSlot.existingPlanId}`);
       setShowModal(false);
       fetchMealPlans();
     } catch (err) {
       console.error(err);
       setErrorMsg('Failed to delete meal plan');
     }
  };

  // Get each cell content
  const getCellContent = (day, type) => {
    const plan = mealPlans.find(mp => mp.day_of_week === day && mp.meal_type === type);
    if (plan) {
      return (
         <div className="meal-cell filled">
            <span className="recipe-title">{plan.recipe_title}</span>
         </div>
      );
    }
    return <div className="meal-cell empty"><span className="add-icon">+</span></div>;
  };

  // Render the meal planner
  return (
    <div className="meal-planner-page">
      <header className="planner-header">
         <h2>Weekly Meal Planner</h2>
         <div className="week-controls">
            <button className="btn btn-secondary" onClick={previousWeek}>&lt; Prev</button>
            <span className="week-label">Week of {weekStartDateString}</span>
            <button className="btn btn-secondary" onClick={nextWeek}>Next &gt;</button>
         </div>
      </header>
      
      {loading ? (
        <div className="empty-state">Loading your meal plan...</div>
      ) : (
        <div className="planner-grid">
           <table>
             <thead>
               <tr>
                 <th>Meal</th>
                 {DAYS.map(day => <th key={day}>{day}</th>)}
               </tr>
             </thead>
             <tbody>
               {MEAL_TYPES.map(type => (
                 <tr key={type}>
                   <td className="meal-type-label">{type}</td>
                   {DAYS.map(day => (
                     <td key={`${day}-${type}`}>
                       {getCellContent(day, type)}
                     </td>
                   ))}
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}

    </div>
  );
};
export default MealPlanner;
