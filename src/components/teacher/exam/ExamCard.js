import { 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  BarChart3,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Eye,
  Download,
  Send
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const statusConfig = {
  upcoming: { 
    color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', 
    icon: AlertCircle, 
    label: 'Upcoming',
    actionColor: 'bg-yellow-500 hover:bg-yellow-600',
    actionLabel: 'Send Reminder',
    actionIcon: Send
  },
  active: { 
    color: 'bg-green-100 text-green-800 border border-green-200', 
    icon: CheckCircle, 
    label: 'Active',
    actionColor: 'bg-green-600 hover:bg-green-700',
    actionLabel: 'View Submissions',
    actionIcon: Eye
  },
  completed: { 
    color: 'bg-blue-100 text-blue-800 border border-blue-200', 
    icon: Clock, 
    label: 'Completed',
    actionColor: 'bg-blue-600 hover:bg-blue-700',
    actionLabel: 'Grade Now',
    actionIcon: BarChart3
  },
  graded: { 
    color: 'bg-purple-100 text-purple-800 border border-purple-200', 
    icon: BarChart3, 
    label: 'Graded',
    actionColor: 'bg-purple-600 hover:bg-purple-700',
    actionLabel: 'View Results',
    actionIcon: BarChart3
  },
};

const typeConfig = {
  written: { color: 'bg-blue-50 text-blue-700', icon: FileText },
  quiz: { color: 'bg-green-50 text-green-700', icon: FileText },
  practical: { color: 'bg-orange-50 text-orange-700', icon: FileText },
  project: { color: 'bg-purple-50 text-purple-700', icon: FileText },
  assignment: { color: 'bg-indigo-50 text-indigo-700', icon: FileText },
};

export default function ExamCard({ exam, onDelete, onEdit, onViewDetails, onStatusChange, onGrade, onExportResults }) {
  const [showActions, setShowActions] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const actionsRef = useRef(null);

  const StatusIcon = statusConfig[exam.status].icon;
  const TypeIcon = typeConfig[exam.type].icon;
  const ActionIcon = statusConfig[exam.status].actionIcon;

  const getSubmissionRate = () => {
    if (exam.students === 0) return 0;
    return Math.round((exam.submissions / exam.students) * 100);
  };

  const getGradingProgress = () => {
    if (!exam.graded || exam.submissions === 0) return 0;
    return Math.round((exam.graded / exam.submissions) * 100);
  };

  const handleActionClick = (action) => {
    switch(action) {
      case 'view':
        onViewDetails(exam);
        break;
      case 'edit':
        onEdit(exam);
        break;
      case 'grade':
        onGrade(exam.id);
        break;
      case 'export':
        onExportResults(exam.id);
        break;
      case 'delete':
        onDelete(exam.id);
        break;
      case 'activate':
        if (exam.status === 'upcoming') {
          onStatusChange(exam.id, 'active');
        } else if (exam.status === 'active') {
          onStatusChange(exam.id, 'completed');
        } else if (exam.status === 'completed') {
          onStatusChange(exam.id, 'graded');
        }
        break;
      case 'reminder':
        setShowReminderModal(true);
        break;
    }
    setShowActions(false);
  };

  const handleSendReminder = () => {
    if (!reminderMessage.trim()) {
      alert('Please enter a reminder message');
      return;
    }

    // Simulate sending reminder
    setTimeout(() => {
      alert(`Reminder sent to ${exam.students} students for "${exam.title}"`);
      setShowReminderModal(false);
      setReminderMessage('');
    }, 1000);
  };

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showActions]);

  const actionMenuItems = [
    { label: 'View Details', icon: Eye, action: 'view' },
    { label: 'Edit Exam', icon: Edit2, action: 'edit' },
    exam.status === 'upcoming' && { label: 'Send Reminder', icon: Send, action: 'reminder' },
    (exam.status === 'active' || exam.status === 'completed') && { 
      label: exam.status === 'active' ? 'View Submissions' : 'Grade Submissions', 
      icon: BarChart3, 
      action: 'grade' 
    },
    exam.status === 'graded' && { label: 'Export Results', icon: Download, action: 'export' },
    { label: 'Delete Exam', icon: Trash2, action: 'delete', destructive: true },
  ].filter(Boolean);

  const getStatusAction = () => {
    if (exam.status === 'upcoming') {
      return { 
        label: 'Activate Exam', 
        onClick: () => handleActionClick('activate'),
        color: 'bg-green-600 hover:bg-green-700'
      };
    } else if (exam.status === 'active') {
      return { 
        label: 'Mark as Completed', 
        onClick: () => handleActionClick('activate'),
        color: 'bg-blue-600 hover:bg-blue-700'
      };
    } else if (exam.status === 'completed') {
      return { 
        label: 'Mark as Graded', 
        onClick: () => handleActionClick('activate'),
        color: 'bg-purple-600 hover:bg-purple-700'
      };
    }
    return null;
  };

  const statusAction = getStatusAction();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-800 truncate">{exam.title}</h3>
              <div className="relative" ref={actionsRef}>
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical size={20} className="text-gray-500" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                    {actionMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleActionClick(item.action)}
                        className={`w-full text-left px-4 py-2 flex items-center space-x-2 hover:bg-gray-50 transition-colors ${
                          item.destructive ? 'text-red-600' : 'text-gray-700'
                        }`}
                      >
                        <item.icon size={16} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeConfig[exam.type].color}`}>
                {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusConfig[exam.status].color}`}>
                <StatusIcon size={12} />
                <span>{statusConfig[exam.status].label}</span>
              </span>
            </div>
            
            <p className="text-gray-600 mb-2">{exam.course}</p>
            <p className="text-sm text-gray-500 mb-4">Created by {exam.createdBy} on {exam.createdAt}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <Calendar size={16} />
              <span className="text-sm">Date</span>
            </div>
            <p className="font-semibold text-gray-800">{exam.date}</p>
            <p className="text-xs text-gray-500">{exam.time} {exam.endTime && `- ${exam.endTime}`}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <Users size={16} />
              <span className="text-sm">Students</span>
            </div>
            <p className="font-semibold text-gray-800">{exam.students}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <FileText size={16} />
              <span className="text-sm">Marks</span>
            </div>
            <p className="font-semibold text-gray-800">{exam.totalMarks}</p>
            <p className="text-xs text-gray-500">Pass: {exam.passingMarks}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-600 mb-1">
              <BarChart3 size={16} />
              <span className="text-sm">Submissions</span>
            </div>
            <p className="font-semibold text-gray-800">{exam.submissions}</p>
            <p className="text-xs text-gray-500">{getSubmissionRate()}%</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4 mb-6">
          {/* Submission Progress */}
          {exam.status !== 'upcoming' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Submissions</span>
                <span className="text-sm font-semibold text-gray-800">
                  {exam.submissions} / {exam.students} ({getSubmissionRate()}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-dark rounded-full h-2 transition-all duration-300"
                  style={{ width: `${getSubmissionRate()}%` }}
                />
              </div>
            </div>
          )}

          {/* Grading Progress */}
          {(exam.status === 'completed' || exam.status === 'graded') && exam.graded !== undefined && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Graded</span>
                <span className="text-sm font-semibold text-gray-800">
                  {exam.graded} / {exam.submissions} ({getGradingProgress()}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${getGradingProgress()}%` }}
                />
              </div>
            </div>
          )}

          {/* Average Score */}
          {exam.averageScore && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-800">Average Score</span>
                <span className="text-lg font-bold text-blue-900">{exam.averageScore}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button 
            onClick={() => handleActionClick('view')}
            className="flex-1 px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg flex items-center justify-center space-x-2"
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
          
          {statusAction && (
            <button 
              onClick={statusAction.onClick}
              className={`flex-1 px-4 py-2 ${statusAction.color} text-white rounded-lg flex items-center justify-center space-x-2`}
            >
              <CheckCircle size={16} />
              <span>{statusAction.label}</span>
            </button>
          )}
          
          {exam.status === 'upcoming' && (
            <button 
              onClick={() => handleActionClick('reminder')}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
              title="Send reminder to students"
            >
              <Send size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Send Reminder</h2>
                  <p className="text-yellow-100">Remind students about upcoming exam</p>
                </div>
                <button
                  onClick={() => {
                    setShowReminderModal(false);
                    setReminderMessage('');
                  }}
                  className="p-2 hover:bg-yellow-600 rounded-lg"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="font-medium text-gray-800 mb-2">Exam: {exam.title}</p>
                <p className="text-sm text-gray-600">Date: {exam.date} at {exam.time}</p>
                <p className="text-sm text-gray-600">Students: {exam.students}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Message *
                </label>
                <textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  placeholder={`Reminder: ${exam.title} is scheduled for ${exam.date} at ${exam.time}. Don't forget to prepare!`}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowReminderModal(false);
                    setReminderMessage('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReminder}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Send Reminder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}