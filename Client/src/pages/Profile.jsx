import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { getCurrentUser, updateProfile, updateLocation, getUserStats } from '../../apiCalls/userCalls';

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);
  
  const [profileForm, setProfileForm] = useState({
    name: userData?.name || '',
    profilePicture: userData?.profilePicture || ''
  });
  
  const [locationForm, setLocationForm] = useState({
    address: userData?.location?.address || '',
    city: userData?.location?.city || '',
    state: userData?.location?.state || '',
    zipCode: userData?.location?.zipCode || ''
  });

  useEffect(() => {
    if (userData) {
      setProfileForm({
        name: userData.name || '',
        profilePicture: userData.profilePicture || ''
      });
      setLocationForm({
        address: userData.location?.address || '',
        city: userData.location?.city || '',
        state: userData.location?.state || '',
        zipCode: userData.location?.zipCode || ''
      });
    }
    loadUserStats();
  }, [userData]);

  const loadUserStats = async () => {
    try {
      const statsData = await getUserStats();
      setStats(statsData);
    } catch (error) {
      // Handle stats loading error silently
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updatedUser = await updateProfile(profileForm);
      dispatch(setUserData(updatedUser));
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updatedUser = await updateLocation(locationForm);
      dispatch(setUserData(updatedUser));
      setMessage('Location updated successfully!');
    } catch (error) {
      setMessage('Error updating location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd use a geocoding service to get address from coordinates
          setMessage('Location detected! Please fill in your address details.');
        },
        (error) => {
          setMessage('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      setMessage('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="min-h-screen bg-(--bg)">
      {/* Navigation */}

      <div className="container-app py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 hover-lift">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <h2 className="text-xl font-semibold text-(--fg)">{userData?.name}</h2>
                <p className="text-(--muted)">@{userData?.userName}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-center text-yellow-500">
                    {'★'.repeat(Math.floor(userData?.rating || 5))}
                    <span className="ml-2 text-(--muted)">({userData?.totalRatings || 0} ratings)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile' ? 'bg-green-100 text-green-700' : 'text-(--muted) hover:bg-gray-100'
                  }`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab('location')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'location' ? 'bg-green-100 text-green-700' : 'text-(--muted) hover:bg-gray-100'
                  }`}
                >
                  Location
                </button>
                <button
                  onClick={() => setActiveTab('impact')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'impact' ? 'bg-green-100 text-green-700' : 'text-(--muted) hover:bg-gray-100'
                  }`}
                >
                  Environmental Impact
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {message && (
              <div className={`mb-6 p-4 rounded-md ${
                message.includes('Error') ? 'bg-red-50 border border-red-200 text-red-600' : 'bg-green-50 border border-green-200 text-green-600'
              }`}>
                {message}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-(--fg) mb-6">Profile Settings</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-(--fg)">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="mt-1 input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-(--fg)">
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      id="profilePicture"
                      value={profileForm.profilePicture}
                      onChange={(e) => setProfileForm({...profileForm, profilePicture: e.target.value})}
                      className="mt-1 input"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'location' && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-(--fg) mb-6">Location Settings</h3>
                <form onSubmit={handleLocationUpdate} className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-(--muted)">
                      Set your location to help others find items nearby
                    </p>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="text-sm btn btn-outline h-8 px-3"
                    >
                      Use Current Location
                    </button>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-(--fg)">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={locationForm.address}
                      onChange={(e) => setLocationForm({...locationForm, address: e.target.value})}
                      className="mt-1 input"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-(--fg)">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={locationForm.city}
                        onChange={(e) => setLocationForm({...locationForm, city: e.target.value})}
                        className="mt-1 input"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-(--fg)">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={locationForm.state}
                        onChange={(e) => setLocationForm({...locationForm, state: e.target.value})}
                        className="mt-1 input"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-(--fg)">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      value={locationForm.zipCode}
                      onChange={(e) => setLocationForm({...locationForm, zipCode: e.target.value})}
                      className="mt-1 input"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Location'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-(--fg) mb-6">Environmental Impact</h3>
                {stats && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50/70 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-green-800">Items Shared</h4>
                          <p className="text-3xl font-bold text-green-600">{stats.environmentalImpact.itemsShared}</p>
                        </div>
                        <div className="text-4xl">📦</div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50/70 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-blue-800">Items Received</h4>
                          <p className="text-3xl font-bold text-blue-600">{stats.environmentalImpact.itemsReceived}</p>
                        </div>
                        <div className="text-4xl">🎁</div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50/70 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-purple-800">CO₂ Saved</h4>
                          <p className="text-3xl font-bold text-purple-600">{stats.environmentalImpact.co2Saved} kg</p>
                        </div>
                        <div className="text-4xl">🌱</div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50/70 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-orange-800">Waste Diverted</h4>
                          <p className="text-3xl font-bold text-orange-600">{stats.environmentalImpact.wasteDiverted} kg</p>
                        </div>
                        <div className="text-4xl">♻️</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-(--fg) mb-2">How we calculate your impact:</h4>
                  <ul className="text-sm text-(--muted) space-y-1">
                    <li>• Each item shared prevents new production and reduces waste</li>
                    <li>• CO₂ savings are calculated based on item category and typical production emissions</li>
                    <li>• Waste diverted includes the weight of items that would have gone to landfills</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
