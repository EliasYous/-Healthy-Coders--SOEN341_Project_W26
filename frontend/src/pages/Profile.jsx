import React from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    dietPreferences: [],
    allergies: [],

  });

    const [message, setMessage] = React.useState('');


  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await axios.put('/api/profile', updates);
      setProfile(response.data);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

    const handleRemoveDietPreference = (preference) => {
        //create new array without the removed preference
    const updated = profile.dietPreferences.filter((p) => p !== preference); 
    updateProfile({ dietPreferences: updated });
  };

  const handleRemoveAllergy = (allergy) => {
    const updated = profile.allergies.filter((a) => a !== allergy);
    updateProfile({ allergies: updated });
  };

  const handleQuickAddDiet = (preference) => {
    if (!profile.dietPreferences.includes(preference)) {
      const updated = [...profile.dietPreferences, preference]; //copy existing preferences and add new one
      updateProfile({ dietPreferences: updated });
    }
  };

  const handleQuickAddAllergy = (allergy) => {
    if (!profile.allergies.includes(allergy)) {
      const updated = [...profile.allergies, allergy];
      updateProfile({ allergies: updated });
    }
  };

  const commonDietPreferences = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Plant-Based',
    'Mediterranean',
    'Dairy-Free',
    'Keto',
    'Paleo',
    'Pescatarian',
    'Halal',
    'Low-Carb',
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
    'Sesame',
  ];

  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="personal-info-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="info-grid">
            <div>
              <p className="info-label">Full Name</p>
              <p className="info-value">{profile.firstName} {profile.lastName}</p>
            </div>
            <div>
              <p className="info-label">Email Address</p>
              <p className="info-value">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="preferences-section">
          <h3 className="section-subtitle">Diet Preferences</h3>
          <p className="section-description">
            Quickly add your dietary preferences by clicking the options below.
          </p>

          <div className="quick-add-buttons">
            {commonDietPreferences.map((pref) => (
              <button
                key={pref}
                onClick={() => handleQuickAddDiet(pref)}
                className={`quick-add-btn'+ ${profile.dietPreferences.includes(pref) ? 'diet-selected' : ''}`}
                disabled={profile.dietPreferences.includes(pref)}
              >
                {pref}
              </button>
            ))}
          </div>

          <div className="selected-tags">
            {profile.dietPreferences.map((pref) => (
              <span key={pref} className="tag diet-tag">
                {pref}
                <button
                  onClick={() => handleRemoveDietPreference(pref)}
                  className="remove-btn"
                  title="Remove"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="allergies-section">
          <h3 className="section-subtitle">Allergies</h3>
          <p className="section-description">
            Select any common allergies you have
          </p>

          <div className="quick-add-buttons">
            {commonAllergies.map((allergy) => (
              <button
                key={allergy}
                onClick={() => handleQuickAddAllergy(allergy)}
                className={`quick-add-btn ${profile.allergies.includes(allergy) ? 'allergy-selected' : ''}`}
                disabled={profile.allergies.includes(allergy)}
              >
                {allergy}
              </button>
            ))}
          </div>

          <div className="selected-tags">
            {profile.allergies.map((allergy) => (
              <span key={allergy} className="tag allergy-tag">
                {allergy}
                <button
                  onClick={() => handleRemoveAllergy(allergy)}
                  className="remove-btn"
                  title="Remove"
                >
                  x
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