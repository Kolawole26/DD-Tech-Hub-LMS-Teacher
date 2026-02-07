// components/lecture-management/LiveSessionsTab.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  PlayCircle,
  Calendar,
  Users,
  Edit,
  Copy,
  Share,
  Bell,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  X,
  StopCircle
} from 'lucide-react';
import { api } from '@/services/api';
import { initializeZegoCloud, leaveRoom, generateUserID, generateRoomID } from '@/utils/zegocloud';

// Simple toast component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-100 border-green-200 text-green-800' 
                : type === 'error' ? 'bg-red-100 border-red-200 text-red-800'
                : 'bg-blue-100 border-blue-200 text-blue-800';

  const icon = type === 'success' ? '✓' 
             : type === 'error' ? '✗'
             : 'ℹ';

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg ${bgColor} flex items-center space-x-2 animate-slide-in`}>
      <span className="font-bold">{icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default function LiveSessionsTab({ selectedCourse, searchQuery, courses, onScheduleLive }) {
  const [liveSessions, setLiveSessions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [error, setError] = useState('');
  const [expandedSession, setExpandedSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [startingSession, setStartingSession] = useState(null);
  const zegoInstanceRef = useRef(null);
  const containerRef = useRef(null);
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Fetch live sessions from API
  useEffect(() => {
    const fetchLiveSessions = async () => {
      setLoadingSessions(true);
      setError('');
      try {
        const response = await api.get('/live-sessions');
        
        if (response.status === 200 && response.data?.data) {
          const apiSessions = response.data.data.map(session => {
            const sessionDate = new Date(session.schedule_time);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            let status = 'scheduled';
            if (sessionDate < new Date()) {
              status = 'completed';
            } else if (sessionDate >= today && sessionDate < tomorrow) {
              status = 'upcoming';
            }
            
            return {
              id: session._id,
              title: session.title,
              course: 'Web App Development',
              scheduled: sessionDate.toLocaleString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              schedule_time: session.schedule_time,
              duration: session.duration,
              students: 0,
              status: status,
              joinLink: session.link,
              description: session.instructions,
              recording: true,
              materials: [],
              password: session.session_password,
              instructor: 'You',
              schedule_id: session.schedule_id,
              room_id: session.room_id,
              rawData: session
            };
          });
          
          setLiveSessions(apiSessions);
          setSessions(apiSessions);
        }
      } catch (err) {
        console.error('Error fetching live sessions:', err);
        setError('Failed to load live sessions. Please try again.');
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchLiveSessions();
  }, []);

  // Start a live session
  const handleStartSession = async (session) => {
    try {
      setStartingSession(session.id);
      const roomID = generateRoomID()
      console.log('Generated Room ID:', roomID);
      
      // Call API to update session status
      const response = await api.post('/live-sessions/status', {
        action: 'start',
        session_id: session.id,
        room_id: roomID
      });

      if (response.status === 200) {
        setActiveSession(session.id);
        
        // Initialize ZEGOCLOUD
        const userID = generateUserID();
        setTimeout(() => {
          initializeZegoCloud(
            containerRef.current,
            roomID,
            userID,
            'Instructor',
            {
              microphone: true,
              camera: true,
              chat: true,
              recording: true,
              maxUsers: 50,
              layout: 'Grid',
              onJoinRoom: () => {
                console.log('Session started successfully');
                showToast('Live session started successfully!', 'success');
              },
              onLeaveRoom: () => {
                handleStopSession(session.id);
              }
            }
          ).then(instance => {
            zegoInstanceRef.current = instance;
          });
        }, 100);
      } else {
        showToast('Failed to start session. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      showToast('Error starting session. Please try again.', 'error');
    } finally {
      setStartingSession(null);
    }
  };

  // Stop a live session
  const handleStopSession = async (sessionId) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;

      // Call API to update session status
      await api.post('/live-sessions/status', {
        action: 'stop',
        session_id: sessionId,
        // room_id: session.room_id
      });

      // Leave ZEGOCLOUD room
      if (zegoInstanceRef.current) {
        leaveRoom(zegoInstanceRef.current);
        zegoInstanceRef.current = null;
      }

      // Update local state
      setActiveSession(null);
      
      // Update session status to completed
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, status: 'completed' } : s
      ));

      showToast('Session ended successfully', 'success');
    } catch (error) {
      console.error('Error stopping session:', error);
      showToast('Error stopping session. Please try again.', 'error');
    }
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const handleUpdateSession = async () => {
    if (selectedSession) {
      try {
        // Call your API to update the session
        await api.put(`/live-sessions/${selectedSession.id}`, {
          title: selectedSession.title,
          course: selectedSession.course,
          duration: selectedSession.duration
        });
        
        setSessions(prev =>
          prev.map(s =>
            s.id === selectedSession.id
              ? { ...s, ...selectedSession }
              : s
          )
        );
        showToast('Session updated successfully!', 'success');
      } catch (error) {
        showToast('Failed to update session. Please try again.', 'error');
      }
    }
    setShowSessionModal(false);
    setSelectedSession(null);
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    showToast('Join link copied to clipboard!', 'success');
  };

  const handleShareLink = async (link) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Live Session',
          text: 'Join my live teaching session',
          url: link,
        });
        showToast('Session shared successfully!', 'success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          showToast('Failed to share session. Please try again.', 'error');
        }
      }
    } else {
      handleCopyLink(link);
    }
  };

  const handleRescheduleSession = async (sessionId) => {
    const newDate = prompt('Enter new date and time (YYYY-MM-DDTHH:MM):');
    if (newDate) {
      try {
        await api.put(`/live-sessions/${sessionId}`, {
          schedule_time: newDate
        });
        
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
                  schedule_time: newDate,
                  status: 'scheduled'
                }
              : session
          )
        );
        showToast('Session rescheduled successfully!', 'success');
      } catch (error) {
        showToast('Failed to reschedule session. Please try again.', 'error');
      }
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter(session => 
    selectedCourse === 'all' || session.course === courses.find(c => c.id === selectedCourse)?.name
  );

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

      {/* ZEGOCLOUD Container (hidden when not in use) */}
      {activeSession && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
            <h2 className="text-xl font-bold">
              {sessions.find(s => s.id === activeSession)?.title}
            </h2>
            <button
              onClick={() => handleStopSession(activeSession)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center space-x-2"
            >
              <StopCircle size={16} />
              <span>End Session</span>
            </button>
          </div>
          <div 
            ref={containerRef}
            className="flex-1"
            style={{ minHeight: 'calc(100vh - 64px)' }}
          />
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {loadingSessions ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live sessions...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Live Sessions</h3>
          <p className="text-gray-600 mb-4">You haven't scheduled any live sessions yet.</p>
          <button
            onClick={onScheduleLive}
            className="px-6 py-3 bg-primary-dark hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
          >
            Schedule Your First Session
          </button>
        </div>
      ) : (
        filteredSessions.map((session) => (
          <div key={session.id} className="border border-gray-200 rounded-xl p-6 hover:border-primary-light transition-colors bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-gray-800 text-lg">{session.title}</h3>
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
                  className="p-2 text-gray-400 hover:text-primary-dark rounded-lg hover:bg-blue-50"
                  title="Copy Join Link"
                >
                  <Copy size={16} />
                </button>
                <button 
                  onClick={() => handleShareLink(session.joinLink)}
                  className="p-2 text-gray-400 hover:text-primary-dark rounded-lg hover:bg-blue-50"
                  title="Share Session"
                >
                  <Share size={16} />
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
                <p className="text-sm text-gray-600">Room ID</p>
                <p className="font-semibold text-sm">{session.room_id}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {new Date(session.schedule_time).toDateString() === new Date().toDateString() && (
                <button 
                  onClick={() => handleStartSession(session)}
                  disabled={startingSession === session.id || activeSession}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {startingSession === session.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Starting...</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle size={16} />
                      <span>Start Session</span>
                    </>
                  )}
                </button>
              )}
              {activeSession === session.id && (
                <button 
                  onClick={() => handleStopSession(session.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center space-x-2"
                >
                  <StopCircle size={16} />
                  <span>End Session</span>
                </button>
              )}
              {session.status === 'scheduled' && (
                <button 
                  onClick={() => { /* Handle set reminder */ }}
                  className="px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 font-semibold rounded-lg flex items-center space-x-2"
                >
                  <Bell size={16} />
                  <span>Set Reminder</span>
                </button>
              )}
              {session.status === 'scheduled' && (
                <button 
                  onClick={() => handleRescheduleSession(session.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold rounded-lg flex items-center space-x-2"
                >
                  <Calendar size={16} />
                  <span>Reschedule</span>
                </button>
              )}
            </div>
          </div>
        ))
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  value={selectedSession.course}
                  onChange={(e) => setSelectedSession(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
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
    </div>
  );
}