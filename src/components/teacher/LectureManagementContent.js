'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Video, 
  FileText, 
  PlayCircle, 
  Clock, 
  Calendar,
  Users,
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
  Headphones,
  Maximize2,
  Minimize2,
  Volume2,
  Camera,
  MessageSquare,
  Scissors,
  FileVideo,
  Play,
  Pause,
  Sparkles,
  RotateCcw,
  Save,
  Folder,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  EyeOff,
  MicOff,
  Monitor,
  AlertTriangle
} from 'lucide-react';

export default function LectureManagementContent() {
  const [activeTab, setActiveTab] = useState('materials');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSession, setExpandedSession] = useState(null);
  
  // Materials state
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
      description: 'Basic concepts of web development including HTML, CSS, and JavaScript',
      tags: ['beginner', 'html', 'css', 'javascript'],
      favorite: false
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
      description: 'Complete guide to modern CSS layout techniques',
      tags: ['css', 'layout', 'responsive'],
      favorite: true
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
      description: 'Core JavaScript concepts and best practices',
      tags: ['javascript', 'es6', 'fundamentals'],
      favorite: false
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
      description: 'Different approaches to state management in React applications',
      tags: ['react', 'state', 'redux'],
      favorite: true
    },
  ]);

  // Sessions state
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
      description: 'Deep dive into advanced JavaScript concepts including closures, prototypes, and async/await',
      recording: true,
      materials: ['slides', 'code-examples'],
      password: 'js2025'
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
      description: 'Complete guide to CSS Grid layout with practical examples',
      recording: true,
      materials: ['slides', 'cheatsheet'],
      password: 'cssgrid'
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
      description: 'Exploring different state management patterns in modern React applications',
      recording: true,
      materials: ['slides', 'demo-project'],
      password: 'react2025'
    },
  ]);

  // Recordings state
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      title: 'JavaScript Fundamentals Live Session',
      course: 'Web App Development',
      date: 'Dec 12, 2025',
      duration: '2h 15m',
      size: '1.8 GB',
      status: 'processed', // processed, processing, raw
      thumbnail: '/thumb1.jpg',
      views: 156,
      captionStatus: 'available',
      downloadCount: 45,
      description: 'Complete JavaScript fundamentals session covering variables, functions, and DOM manipulation',
      resolution: '1080p',
      audioQuality: 'High',
      chapters: [
        { time: '0:00', title: 'Introduction' },
        { time: '15:30', title: 'Variables & Data Types' },
        { time: '45:20', title: 'Functions & Scope' },
        { time: '1:15:00', title: 'DOM Manipulation' },
      ],
      processing: {
        progress: 100,
        status: 'complete',
        steps: [
          { name: 'Video Optimization', completed: true },
          { name: 'Audio Enhancement', completed: true },
          { name: 'Caption Generation', completed: true },
          { name: 'Chapter Detection', completed: true }
        ]
      },
      favorite: false
    },
    {
      id: 2,
      title: 'CSS Grid Workshop',
      course: 'Web App Development',
      date: 'Dec 10, 2025',
      duration: '1h 45m',
      size: '1.2 GB',
      status: 'processing',
      thumbnail: '/thumb2.jpg',
      views: 89,
      captionStatus: 'processing',
      downloadCount: 23,
      description: 'Interactive workshop on CSS Grid layout techniques',
      resolution: '720p',
      audioQuality: 'Medium',
      chapters: [],
      processing: {
        progress: 65,
        status: 'in-progress',
        steps: [
          { name: 'Video Optimization', completed: true },
          { name: 'Audio Enhancement', completed: true },
          { name: 'Caption Generation', completed: false },
          { name: 'Chapter Detection', completed: false }
        ]
      },
      favorite: true
    },
    {
      id: 3,
      title: 'React Hooks Deep Dive',
      course: 'React Masterclass',
      date: 'Dec 8, 2025',
      duration: '2h 30m',
      size: '2.1 GB',
      status: 'raw',
      thumbnail: '/thumb3.jpg',
      views: 112,
      captionStatus: 'none',
      downloadCount: 31,
      description: 'Comprehensive guide to React Hooks and their practical applications',
      resolution: '1080p',
      audioQuality: 'High',
      chapters: [],
      processing: {
        progress: 0,
        status: 'pending',
        steps: [
          { name: 'Video Optimization', completed: false },
          { name: 'Audio Enhancement', completed: false },
          { name: 'Caption Generation', completed: false },
          { name: 'Chapter Detection', completed: false }
        ]
      },
      favorite: false
    },
    {
      id: 4,
      title: 'Node.js Backend Basics',
      course: 'Full Stack Development',
      date: 'Dec 5, 2025',
      duration: '3h 10m',
      size: '2.5 GB',
      status: 'processed',
      thumbnail: '/thumb4.jpg',
      views: 204,
      captionStatus: 'available',
      downloadCount: 67,
      description: 'Introduction to Node.js and building REST APIs',
      resolution: '1080p',
      audioQuality: 'High',
      chapters: [
        { time: '0:00', title: 'Introduction to Node.js' },
        { time: '25:45', title: 'Express Framework' },
        { time: '1:30:20', title: 'Database Connection' },
        { time: '2:15:00', title: 'REST API Design' },
      ],
      processing: {
        progress: 100,
        status: 'complete',
        steps: [
          { name: 'Video Optimization', completed: true },
          { name: 'Audio Enhancement', completed: true },
          { name: 'Caption Generation', completed: true },
          { name: 'Chapter Detection', completed: true }
        ]
      },
      favorite: true
    },
  ]);

  // Modals and selections
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  
  // Recording settings
  const [recordingSettings, setRecordingSettings] = useState({
    recordAll: true,
    cloudSave: true,
    autoCaption: false,
    quality: 'Full HD (1080p)',
    retention: '90 days',
    format: 'mp4',
    autoStart: true,
    audioBitrate: '128kbps',
    videoBitrate: '5000kbps',
    storageLocation: 'cloud',
    watermark: false,
    autoPublish: false
  });

  // Live session state
  const [liveStats, setLiveStats] = useState({
    connected: 45,
    audio: true,
    video: true,
    screenShare: false,
    isFullscreen: false,
    isMuted: false,
    bandwidth: '4.2 Mbps',
    latency: '45ms',
    participants: [
      { id: 1, name: 'John Doe', role: 'student', connected: true },
      { id: 2, name: 'Jane Smith', role: 'student', connected: true },
      { id: 3, name: 'Bob Wilson', role: 'student', connected: true },
    ]
  });

  // Editor state
  const [editingMode, setEditingMode] = useState('trim'); // trim, split, merge, caption
  const [editorProgress, setEditorProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(7200); // 2 hours in seconds
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(7200);
  const [captionText, setCaptionText] = useState('');
  const [chapterMarkers, setChapterMarkers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingQueue, setProcessingQueue] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'all',
    status: 'all'
  });

  const fileInputRef = useRef(null);
  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 'cs101', name: 'Web App Development' },
    { id: 'cs201', name: 'Advanced JavaScript' },
    { id: 'cs301', name: 'React Masterclass' },
    { id: 'cs401', name: 'Full Stack Development' },
  ];

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            
            const newId = materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1;
            const fileType = file.type.includes('video') ? 'video' : 
                           file.type.includes('pdf') ? 'document' : 
                           file.type.includes('powerpoint') ? 'slides' : 'document';
            
            const newMaterial = {
              id: newId,
              title: file.name.replace(/\.[^/.]+$/, ""),
              course: 'Web App Development',
              type: fileType,
              duration: 'Unknown',
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadDate: new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }),
              views: 0,
              downloads: 0,
              description: `Uploaded ${file.name}`,
              tags: [],
              favorite: false
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

  // Live session handlers
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
        return { 
          ...prev, 
          connected: prev.connected + 1,
          participants: [...prev.participants, {
            id: prev.participants.length + 1,
            name: `Student ${prev.participants.length + 1}`,
            role: 'student',
            connected: true
          }]
        };
      });
    }, 500);
  };

  const stopLiveSession = () => {
    setIsLive(false);
    
    // Create a new recording from the live session
    const newRecordingId = recordings.length > 0 ? Math.max(...recordings.map(r => r.id)) + 1 : 1;
    const newRecording = {
      id: newRecordingId,
      title: `Live Session ${new Date().toLocaleDateString()}`,
      course: 'Web App Development',
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      duration: '1h 30m',
      size: '1.5 GB',
      status: 'raw',
      thumbnail: '/thumb-live.jpg',
      views: 0,
      captionStatus: 'none',
      downloadCount: 0,
      description: 'Live session recording',
      resolution: '1080p',
      audioQuality: 'High',
      chapters: [],
      processing: {
        progress: 0,
        status: 'pending',
        steps: [
          { name: 'Video Optimization', completed: false },
          { name: 'Audio Enhancement', completed: false },
          { name: 'Caption Generation', completed: false },
          { name: 'Chapter Detection', completed: false }
        ]
      },
      favorite: false
    };
    
    setRecordings(prev => [newRecording, ...prev]);
    alert('Live session ended and recorded!');
  };

  const toggleLiveControl = (control) => {
    setLiveStats(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
    
    const action = !liveStats[control] ? 'enabled' : 'disabled';
    alert(`${control} ${action}`);
  };

  // Material handlers
  const handleDeleteMaterial = (id) => {
    if (confirm('Are you sure you want to delete this lecture material?')) {
      setMaterials(prev => prev.filter(material => material.id !== id));
      alert('Lecture material deleted successfully.');
    }
  };

  const handleEditMaterial = (material) => {
    setSelectedMaterial(material);
    setShowMaterialModal(true);
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

  const handlePreviewMaterial = (material) => {
    alert(`Previewing: ${material.title}\n\nDescription: ${material.description || 'No description'}\nType: ${material.type}\nCourse: ${material.course}\nDuration: ${material.duration}`);
  };

  const handleDownloadMaterial = (material) => {
    const content = `Lecture Material: ${material.title}\nCourse: ${material.course}\nType: ${material.type}\nDuration: ${material.duration}\nUploaded: ${material.uploadDate}\nDescription: ${material.description || ''}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${material.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    
    setMaterials(prev =>
      prev.map(m =>
        m.id === material.id
          ? { ...m, downloads: m.downloads + 1 }
          : m
      )
    );
  };

  // Session handlers
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
        description: '',
        recording: true,
        materials: [],
        password: Math.random().toString(36).substr(2, 6)
      };
      
      setSessions(prev => [newSession, ...prev]);
      alert(`Live session scheduled for ${date} on "${topic}"`);
    }
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
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

  const handleStartSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    alert(`Starting session: ${session?.title}`);
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

  // Recording handlers
  const handleProcessRecording = (recordingId) => {
    const recording = recordings.find(r => r.id === recordingId);
    if (!recording) return;
    
    setIsProcessing(true);
    setProcessingQueue(prev => [...prev, recordingId]);
    
    const interval = setInterval(() => {
      setRecordings(prev => prev.map(r => {
        if (r.id === recordingId) {
          const newProgress = Math.min(r.processing.progress + 10, 100);
          
          if (newProgress === 100) {
            setIsProcessing(false);
            setProcessingQueue(prevQueue => prevQueue.filter(id => id !== recordingId));
            clearInterval(interval);
            
            return {
              ...r,
              status: 'processed',
              captionStatus: 'available',
              processing: {
                ...r.processing,
                progress: 100,
                status: 'complete',
                steps: r.processing.steps.map(step => ({ ...step, completed: true }))
              }
            };
          }
          
          return {
            ...r,
            processing: {
              ...r.processing,
              progress: newProgress,
              status: 'in-progress'
            }
          };
        }
        return r;
      }));
    }, 500);
    
    alert(`Processing recording ${recording.title}...\nGenerating captions and optimizing video quality.`);
  };

  const handleEditRecording = (recording) => {
    setSelectedRecording(recording);
    setShowEditor(true);
    setEditingMode('trim');
    setCurrentTime(0);
    setTrimStart(0);
    setTrimEnd(duration);
    setChapterMarkers(recording.chapters || []);
  };

  const handleDeleteRecording = (recordingId) => {
    if (confirm('Are you sure you want to delete this recording?')) {
      setRecordings(prev => prev.filter(r => r.id !== recordingId));
      alert('Recording deleted successfully.');
    }
  };

  const handleDownloadRecording = (recording) => {
    const content = `Recording: ${recording.title}\nCourse: ${recording.course}\nDate: ${recording.date}\nDuration: ${recording.duration}\nSize: ${recording.size}\nResolution: ${recording.resolution}\nAudio Quality: ${recording.audioQuality}\nDescription: ${recording.description}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.title.replace(/\s+/g, '_')}_recording.txt`;
    a.click();
    
    setRecordings(prev =>
      prev.map(r =>
        r.id === recording.id
          ? { ...r, downloadCount: r.downloadCount + 1 }
          : r
      )
    );
  };

  const handleExportRecording = (recording, format) => {
    alert(`Exporting ${recording.title} as ${format.toUpperCase()}...\nThis would convert the video to ${format} format for better compatibility.`);
    
    if (format !== 'mp4') {
      setRecordings(prev =>
        prev.map(r =>
          r.id === recording.id
            ? { ...r, exportFormat: format }
            : r
        )
      );
    }
  };

  // Editor functions
  const handleAddChapter = () => {
    if (currentTime > 0 && captionText.trim()) {
      const newMarker = {
        time: currentTime,
        title: captionText,
        formattedTime: formatTime(currentTime)
      };
      setChapterMarkers(prev => [...prev, newMarker].sort((a, b) => a.time - b.time));
      setCaptionText('');
      alert('Chapter marker added!');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTrimApply = () => {
    if (selectedRecording) {
      setRecordings(prev =>
        prev.map(r =>
          r.id === selectedRecording.id
            ? {
                ...r,
                duration: `${Math.floor((trimEnd - trimStart) / 60)}m`,
                chapters: chapterMarkers.map(marker => ({
                  time: marker.formattedTime,
                  title: marker.title
                }))
              }
            : r
        )
      );
      alert('Trim applied successfully! Recording has been trimmed.');
    }
  };

  const handleEditorSave = () => {
    if (selectedRecording) {
      setRecordings(prev =>
        prev.map(r =>
          r.id === selectedRecording.id
            ? {
                ...r,
                chapters: chapterMarkers.map(marker => ({
                  time: marker.formattedTime,
                  title: marker.title
                })),
                status: 'processed',
                processing: {
                  ...r.processing,
                  progress: 100,
                  status: 'complete'
                }
              }
            : r
        )
      );
      alert('Changes saved successfully!');
      setShowEditor(false);
      setSelectedRecording(null);
    }
  };

  const toggleRecordingSetting = (setting) => {
    setRecordingSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const toggleFullscreen = () => {
    setLiveStats(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen
    }));
    alert(liveStats.isFullscreen ? 'Exited fullscreen' : 'Entered fullscreen');
  };

  // Utility functions
  const toggleFavoriteMaterial = (materialId) => {
    setMaterials(prev =>
      prev.map(material =>
        material.id === materialId
          ? { ...material, favorite: !material.favorite }
          : material
      )
    );
  };

  const toggleFavoriteRecording = (recordingId) => {
    setRecordings(prev =>
      prev.map(recording =>
        recording.id === recordingId
          ? { ...recording, favorite: !recording.favorite }
          : recording
      )
    );
  };

  const filteredMaterials = materials.filter(material => {
    if (selectedCourse !== 'all' && material.course !== courses.find(c => c.id === selectedCourse)?.name) return false;
    if (searchQuery && !material.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !material.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.type !== 'all' && material.type !== filters.type) return false;
    return true;
  });

  const filteredSessions = sessions.filter(session => 
    selectedCourse === 'all' || session.course === courses.find(c => c.id === selectedCourse)?.name
  );

  const filteredRecordings = recordings.filter(recording => {
    if (selectedCourse !== 'all' && recording.course !== courses.find(c => c.id === selectedCourse)?.name) return false;
    if (searchQuery && !recording.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !recording.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.status !== 'all' && recording.status !== filters.status) return false;
    return true;
  });

  // Editor Component
  const EditorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Video Editor</h3>
            <p className="text-gray-600">Editing: {selectedRecording?.title}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setShowEditor(false);
                setSelectedRecording(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Preview */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-800 rounded-lg mb-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="text-gray-400" size={60} />
              </div>
              {/* Timeline Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <span className="text-white font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 size={20} className="text-white" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-24"
                      defaultValue="80"
                    />
                  </div>
                </div>
                
                {/* Timeline */}
                <div className="relative h-2 bg-gray-700 rounded-full cursor-pointer">
                  <div
                    className="absolute h-full bg-blue-500 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  />
                  
                  {/* Trim Handles */}
                  <div className="absolute h-6 -top-2" style={{ left: `${(trimStart / duration) * 100}%` }}>
                    <div className="w-1 h-full bg-blue-400" />
                  </div>
                  <div className="absolute h-6 -top-2" style={{ left: `${(trimEnd / duration) * 100}%` }}>
                    <div className="w-1 h-full bg-red-400" />
                  </div>
                  
                  {/* Chapter Markers */}
                  {chapterMarkers.map((marker, index) => (
                    <div
                      key={index}
                      className="absolute w-2 h-4 -top-1 bg-yellow-400 rounded"
                      style={{ left: `${(marker.time / duration) * 100}%` }}
                      title={marker.title}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Editor Controls */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => setEditingMode('trim')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    editingMode === 'trim' ? 'bg-blue-100 text-primary-light border border-blue-200' : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  <Scissors size={16} />
                  <span>Trim</span>
                </button>
                <button
                  onClick={() => setEditingMode('caption')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    editingMode === 'caption' ? 'bg-blue-100 text-primary-light border border-blue-200' : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  <MessageSquare size={16} />
                  <span>Captions</span>
                </button>
                <button
                  onClick={() => setEditingMode('chapters')}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    editingMode === 'chapters' ? 'bg-blue-100 text-primary-light border border-blue-200' : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  <FileText size={16} />
                  <span>Chapters</span>
                </button>
              </div>

              {editingMode === 'trim' && (
                <div>
                  <h4 className="font-semibold mb-3">Trim Video</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Start Time: {formatTime(trimStart)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={trimStart}
                        onChange={(e) => setTrimStart(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        End Time: {formatTime(trimEnd)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={trimEnd}
                        onChange={(e) => setTrimEnd(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <button
                      onClick={handleTrimApply}
                      className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary-light transition-colors"
                    >
                      Apply Trim
                    </button>
                  </div>
                </div>
              )}

              {editingMode === 'chapters' && (
                <div>
                  <h4 className="font-semibold mb-3">Chapter Markers</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={captionText}
                        onChange={(e) => setCaptionText(e.target.value)}
                        placeholder="Chapter title"
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddChapter}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Add Chapter
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {chapterMarkers.map((marker, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{marker.formattedTime}</span>
                            <span className="font-medium">{marker.title}</span>
                          </div>
                          <button
                            onClick={() => setChapterMarkers(prev => prev.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Processing Status & Export */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-800">Processing Status</h4>
              <div className="space-y-2">
                {selectedRecording?.processing.steps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{step.name}</span>
                    {step.completed ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <Clock size={16} className="text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">Overall Progress</span>
                  <span className="text-sm font-semibold text-gray-800">{selectedRecording?.processing.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${selectedRecording?.processing.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-800">Export Options</h4>
              <div className="space-y-3">
                <button
                  onClick={() => handleExportRecording(selectedRecording, 'mp4')}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="font-medium text-gray-800">MP4 Format</div>
                  <div className="text-sm text-gray-600">Standard video format</div>
                </button>
                <button
                  onClick={() => handleExportRecording(selectedRecording, 'webm')}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="font-medium text-gray-800">WebM Format</div>
                  <div className="text-sm text-gray-600">Web-optimized format</div>
                </button>
                <button
                  onClick={() => handleExportRecording(selectedRecording, 'gif')}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <div className="font-medium text-gray-800">GIF Preview</div>
                  <div className="text-sm text-gray-600">Create preview GIF</div>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold mb-3 text-gray-800">Actions</h4>
              <div className="space-y-3">
                <button
                  onClick={handleEditorSave}
                  className="w-full px-4 py-3 bg-primary-dark text-white rounded-lg hover:bg-primary-light transition-colors flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => handleProcessRecording(selectedRecording.id)}
                  disabled={selectedRecording?.status === 'processed'}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Sparkles size={16} />
                  <span>Process Recording</span>
                </button>
                <button
                  onClick={() => handleDownloadRecording(selectedRecording)}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Lecture Management</h1>
            <p className="text-blue-100">Upload materials, conduct live sessions, and manage recordings</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={startLiveSession}
              disabled={isLive}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <PlayCircle size={20} />
              <span>{isLive ? 'Live Now' : 'Start Live Session'}</span>
            </button>
            <button
              onClick={handleScheduleLive}
              className="px-6 py-3 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg transition-colors flex items-center space-x-2"
            >
              <Calendar size={20} />
              <span>Schedule Live</span>
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
                className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                End Session
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => toggleLiveControl('audio')}
                className={`p-2 rounded-full ${liveStats.audio ? 'bg-white/20' : 'bg-red-800'}`}
              >
                {liveStats.audio ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <div>
                <p className="text-sm opacity-90">Microphone</p>
                <span className="font-semibold">{liveStats.audio ? 'Connected' : 'Muted'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => toggleLiveControl('video')}
                className={`p-2 rounded-full ${liveStats.video ? 'bg-white/20' : 'bg-red-800'}`}
              >
                {liveStats.video ? <Camera size={20} /> : <EyeOff size={20} />}
              </button>
              <div>
                <p className="text-sm opacity-90">Camera</p>
                <span className="font-semibold">{liveStats.video ? 'Active' : 'Off'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => toggleLiveControl('screenShare')}
                className={`p-2 rounded-full ${liveStats.screenShare ? 'bg-white/20' : 'bg-red-800'}`}
              >
                <Monitor size={20} />
              </button>
              <div>
                <p className="text-sm opacity-90">Screen Share</p>
                <span className="font-semibold">{liveStats.screenShare ? 'Sharing' : 'Ready'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                {liveStats.isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <div>
                <p className="text-sm opacity-90">Fullscreen</p>
                <span className="font-semibold">{liveStats.isFullscreen ? 'On' : 'Off'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex space-x-1 mb-4 md:mb-0 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'materials'
                  ? 'bg-white text-primary-dark shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Lecture Materials
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'live'
                  ? 'bg-white text-primary-dark shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Live Sessions
            </button>
            <button
              onClick={() => setActiveTab('recordings')}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'recordings'
                  ? 'bg-white text-primary-dark shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Recordings
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors"
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
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-800">Uploading file...</span>
              <span className="text-blue-800">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
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
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
              >
                <option value="all">All Types</option>
                <option value="video">Video</option>
                <option value="slides">Slides</option>
                <option value="document">Document</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <div key={material.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${
                        material.type === 'video' ? 'bg-red-100' :
                        material.type === 'slides' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {material.type === 'video' ? (
                          <Video className="text-red-600" size={20} />
                        ) : material.type === 'slides' ? (
                          <FileText className="text-primary-dark" size={20} />
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
                        onClick={() => toggleFavoriteMaterial(material.id)}
                        className={`p-1 ${material.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                        title={material.favorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {material.favorite ? '★' : '☆'}
                      </button>
                      <button 
                        onClick={() => handleEditMaterial(material)}
                        className="p-1 text-gray-400 hover:text-primary-dark rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {material.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                  )}

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
                      className="flex-1 px-3 py-2 bg-primary-dark hover:bg-primary-light text-white text-sm rounded-lg flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Eye size={14} />
                      <span>Preview</span>
                    </button> */}
                    <button 
                      onClick={() => handleDownloadMaterial(material)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded-lg flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Download size={14} />
                      <span>Download</span>
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
              <div key={session.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">{session.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        session.status === 'upcoming' ? 'bg-red-100 text-red-800' :
                        session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{session.course}</p>
                    {session.description && (
                      <p className="text-sm text-gray-500">{session.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditSession(session)}
                      className="p-2 text-gray-400 hover:text-primary-dark rounded-lg hover:bg-blue-50"
                      title="Edit Session"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleCopyLink(session.joinLink)}
                      className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                      title="Copy Join Link"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                  className="flex items-center text-primary-dark hover:text-blue-800 text-sm mb-4"
                >
                  {expandedSession === session.id ? (
                    <>
                      <ChevronUp size={16} className="mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-1" />
                      Show Details
                    </>
                  )}
                </button>

                {expandedSession === session.id && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Session Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Session Password:</span>
                            <span className="font-mono font-medium">{session.password}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Auto-Recording:</span>
                            <span className={`font-medium ${session.recording ? 'text-green-600' : 'text-gray-600'}`}>
                              {session.recording ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          {session.materials && session.materials.length > 0 && (
                            <div>
                              <span className="text-gray-600">Materials:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {session.materials.map((material, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {material}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Join Instructions</h4>
                        <div className="text-sm text-gray-600 space-y-2">
                          <p>1. Click the "Copy Link" button to copy the join link</p>
                          <p>2. Share the link with your students</p>
                          <p>3. Use the password: <span className="font-mono font-medium">{session.password}</span></p>
                          <p>4. Start the session 5 minutes before the scheduled time</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                      className="text-primary-dark hover:text-blue-800 font-medium flex items-center text-sm"
                    >
                      <Copy size={14} className="mr-1" />
                      Copy Link
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleStartSession(session.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <PlayCircle size={16} />
                    <span>Start Session</span>
                  </button>
                  <button 
                    onClick={() => handleShareLink(session.joinLink)}
                    className="px-4 py-2 border border-primary-dark text-primary-dark hover:bg-blue-50 font-semibold rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Share size={16} />
                    <span>Share Link</span>
                  </button>
                  <button 
                    onClick={() => handleRescheduleSession(session.id)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
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
          <div className="space-y-6">
            {/* Recording Settings */}
            <div className="p-6 border border-gray-200 rounded-xl bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Recording Settings</h3>
                  <p className="text-gray-600">Configure automatic recording settings</p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="font-medium text-green-600">Auto-Recording Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                      <option>Forever</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format
                    </label>
                    <select 
                      value={recordingSettings.format}
                      onChange={(e) => setRecordingSettings(prev => ({ ...prev, format: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>mp4</option>
                      <option>webm</option>
                      <option>mov</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Auto-start recording</span>
                    <button 
                      onClick={() => toggleRecordingSetting('autoStart')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        recordingSettings.autoStart ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        recordingSettings.autoStart ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Queue */}
            {processingQueue.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="text-primary-dark" size={20} />
                    <h4 className="font-semibold text-blue-800">Processing Queue</h4>
                  </div>
                  <span className="text-sm text-primary-dark">
                    {processingQueue.length} recording{processingQueue.length !== 1 ? 's' : ''} in queue
                  </span>
                </div>
                <div className="space-y-2">
                  {processingQueue.map(recordingId => {
                    const recording = recordings.find(r => r.id === recordingId);
                    if (!recording) return null;
                    
                    return (
                      <div key={recordingId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                        <div>
                          <div className="font-medium text-gray-800">{recording.title}</div>
                          <div className="text-sm text-gray-600">{recording.course}</div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-32">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{recording.processing.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${recording.processing.progress}%` }}
                              />
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            recording.processing.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {recording.processing.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
              </div>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="processed">Processed</option>
                <option value="processing">Processing</option>
                <option value="raw">Raw</option>
              </select>
            </div>

            {/* Recordings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecordings.map((recording) => (
                <div key={recording.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 line-clamp-1">{recording.title}</h4>
                      <p className="text-sm text-gray-600">{recording.course}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => toggleFavoriteRecording(recording.id)}
                        className={`p-1 ${recording.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                        title={recording.favorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {recording.favorite ? '★' : '☆'}
                      </button>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        recording.status === 'processed' ? 'bg-green-100 text-green-800' :
                        recording.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {recording.status}
                      </span>
                    </div>
                  </div>

                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="text-gray-400" size={40} />
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {recording.duration}
                    </div>
                    {recording.captionStatus === 'available' && (
                      <div className="absolute bottom-2 right-2 bg-primary-dark text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                        <MessageSquare size={10} />
                        <span>CC</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {recording.resolution}
                    </div>
                  </div>

                  {recording.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recording.description}</p>
                  )}

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Date Recorded</span>
                      <span className="font-medium">{recording.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>File Size</span>
                      <span className="font-medium">{recording.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Views/Downloads</span>
                      <span className="font-medium">{recording.views}/{recording.downloadCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Processing</span>
                      <div className="w-24">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              recording.processing.progress === 100 ? 'bg-green-500' :
                              recording.processing.progress > 0 ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${recording.processing.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleProcessRecording(recording.id)}
                      disabled={recording.status === 'processed' || recording.status === 'processing'}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Sparkles size={14} />
                      <span>Process</span>
                    </button>
                    {/* <button 
                      onClick={() => handleEditRecording(recording)}
                      className="flex-1 px-3 py-2 bg-primary-dark hover:bg-primary-light text-white text-sm rounded-lg flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button> */}
                    <button 
                      onClick={() => handleDownloadRecording(recording)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                  </div>

                  {/* Chapter Preview if available */}
                  {recording.chapters && recording.chapters.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-xs font-medium text-gray-500 mb-2 flex items-center justify-between">
                        <span>Chapters</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{recording.chapters.length} chapters</span>
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {recording.chapters.slice(0, 3).map((chapter, idx) => (
                          <div key={idx} className="flex text-xs text-gray-600 hover:bg-gray-50 p-1 rounded">
                            <span className="w-12 font-mono">{chapter.time}</span>
                            <span className="truncate">{chapter.title}</span>
                          </div>
                        ))}
                        {recording.chapters.length > 3 && (
                          <div className="text-xs text-gray-500 text-center pt-1">
                            +{recording.chapters.length - 3} more chapters
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  value={selectedMaterial.course}
                  onChange={(e) => setSelectedMaterial(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMaterial}
                className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg transition-colors"
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  value={selectedSession.course}
                  onChange={(e) => setSelectedSession(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSession}
                className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && selectedRecording && <EditorModal />}
    </div>
  );
}