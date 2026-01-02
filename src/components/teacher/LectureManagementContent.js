'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Upload, 
  Video, 
  FileText, 
  PlayCircle, 
  Clock, 
  Calendar,
  Users,
  Link as LinkIcon,
  Settings,
  Trash2,
  Edit,
  Eye,
  Download,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Mic,
  Webcam,
  Share2,
  X,
  Share,
  Copy,
  Pencil,
  Wifi,
  Sliders,
  Folder,
  Headphones,
  Maximize2,
  Minimize2,
  Volume2,
  Camera,
  MessageSquare
} from 'lucide-react';

export default function LectureManagementContent() {
  const [activeTab, setActiveTab] = useState('materials');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: 'Introduction to Web Development',
      course: 'Web App Development',
      type: 'video',
      duration: '2h 15m',
      size: '1.2 GB',
      uploadDate: 'Dec 10, 2025',
      views: 245,
      downloads: 120,
    },
    {
      id: 2,
      title: 'CSS Grid & Flexbox',
      course: 'Web App Development',
      type: 'slides',
      duration: '45m',
      size: '45 MB',
      uploadDate: 'Dec 8, 2025',
      views: 189,
      downloads: 95,
    },
    {
      id: 3,
      title: 'JavaScript Fundamentals',
      course: 'Advanced JavaScript',
      type: 'video',
      duration: '2h 30m',
      size: '1.5 GB',
      uploadDate: 'Dec 5, 2025',
      views: 312,
      downloads: 150,
    },
    {
      id: 4,
      title: 'React State Management',
      course: 'React Masterclass',
      type: 'document',
      duration: '1h 20m',
      size: '25 MB',
      uploadDate: 'Dec 3, 2025',
      views: 156,
      downloads: 80,
    },
  ]);
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: 'Advanced JavaScript Concepts',
      course: 'Web App Development',
      scheduled: 'Today, 10:00 AM',
      duration: '2 hours',
      students: 45,
      status: 'upcoming',
      joinLink: 'https://meet.example.com/abc123',
    },
    {
      id: 2,
      title: 'CSS Grid Masterclass',
      course: 'Web App Development',
      scheduled: 'Tomorrow, 2:00 PM',
      duration: '1.5 hours',
      students: 32,
      status: 'scheduled',
      joinLink: 'https://meet.example.com/def456',
    },
    {
      id: 3,
      title: 'State Management Patterns',
      course: 'React Masterclass',
      scheduled: 'Wednesday, 11:00 AM',
      duration: '2 hours',
      students: 28,
      status: 'scheduled',
      joinLink: 'https://meet.example.com/ghi789',
    },
  ]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [recordingSettings, setRecordingSettings] = useState({
    recordAll: true,
    cloudSave: true,
    autoCaption: false,
    quality: 'Full HD (1080p)',
    retention: '90 days'
  });
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [liveStats, setLiveStats] = useState({
    connected: 45,
    audio: true,
    video: true,
    screenShare: false,
    isFullscreen: false,
    isMuted: false
  });

  const fileInputRef = useRef(null);
  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 'cs101', name: 'Web App Development' },
    { id: 'cs201', name: 'Advanced JavaScript' },
    { id: 'cs301', name: 'React Masterclass' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            
            // Add new material to list
            const newId = materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1;
            const newMaterial = {
              id: newId,
              title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              course: 'Web App Development', // Default course
              type: file.type.includes('video') ? 'video' : file.type.includes('pdf') ? 'document' : 'slides',
              duration: 'Unknown',
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              views: 0,
              downloads: 0,
            };
            
            setMaterials(prev => [newMaterial, ...prev]);
            alert(`${file.name} uploaded successfully!`);
            return 0;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const startLiveSession = () => {
    setIsLive(true);
    setLiveStats(prev => ({ ...prev, connected: 0 }));
    alert('Live session started! Students can now join.');
    
    // Simulate students joining
    const interval = setInterval(() => {
      setLiveStats(prev => {
        if (prev.connected >= 45) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, connected: prev.connected + 1 };
      });
    }, 500);
  };

  const stopLiveSession = () => {
    setIsLive(false);
    alert('Live session ended and recorded.');
  };

  const handleDeleteMaterial = (id) => {
    if (confirm('Are you sure you want to delete this lecture material?')) {
      setMaterials(prev => prev.filter(material => material.id !== id));
      alert(`Lecture material deleted successfully.`);
    }
  };

  const handleScheduleLive = () => {
    const date = prompt('Enter session date and time (YYYY-MM-DD HH:MM):');
    const topic = prompt('Enter session topic:');
    const course = prompt('Enter course:');
    
    if (date && topic && course) {
      const newId = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1;
      const newSession = {
        id: newId,
        title: topic,
        course: course,
        scheduled: new Date(date).toLocaleString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        duration: '2 hours',
        students: 0,
        status: 'scheduled',
        joinLink: `https://meet.example.com/${Math.random().toString(36).substr(2, 9)}`,
      };
      
      setSessions(prev => [newSession, ...prev]);
      alert(`Live session scheduled for ${date} on "${topic}"`);
    }
  };

  const handleEditMaterial = (material) => {
    setSelectedMaterial(material);
    setShowMaterialModal(true);
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const handleStartSession = (sessionId) => {
    alert(`Starting session: ${sessions.find(s => s.id === sessionId)?.title}`);
    setIsLive(true);
    setLiveStats(prev => ({ ...prev, connected: 0 }));
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert('Join link copied to clipboard!');
  };

  const handleShareLink = (link) => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Live Session',
        text: 'Join my live teaching session',
        url: link,
      });
    } else {
      handleCopyLink(link);
    }
  };

  const handleRescheduleSession = (sessionId) => {
    const newDate = prompt('Enter new date and time (YYYY-MM-DD HH:MM):');
    if (newDate) {
      setSessions(prev =>
        prev.map(session =>
          session.id === sessionId
            ? {
                ...session,
                scheduled: new Date(newDate).toLocaleString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }),
                status: 'rescheduled'
              }
            : session
        )
      );
      alert('Session rescheduled successfully!');
    }
  };

  const handlePreviewMaterial = (material) => {
    alert(`Previewing: ${material.title}\n\nType: ${material.type}\nCourse: ${material.course}\nDuration: ${material.duration}`);
  };

  const handleDownloadMaterial = (material) => {
    // Create a dummy download
    const content = `Lecture Material: ${material.title}\nCourse: ${material.course}\nType: ${material.type}\nDuration: ${material.duration}\nUploaded: ${material.uploadDate}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${material.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    
    // Update download count
    setMaterials(prev =>
      prev.map(m =>
        m.id === material.id
          ? { ...m, downloads: m.downloads + 1 }
          : m
      )
    );
  };

  const handleUpdateMaterial = () => {
    if (selectedMaterial) {
      const newTitle = prompt('Enter new title:', selectedMaterial.title);
      if (newTitle) {
        setMaterials(prev =>
          prev.map(m =>
            m.id === selectedMaterial.id
              ? { ...m, title: newTitle }
              : m
          )
        );
        alert('Material updated successfully!');
      }
    }
    setShowMaterialModal(false);
    setSelectedMaterial(null);
  };

  const handleUpdateSession = () => {
    if (selectedSession) {
      const newTitle = prompt('Enter new title:', selectedSession.title);
      if (newTitle) {
        setSessions(prev =>
          prev.map(s =>
            s.id === selectedSession.id
              ? { ...s, title: newTitle }
              : s
          )
        );
        alert('Session updated successfully!');
      }
    }
    setShowSessionModal(false);
    setSelectedSession(null);
  };

  const toggleRecordingSetting = (setting) => {
    setRecordingSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    alert(`${setting} ${!recordingSettings[setting] ? 'enabled' : 'disabled'}`);
  };

  const handleProcessRecording = (recordingId) => {
    alert(`Processing recording ${recordingId}...\nThis would generate captions and optimize video quality.`);
  };

  const handleEditRecording = (recordingId) => {
    setShowRecordingModal(true);
    alert(`Opening editor for recording ${recordingId}`);
  };

  const toggleLiveControl = (control) => {
    setLiveStats(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
    
    const action = !liveStats[control] ? 'enabled' : 'disabled';
    alert(`${control} ${action}`);
  };

  const toggleFullscreen = () => {
    setLiveStats(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen
    }));
    alert(liveStats.isFullscreen ? 'Exited fullscreen' : 'Entered fullscreen');
  };

  const filteredMaterials = materials.filter(material => 
    selectedCourse === 'all' || material.course === courses.find(c => c.id === selectedCourse)?.name
  );

  const filteredSessions = sessions.filter(session => 
    selectedCourse === 'all' || session.course === courses.find(c => c.id === selectedCourse)?.name
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Lecture Management</h1>
            <p className="text-primary-lighter">Upload materials, conduct live sessions, and manage recordings</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={startLiveSession}
              disabled={isLive}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLive ? 'Live Now' : 'Start Live Session'}
            </button>
            <button
              onClick={handleScheduleLive}
              className="px-6 py-3 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg"
            >
              Schedule Live
            </button>
          </div>
        </div>
      </div>

      {/* Live Session Controls */}
      {isLive && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold">Live Session in Progress</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {liveStats.connected} Students Connected
              </span>
              <button
                onClick={stopLiveSession}
                className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100"
              >
                End Session
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <Mic size={20} />
              <div>
                <p className="text-sm opacity-90">Microphone</p>
                <button 
                  onClick={() => toggleLiveControl('audio')}
                  className="font-semibold hover:underline"
                >
                  {liveStats.audio ? 'Connected' : 'Muted'}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Webcam size={20} />
              <div>
                <p className="text-sm opacity-90">Camera</p>
                <button 
                  onClick={() => toggleLiveControl('video')}
                  className="font-semibold hover:underline"
                >
                  {liveStats.video ? 'Active' : 'Off'}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Share2 size={20} />
              <div>
                <p className="text-sm opacity-90">Screen Share</p>
                <button 
                  onClick={() => toggleLiveControl('screenShare')}
                  className="font-semibold hover:underline"
                >
                  {liveStats.screenShare ? 'Sharing' : 'Ready'}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleFullscreen}
                className="flex items-center space-x-2 hover:opacity-90"
              >
                {liveStats.isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                <span className="text-sm">Fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex space-x-1 mb-4 md:mb-0">
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 font-medium rounded-lg ${
                activeTab === 'materials'
                  ? 'bg-primary-lighter text-primary-dark border-b-2 border-primary-dark'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Lecture Materials
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 font-medium rounded-lg ${
                activeTab === 'live'
                  ? 'bg-primary-lighter text-primary-dark border-b-2 border-primary-dark'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Live Sessions
            </button>
            <button
              onClick={() => setActiveTab('recordings')}
              className={`px-4 py-2 font-medium rounded-lg ${
                activeTab === 'recordings'
                  ? 'bg-primary-lighter text-primary-dark border-b-2 border-primary-dark'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Recordings
            </button>
          </div>

          <div className="flex space-x-3">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white font-semibold rounded-lg flex items-center space-x-2"
            >
              <Upload size={16} />
              <span>Upload Material</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept="video/*,application/pdf,application/vnd.ms-powerpoint,application/msword,text/plain"
            />
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-6 p-4 bg-primary-lighter border border-primary-light rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-primary-dark">Uploading file...</span>
              <span className="text-primary-dark">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-dark h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Lecture Materials Tab */}
        {activeTab === 'materials' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <div key={material.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${
                        material.type === 'video' ? 'bg-red-100' :
                        material.type === 'slides' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {material.type === 'video' ? (
                          <Video className="text-red-600" size={20} />
                        ) : material.type === 'slides' ? (
                          <FileText className="text-blue-600" size={20} />
                        ) : (
                          <FileText className="text-green-600" size={20} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 line-clamp-1">{material.title}</h3>
                        <p className="text-sm text-gray-600">{material.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleEditMaterial(material)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Upload Date</span>
                      <span className="font-medium">{material.uploadDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Duration</span>
                      <span className="font-medium">{material.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>File Size</span>
                      <span className="font-medium">{material.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Views/Downloads</span>
                      <span className="font-medium">{material.views}/{material.downloads}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    {/* <button 
                      onClick={() => handlePreviewMaterial(material)}
                      className="flex-1 px-3 py-2 bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white text-sm rounded-lg flex items-center justify-center"
                    >
                      <Eye size={14} className="mr-1" />
                      Preview
                    </button> */}
                    <button 
                      onClick={() => handleDownloadMaterial(material)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded-lg flex items-center justify-center"
                    >
                      <Download size={14} className="mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Sessions Tab */}
        {activeTab === 'live' && (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-gray-800">{session.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        session.status === 'upcoming' ? 'bg-red-100 text-red-800' :
                        session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{session.course}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditSession(session)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="Edit Session"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleCopyLink(session.joinLink)}
                      className="p-2 text-gray-400 hover:text-green-600"
                      title="Copy Join Link"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Scheduled Time</p>
                    <p className="font-semibold">{session.scheduled}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{session.duration}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Students</p>
                    <p className="font-semibold">{session.students}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Join Link</p>
                    <button
                      onClick={() => handleCopyLink(session.joinLink)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <Copy size={14} className="mr-1" />
                      Copy Link
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleStartSession(session.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center space-x-2"
                  >
                    <PlayCircle size={16} />
                    <span>Start Session</span>
                  </button>
                  <button 
                    onClick={() => handleShareLink(session.joinLink)}
                    className="px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg flex items-center space-x-2"
                  >
                    <Share size={16} />
                    <span>Share Link</span>
                  </button>
                  <button 
                    onClick={() => handleRescheduleSession(session.id)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recordings Tab */}
        {activeTab === 'recordings' && (
          <div className="space-y-4">
            <div className="p-6 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">Recording Settings</h3>
                  <p className="text-gray-600">Configure automatic recording settings</p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="font-medium text-green-600">Auto-Recording Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Record all live sessions</span>
                    <button 
                      onClick={() => toggleRecordingSetting('recordAll')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        recordingSettings.recordAll ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        recordingSettings.recordAll ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Save to cloud storage</span>
                    <button 
                      onClick={() => toggleRecordingSetting('cloudSave')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        recordingSettings.cloudSave ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        recordingSettings.cloudSave ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Auto-generate captions</span>
                    <button 
                      onClick={() => toggleRecordingSetting('autoCaption')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        recordingSettings.autoCaption ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        recordingSettings.autoCaption ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recording Quality
                    </label>
                    <select 
                      value={recordingSettings.quality}
                      onChange={(e) => setRecordingSettings(prev => ({ ...prev, quality: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option>HD (720p)</option>
                      <option>Full HD (1080p)</option>
                      <option>4K (2160p)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Retention Period
                    </label>
                    <select 
                      value={recordingSettings.retention}
                      onChange={(e) => setRecordingSettings(prev => ({ ...prev, retention: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                      <option>Forever</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="border border-gray-200 rounded-xl p-4">
                  <div className="mb-4">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <Video className="text-gray-400" size={40} />
                    </div>
                    <h4 className="font-semibold text-gray-800">Live Session Recording #{item}</h4>
                    <p className="text-sm text-gray-600">Recorded on Dec {item + 5}, 2025</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleProcessRecording(item)}
                      className="flex-1 px-3 py-2 bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white text-sm rounded-lg"
                    >
                      Process
                    </button>
                    <button 
                      onClick={() => handleEditRecording(item)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded-lg"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Material Modal */}
      {showMaterialModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Material</h3>
              <button
                onClick={() => {
                  setShowMaterialModal(false);
                  setSelectedMaterial(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Title
                </label>
                <input
                  type="text"
                  value={selectedMaterial.title}
                  onChange={(e) => setSelectedMaterial(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  value={selectedMaterial.course}
                  onChange={(e) => setSelectedMaterial(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={selectedMaterial.type}
                  onChange={(e) => setSelectedMaterial(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="video">Video</option>
                  <option value="slides">Slides</option>
                  <option value="document">Document</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowMaterialModal(false);
                  setSelectedMaterial(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMaterial}
                className="px-4 py-2 bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Modal */}
      {showSessionModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Session</h3>
              <button
                onClick={() => {
                  setShowSessionModal(false);
                  setSelectedSession(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Title
                </label>
                <input
                  type="text"
                  value={selectedSession.title}
                  onChange={(e) => setSelectedSession(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  value={selectedSession.course}
                  onChange={(e) => setSelectedSession(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  value={selectedSession.duration}
                  onChange={(e) => setSelectedSession(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option>1 hour</option>
                  <option>1.5 hours</option>
                  <option>2 hours</option>
                  <option>3 hours</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowSessionModal(false);
                  setSelectedSession(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSession}
                className="px-4 py-2 bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}