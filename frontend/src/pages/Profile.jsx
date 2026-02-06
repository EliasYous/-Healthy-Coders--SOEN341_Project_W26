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




};

export default Profile;