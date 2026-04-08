import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './MealPlanner.css';

// for dipi
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const MealPlanner = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const getTopOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0,0,0,0);
    return monday;
  };
  
  const [currentWeekTop, setCurrentWeekTop] = useState(() => getTopOfWeek(new Date()));
  const weekStartDateString = currentWeekTop.toISOString().split('T')[0];
  //

  // for brian
  const fetchMealPlans = useCallback(async () => {
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
  //

// for dipi
  const [showModal, setShowModal] = useState(false);
  const [showGroceryModal, setShowGroceryModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleCellClick = (day, type) => {
    const existing = mealPlans.find(mp => mp.day_of_week === day && mp.meal_type === type);
    setSelectedSlot({ day, type, existingPlanId: existing ? existing.id : null });
    setSelectedRecipeId(existing ? existing.recipe_id : '');
    setErrorMsg('');
    setShowModal(true);
  };
  //

  // for brian
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedRecipeId) {
       setErrorMsg('Please select a recipe.');
       return;
    }

    const isDuplicate = mealPlans.some(mp => 
       String(mp.recipe_id) === String(selectedRecipeId) && 
       (mp.day_of_week !== selectedSlot.day || mp.meal_type !== selectedSlot.type)
    );
    if (isDuplicate) {
       setErrorMsg('This recipe is already scheduled for this week. Please choose another one to add variety!');
       return;
    }

    try {
      if (selectedSlot.existingPlanId && !selectedRecipeId) {
        // user could potentially clear? handled by remove.
      }
      await axios.post('/api/meal-plans', {
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

  //

  // for elias
  const getGroceryList = () => {
    const ingredientMap = new Map();

    const processIngredient = (ing, isPantry = false) => {
      const str = ing.trim();
      const regex = /^([\d\.]+)\s*(g|kg|mg|lb|lbs|oz|ml|l|cup|cups|tbsp|tsp|gram|grams|kilogram|kilograms)?\s+(.+)$/i;
      const match = str.match(regex);

      let qty = 0;
      let unit = '';
      let item = str;
      let parsed = false;

      if (match) {
        qty = parseFloat(match[1]);
        unit = match[2] ? match[2].toLowerCase() : '';
        item = match[3].trim();
        parsed = true;
      }

      if (parsed && !isNaN(qty)) {
        if (unit === 'grams' || unit === 'gram') unit = 'g';
        if (unit === 'kilograms' || unit === 'kilogram') unit = 'kg';
        if (unit === 'lbs') unit = 'lb';
        if (unit === 'cups') unit = 'cup';

        let normalizedItem = item.toLowerCase();
        if (normalizedItem.endsWith('ies')) {
          normalizedItem = normalizedItem.slice(0, -3) + 'y';
        } else if (normalizedItem.endsWith('oes') && normalizedItem.length > 4) {
          normalizedItem = normalizedItem.slice(0, -2);
        } else if (normalizedItem.endsWith('s') && !normalizedItem.endsWith('ss') && !normalizedItem.endsWith('us') && !normalizedItem.endsWith('is')) {
          normalizedItem = normalizedItem.slice(0, -1);
        }

        const key = `${unit}_${normalizedItem}`;

        if (ingredientMap.has(key)) {
          if (isPantry) {
            ingredientMap.get(key).pantryQty = (ingredientMap.get(key).pantryQty || 0) + qty;
          } else {
            ingredientMap.get(key).qty += qty;
          }
        } else {
          ingredientMap.set(key, { 
            qty: isPantry ? 0 : qty, 
            pantryQty: isPantry ? qty : 0, 
            unit, 
            item: normalizedItem, 
            parsed: true 
          });
        }
      } else {
        const key = `unparsed_${str.toLowerCase()}`;
        if (ingredientMap.has(key)) {
          if (isPantry) {
            ingredientMap.get(key).inPantry = true;
          } else {
            ingredientMap.get(key).needed = true;
          }
        } else {
          ingredientMap.set(key, { 
            qty: null, 
            unit: '', 
            item: str, 
            parsed: false,
            inPantry: isPantry,
            needed: !isPantry
          });
        }
      }
    };
    mealPlans.forEach(mp => {
      if (mp.recipe_ingredients && Array.isArray(mp.recipe_ingredients)) {
        mp.recipe_ingredients.forEach(ing => processIngredient(ing, false));
      }
    });
    
     if (profile && profile.pantry && Array.isArray(profile.pantry)) {
      profile.pantry.forEach(ing => processIngredient(ing, true));
    }

    const formatPlural = (qty, unit, item) => {
      if (unit) {
         let displayUnit = unit;
         if (qty > 1) {
            if (unit === 'cup') displayUnit = 'cups';
            if (unit === 'lb') displayUnit = 'lbs';
         }
         const needsSpace = ['g', 'kg', 'mg', 'ml', 'oz'].includes(unit) ? '' : ' ';
         return `${qty}${needsSpace}${displayUnit} ${item}`;
      } else {
         let displayItem = item;
         if (qty > 1) {
            if (item.endsWith('y') && !['a','e','i','o','u'].includes(item.charAt(item.length-2))) {
               displayItem = item.slice(0, -1) + 'ies';
            } else if (item.endsWith('o') || item.endsWith('s') || item.endsWith('x') || item.endsWith('ch') || item.endsWith('sh')) {
               displayItem = item + 'es';
            } else {
               displayItem = item + 's';
            }
         }
         return `${qty} ${displayItem}`;
      }
    };

    return Array.from(ingredientMap.values())
      .filter(val => {
        if (!val.parsed) return val.needed && !val.inPantry;
        return (val.qty - val.pantryQty) > 0;
      })
      .map(val => {
        if (!val.parsed) return val.item;
        const finalQty = Math.round((val.qty - val.pantryQty) * 100) / 100;
        return formatPlural(finalQty, val.unit, val.item);
      });
      
  };
//

// for dipi
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

  return (
    <div className="meal-planner-page">
      <header className="planner-header">
         <h2>Weekly Meal Planner</h2>
         <div className="week-controls">
            <button className="btn btn-primary" onClick={() => setShowGroceryModal(true)}>🛒 Grocery List</button>
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
                     <td key={`${day}-${type}`} onClick={() => handleCellClick(day, type)}>
                       {getCellContent(day, type)}
                     </td>
                   ))}
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}

      {showModal && (
         <div className="modal-overlay">
           <div className="modal-content">
              <h2>{selectedSlot.existingPlanId ? 'Edit Meal' : 'Assign Meal'} for {selectedSlot.day} ({selectedSlot.type})</h2>
              {errorMsg && <div className="error-message">{errorMsg}</div>}
              <form onSubmit={handleSave} className="modal-form">
                <div className="form-group">
                   <label>Select Recipe</label>
                   <select 
                      value={selectedRecipeId} 
                      onChange={(e) => setSelectedRecipeId(e.target.value)}
                      className="form-control"
                      style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
                   >
                     <option value="">-- Choose a Recipe --</option>
                     {recipes.map(r => (
                        <option key={r.id} value={r.id}>{r.title} ({r.prep_time}m)</option>
                     ))}
                   </select>
                </div>
                <div className="recipe-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                   {selectedSlot.existingPlanId ? (
                     <button type="button" className="btn btn-danger" onClick={handleRemove}>Remove Meal</button>
                   ) : <div></div>}
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                     <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                     <button type="submit" className="btn btn-primary">Save</button>
                   </div>
                </div>
              </form>
           </div>
         </div>
      )}

      {showGroceryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Grocery List for Week of {weekStartDateString}</h2>
            {getGroceryList().length === 0 ? (
               <p>Your meal plan is empty. Assign meals to generate a list!</p>
            ) : (
               <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                 {getGroceryList().map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem', textTransform: 'capitalize' }}>{item}</li>
                 ))}
               </ul>
            )}
            <div className="recipe-actions">
              <button className="btn btn-primary" onClick={() => setShowGroceryModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};
export default MealPlanner;