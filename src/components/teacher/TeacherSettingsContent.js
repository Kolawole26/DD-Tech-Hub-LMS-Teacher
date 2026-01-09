'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Video, 
  FileText,
  Globe,
  Shield,
  Database,
  Download,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Users,
  Settings,
  BookOpen,
  Zap,
  Camera,
  Edit2,
  Trash2
} from 'lucide-react';

export default function TeacherSettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [settings, setSettings] = useState({
    profile: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      department: 'Computer Science',
      title: 'Associate Professor',
      phone: '+1 (555) 123-4567',
      office: 'Room 302, CS Building',
      bio: 'Specialized in web development and software engineering with 10+ years of teaching experience.',
    },
    // ... rest of your settings state
  });

  const handleSave = () => {
    setSaving(true);
    // If we have a new image, you would upload it here
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      if (previewImage) {
        setProfileImage(previewImage); // Save the preview as actual image
        setPreviewImage(null); // Clear preview
      }
      alert('Settings saved successfully!');
    }, 1500);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
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

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'integrations', label: 'Integrations', icon: Zap },
  ];

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
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white rounded-lg"
                  >
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
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
                            {getInitials(settings.profile.name)}
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
                      
                      {/* {(previewImage || profileImage) && (
                        <button
                          onClick={removeImage}
                          className="px-4 py-2 border border-red-500 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                        >
                          <Trash2 size={16} />
                          <span>Remove Photo</span>
                        </button>
                      )} */}
                    </div>
                  )}

                  {!isEditing && (previewImage || profileImage) && (
                    <p className="mt-4 text-sm text-gray-600">
                      Profile photo uploaded
                    </p>
                  )}
                  

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, name: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, email: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={settings.profile.department}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, department: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={settings.profile.title}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, title: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, phone: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Office Location
                    </label>
                    <input
                      type="text"
                      value={settings.profile.office}
                      onChange={(e) => setSettings({
                        ...settings,
                        profile: { ...settings.profile, office: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, bio: e.target.value }
                    })}
                    disabled={!isEditing}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setPreviewImage(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 flex items-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Integrations Tab - Remains the same */}
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
                        <Globe className="text-green-600" size={24} />
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
                        <Shield className="text-purple-600" size={24} />
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
                        <BookOpen className="text-orange-600" size={24} />
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