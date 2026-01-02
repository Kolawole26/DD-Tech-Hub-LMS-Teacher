'use client';

import { useState } from 'react';
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
  Zap
} from 'lucide-react';

export default function TeacherSettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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
    notifications: {
      email: {
        assignmentSubmissions: true,
        gradeSubmissions: true,
        studentMessages: true,
        classReminders: true,
        systemUpdates: false,
      },
      push: {
        liveClassAlerts: true,
        urgentMessages: true,
        deadlineAlerts: true,
        attendanceReminders: false,
      },
      schedule: {
        dailyDigestTime: '09:00',
        weeklyReportDay: 'Monday',
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
      },
    },
    preferences: {
      grading: {
        autoSaveDrafts: true,
        showRubricByDefault: true,
        enablePlagiarismCheck: true,
        allowLateSubmissions: true,
        lateSubmissionPenalty: 10,
      },
      classroom: {
        autoRecordLiveSessions: true,
        allowStudentRecording: false,
        enableChatDuringLive: true,
        requireAttendance: true,
        defaultAttendanceMethod: 'automatic',
      },
      display: {
        theme: 'light',
        compactMode: false,
        showStudentAvatars: true,
        defaultView: 'dashboard',
      },
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: 30,
      passwordLastChanged: '2025-11-15',
    },
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      alert('Settings saved successfully!');
    }, 1500);
  };

  const handleExportData = () => {
    const data = {
      profile: settings.profile,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teacher_profile_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const toggleSetting = (category, key, subKey = null) => {
    setSettings(prev => {
      if (subKey) {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [key]: {
              ...prev[category][key],
              [subKey]: !prev[category][key][subKey]
            }
          }
        };
      } else {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [key]: !prev[category][key]
          }
        };
      }
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    // { id: 'preferences', label: 'Preferences', icon: Settings },
    // { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Zap },
  ];

  const SettingsIcon = ({ icon }) => {
    const Icon = icon;
    return <Icon className="text-gray-500" size={20} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-primary-lighter">Configure your teacher account, preferences, and security</p>
          </div>
          <div className="mt-4 md:mt-0">
            {/* <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-white text-gray-800 hover:bg-gray-100 font-semibold rounded-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button> */}
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

            {/* Quick Actions */}
            {/* <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleExportData}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Export Data</span>
                </button>
                <Link
                  href="/teacher/dashboard"
                  className="w-full px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2"
                >
                  <Globe size={16} />
                  <span>View Public Profile</span>
                </Link>
              </div>
            </div> */}
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
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      Save Profile
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {/* {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <Mail size={20} />
                        <span>Email Notifications</span>
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(settings.notifications.email).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                              <p className="text-sm text-gray-600">Receive email notifications</p>
                            </div>
                            <button
                              onClick={() => toggleSetting('notifications', 'email', key)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                value ? 'bg-blue-500' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <Bell size={20} />
                        <span>Push Notifications</span>
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(settings.notifications.push).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </p>
                              <p className="text-sm text-gray-600">Receive push notifications</p>
                            </div>
                            <button
                              onClick={() => toggleSetting('notifications', 'push', key)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                value ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <Calendar size={20} />
                        <span>Notification Schedule</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Daily Digest Time
                          </label>
                          <input
                            type="time"
                            value={settings.notifications.schedule.dailyDigestTime}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                schedule: {
                                  ...settings.notifications.schedule,
                                  dailyDigestTime: e.target.value
                                }
                              }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weekly Report Day
                          </label>
                          <select
                            value={settings.notifications.schedule.weeklyReportDay}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                schedule: {
                                  ...settings.notifications.schedule,
                                  weeklyReportDay: e.target.value
                                }
                              }
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          >
                            <option>Monday</option>
                            <option>Tuesday</option>
                            <option>Wednesday</option>
                            <option>Thursday</option>
                            <option>Friday</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Preferences Tab */}
            {/* {activeTab === 'preferences' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Teaching Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <FileText size={20} />
                        <span>Grading Preferences</span>
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(settings.preferences.grading).map(([key, value]) => {
                          if (key === 'lateSubmissionPenalty') {
                            return (
                              <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-800 capitalize">
                                    Late Submission Penalty
                                  </p>
                                  <p className="text-sm text-gray-600">Percentage deduction per day</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={value}
                                    onChange={(e) => setSettings({
                                      ...settings,
                                      preferences: {
                                        ...settings.preferences,
                                        grading: {
                                          ...settings.preferences.grading,
                                          lateSubmissionPenalty: parseInt(e.target.value)
                                        }
                                      }
                                    })}
                                    className="w-20 p-2 border border-gray-300 rounded-lg"
                                  />
                                  <span>%</span>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-800 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </p>
                                <p className="text-sm text-gray-600">Enable this feature</p>
                              </div>
                              <button
                                onClick={() => toggleSetting('preferences', 'grading', key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                  value ? 'bg-purple-500' : 'bg-gray-300'
                                }`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  value ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                        <Video size={20} />
                        <span>Classroom Settings</span>
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(settings.preferences.classroom).map(([key, value]) => {
                          if (key === 'defaultAttendanceMethod') {
                            return (
                              <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-800 capitalize">
                                    Default Attendance Method
                                  </p>
                                  <p className="text-sm text-gray-600">How attendance is taken by default</p>
                                </div>
                                <select
                                  value={value}
                                  onChange={(e) => setSettings({
                                    ...settings,
                                    preferences: {
                                      ...settings.preferences,
                                      classroom: {
                                        ...settings.preferences.classroom,
                                        defaultAttendanceMethod: e.target.value
                                      }
                                    }
                                  })}
                                  className="p-2 border border-gray-300 rounded-lg"
                                >
                                  <option value="automatic">Automatic</option>
                                  <option value="manual">Manual</option>
                                  <option value="qr-code">QR Code</option>
                                </select>
                              </div>
                            );
                          }
                          return (
                            <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-800 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </p>
                                <p className="text-sm text-gray-600">Enable this feature</p>
                              </div>
                              <button
                                onClick={() => toggleSetting('preferences', 'classroom', key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                  value ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                  value ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Security Tab */}
            {/* {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-800">Two-Factor Authentication</h3>
                        <p className="text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        onClick={() => toggleSetting('security', 'twoFactorAuth')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.security.twoFactorAuth ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    {settings.security.twoFactorAuth && (
                      <div className="p-4 bg-white rounded-lg border">
                        <p className="text-sm text-gray-700">
                          2FA is enabled. Use your authenticator app to generate codes.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-800">Login Alerts</p>
                          <p className="text-sm text-gray-600">Get notified of new logins</p>
                        </div>
                        <button
                          onClick={() => toggleSetting('security', 'loginAlerts')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            settings.security.loginAlerts ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            settings.security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-800">Session Timeout</p>
                          <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                        </div>
                        <select
                          value={settings.security.sessionTimeout}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: {
                              ...settings.security,
                              sessionTimeout: parseInt(e.target.value)
                            }
                          })}
                          className="p-2 border border-gray-300 rounded-lg"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>60 minutes</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
                    <h3 className="font-bold text-red-800 mb-3">Danger Zone</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Delete Account</p>
                          <p className="text-sm text-gray-600">Permanently delete your account</p>
                        </div>
                        <button className="px-4 py-2 border border-red-500 text-red-600 hover:bg-red-50 rounded-lg">
                          Delete Account
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Export All Data</p>
                          <p className="text-sm text-gray-600">Download all your data</p>
                        </div>
                        <button
                          onClick={handleExportData}
                          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                        >
                          Export Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Integrations</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Database className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">Google Classroom</h3>
                        <p className="text-gray-600">Sync with Google Classroom</p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
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