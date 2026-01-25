'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone,
  Shield,
  Database,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Zap,
  Camera,
  Edit2,
  Trash2,
  Loader2,
  Briefcase,
  Award
} from 'lucide-react';
import { api } from '@/services/api';

export default function TeacherSettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    type: '',
    role: '',
    account_status: '',
    photo: ''
  });

  const [editProfile, setEditProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    specialization: '',
    experience: ''
  });

  // Fetch profile data from API
  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/me');
      
      if (response.status === 200) {
        const data = response.data || {};
        console.log('Profile data:', data); // Debug log
        
        setProfileData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          specialization: data.specialization || '',
          experience: data.experience || '',
          type: data.type || '',
          role: data.role || '',
          account_status: data.account_status || '',
          photo: data.photo || ''
        });

        // Set edit form with current values
        setEditProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          specialization: data.specialization || '',
          experience: data.experience || ''
        });

        // Set profile image if available
        if (data.photo && data.photo !== 'www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y') {
          setProfileImage(data.photo);
        }
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle profile update
  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        first_name: editProfile.first_name,
        last_name: editProfile.last_name,
        phone: editProfile.phone || '',
        specialization: editProfile.specialization || '',
        experience: editProfile.experience || ''
      };

      console.log('Saving payload:', payload); // Debug log

      const response = await api.patch('/me', payload);
      
      if (response.status === 200) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        fetchProfile(); // Refresh profile data
        
        // Clear preview image after save
        if (previewImage) {
          // Here you would typically upload the image to a separate endpoint
          setProfileImage(previewImage);
          setPreviewImage(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    const firstName = profileData.first_name || '';
    const lastName = profileData.last_name || '';
    return (firstName[0] || '') + (lastName[0] || '');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'integrations', label: 'Integrations', icon: Zap },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-primary-dark mx-auto" size={48} />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-primary-lighter">Configure your teacher account, preferences, and security</p>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <p className="text-red-700">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-500" size={20} />
          <p className="text-green-700">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? 'bg-primary-lighter text-primary-dark border border-primary-lighter'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Account Status Card - Simplified */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    profileData.account_status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">Status</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  profileData.account_status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profileData.account_status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{profileData.type || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium">{profileData.role || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setIsEditing(false);
                        setPreviewImage(null);
                        // Reset edit form to current profile data
                        setEditProfile({
                          first_name: profileData.first_name,
                          last_name: profileData.last_name,
                          phone: profileData.phone,
                          specialization: profileData.specialization,
                          experience: profileData.experience
                        });
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg flex items-center space-x-2"
                  >
                    <Edit2 size={16} />
                    <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
                  </button>
                </div>

                {/* Profile Image Section */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-dark to-primary-light flex items-center justify-center">
                          <span className="text-white text-5xl font-bold">
                            {getInitials()}
                          </span>
                        </div>
                      )}
                      
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={triggerFileInput}
                            className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors"
                          >
                            <Camera className="text-gray-800" size={24} />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing && (previewImage || profileImage) && (
                      <button
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg flex items-center space-x-2"
                      >
                        <Camera size={16} />
                        <span>{previewImage || profileImage ? 'Change Photo' : 'Upload Photo'}</span>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  )}

                  {!isEditing && profileImage && (
                    <p className="mt-4 text-sm text-gray-600">
                      Profile photo uploaded
                    </p>
                  )}
                </div>

                {/* All Profile Fields in Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editProfile.first_name : profileData.first_name}
                      onChange={(e) => isEditing && setEditProfile({...editProfile, first_name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editProfile.last_name : profileData.last_name}
                      onChange={(e) => isEditing && setEditProfile({...editProfile, last_name: e.target.value})}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={isEditing ? editProfile.phone : profileData.phone}
                      onChange={(e) => isEditing && setEditProfile({...editProfile, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-700"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editProfile.specialization : profileData.specialization}
                      onChange={(e) => isEditing && setEditProfile({...editProfile, specialization: e.target.value})}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-700"
                      placeholder="e.g., Physics, Mathematics, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editProfile.experience : profileData.experience}
                      onChange={(e) => isEditing && setEditProfile({...editProfile, experience: e.target.value})}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-700"
                      placeholder="e.g., 1-3 Years, 5+ Years, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <input
                      type="text"
                      value={profileData.type}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">Account type cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                  </div>
                </div>


                {isEditing && (
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setPreviewImage(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                        // Reset edit form
                        setEditProfile({
                          first_name: profileData.first_name,
                          last_name: profileData.last_name,
                          phone: profileData.phone,
                          specialization: profileData.specialization,
                          experience: profileData.experience
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving || !editProfile.first_name || !editProfile.last_name}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 flex items-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Integrations</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Database className="text-primary-dark" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Google Classroom</h3>
                        <p className="text-gray-600">Sync with Google Classroom</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg">
                      Connect
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Shield className="text-green-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Zoom</h3>
                        <p className="text-gray-600">Schedule and join meetings</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                      Connect
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Database className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Plagiarism Check</h3>
                        <p className="text-gray-600">Integrate Turnitin</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                      Connect
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <Database className="text-orange-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">GitHub Classroom</h3>
                        <p className="text-gray-600">Manage coding assignments</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg">
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}