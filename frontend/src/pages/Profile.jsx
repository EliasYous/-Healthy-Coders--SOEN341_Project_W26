import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    dietPreferences: [],
    allergies: [],
    pantry: [],
    firstName: '',
    lastName: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const [pantryQty, setPantryQty] = useState('');
  const [pantryUnit, setPantryUnit] = useState('g');
  const [pantryItemName, setPantryItemName] = useState('');

  const commonDietPreferences = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Keto',
    'Paleo',
    'Pescatarian',
    'Halal',
    'Low-Carb',
  ];

  const PANTRY_UNITS = [
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

  const commonAllergies = [
    'Peanuts',
    'Tree Nuts',
    'Dairy',
    'Eggs',
    'Fish',
    'Shellfish',
    'Soy',
    'Wheat',
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDietPreference = (preference) => {
    // remove the preference from the dietPreferences array
    const updated = profile.dietPreferences.filter((p) => p !== preference); // keep the preference if it is not equal to the preference to be removed

    // update the profile
    updateProfile({ dietPreferences: updated });
  };

  const handleRemoveAllergy = (allergy) => {
    // remove the allergy from the allergies array
    const updated = profile.allergies.filter((a) => a !== allergy);
    // update the profile
    updateProfile({ allergies: updated });
  };

  const handleQuickAddDiet = (preference) => {
    if (!profile.dietPreferences.includes(preference)) {
      // add the preference to the dietPreferences array
      const updated = [...profile.dietPreferences, preference];
      // update the profile
      updateProfile({ dietPreferences: updated });
    }
  };

  const handleQuickAddAllergy = (allergy) => {
    if (!profile.allergies.includes(allergy)) {
      const updated = [...profile.allergies, allergy];
      updateProfile({ allergies: updated });
    }
  };

  const handleAddPantryItem = (e) => {
    e.preventDefault();
    if (!pantryQty || !pantryItemName.trim()) {
      setMessage('Error: Quantity and Item Name are required');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const itemString = `${pantryQty}${pantryUnit ? ' ' + pantryUnit : ''} ${pantryItemName.trim()}`;
    const updated = [...(profile.pantry || []), itemString];
    updateProfile({ pantry: updated });
    setPantryQty('');
    setPantryUnit('g');
    setPantryItemName('');
  };

  const handleRemovePantryItem = (item) => {
    const updated = (profile.pantry || []).filter((i) => i !== item);
    updateProfile({ pantry: updated });
  };


  const updateProfile = async (updates) => {
    try {
      const response = await axios.put('/api/profile', updates);
      setProfile(response.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '30px' }}>
      <div className="card">
        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Full Name</p>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>{profile.firstName} {profile.lastName}</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>Email Address</p>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>{profile.email}</p>
            </div>
          </div>
        </div>

        <h2>Dietary Requirements</h2>
        {message && (
          <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
            {message}
          </div>
        )}

        {/* Diet Preferences Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3>Diet Preferences</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
            Quickly add your dietary preferences by clicking the options below.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {commonDietPreferences.map((pref) => (
              <button
                key={pref}
                onClick={() => handleQuickAddDiet(pref)}
                className="btn btn-secondary"
                style={{
                  fontSize: '14px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor: profile.dietPreferences.includes(pref) ? '#e3f2fd' : '',
                  borderColor: profile.dietPreferences.includes(pref) ? '#2196f3' : '',
                  color: profile.dietPreferences.includes(pref) ? '#1976d2' : ''
                }}
                disabled={profile.dietPreferences.includes(pref)}
              >
                {pref}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {profile.dietPreferences.map((pref) => (
              <span
                key={pref}
                style={{
                  background: '#e3f2fd',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #bbdefb',
                  color: '#1976d2',
                  fontWeight: '500'
                }}
              >
                {pref}
                <button
                  onClick={() => handleRemoveDietPreference(pref)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#f44336',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    lineHeight: '1'
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Allergies Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3>Allergies</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
            Select any common allergies you have.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {commonAllergies.map((allergy) => (
              <button
                key={allergy}
                onClick={() => handleQuickAddAllergy(allergy)}
                className="btn btn-secondary"
                style={{
                  fontSize: '14px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  // if the allergy is selected, change the background color to red
                  backgroundColor: profile.allergies.includes(allergy) ? '#ffebee' : '',
                  borderColor: profile.allergies.includes(allergy) ? '#ef5350' : '',
                  color: profile.allergies.includes(allergy) ? '#c62828' : ''
                }}
                // if the allergy is selected, disable the button
                disabled={profile.allergies.includes(allergy)}
              >
                {allergy}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {profile.allergies.map((allergy) => (
              <span
                key={allergy}
                style={{
                  background: '#ffebee',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #ffcdd2',
                  color: '#c62828',
                  fontWeight: '500'
                }}
              >
                {allergy}
                <button
                  onClick={() => handleRemoveAllergy(allergy)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#d32f2f',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    lineHeight: '1'
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Pantry Section */}
        <div>
          <h3>My Pantry</h3>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
            Add items you already have at home (e.g. "500g sugar", "10 bananas", "salt"). These will be excluded from your grocery list.
          </p>

          <form onSubmit={handleAddPantryItem} style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
            <input
              type="number"
              min="0"
              step="any"
              value={pantryQty}
              onChange={(e) => setPantryQty(e.target.value)}
              placeholder="Qty (e.g. 200)"
              className="form-control"
              style={{ width: '140px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <select
              value={pantryUnit}
              onChange={(e) => setPantryUnit(e.target.value)}
              className="form-control"
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              {PANTRY_UNITS.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={pantryItemName}
              onChange={(e) => setPantryItemName(e.target.value)}
              placeholder="Item name (e.g. chicken)"
              className="form-control"
              style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>Add Item</button>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {(profile.pantry || []).map((item, idx) => (
              <span
                key={idx}
                style={{
                  background: '#e8f5e9',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #c8e6c9',
                  color: '#2e7d32',
                  fontWeight: '500'
                }}
              >
                {item}
                <button
                  onClick={() => handleRemovePantryItem(item)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#c62828',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    lineHeight: '1'
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

