'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Download,
  Filter,
  Search,
  BarChart3,
  AlertCircle,
  UserCheck,
  UserX,
  TrendingUp,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  RefreshCw
} from 'lucide-react';
import { api } from '@/services/api';

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

export default function AttendanceContent() {
  const [selectedSession, setSelectedSession] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Stats state
  const [stats, setStats] = useState({
    date: '',
    total_students: 0,
    present_today: 0,
    absent_today: 0,
    avg_attendance: 0
  });

  // Sessions dropdown state
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  const [loading, setLoading] = useState({
    stats: true,
    attendance: true
  });

  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Fetch live sessions for dropdown
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch attendance stats
  useEffect(() => {
    fetchAttendanceStats();
  }, []);

  // Fetch attendance records when session or search changes
  useEffect(() => {
    if (selectedSession) {
      fetchAttendanceRecords();
    }
  }, [selectedSession, currentPage, itemsPerPage, searchQuery]);

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const response = await api.get('/live-sessions');
      
      if (response.status === 200 && response.data?.data) {
        const sessionsData = response.data.data.map(session => ({
          id: session._id,
          name: `${new Date(session.schedule_time).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })} - ${session.title}`,
          title: session.title,
          schedule_time: session.schedule_time,
          duration: session.duration
        }));
        setSessions(sessionsData);
        
        // Set first session as default if available
        if (sessionsData.length > 0 && !selectedSession) {
          setSelectedSession(sessionsData[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      showToast('Failed to load sessions', 'error');
    } finally {
      setSessionsLoading(false);
    }
  };

  const fetchAttendanceStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const response = await api.get('/attendance/stats');
      
      if (response.status === 200 && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching attendance stats:', err);
      showToast('Failed to load attendance statistics', 'error');
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

const fetchAttendanceRecords = async () => {
  if (!selectedSession) return;
  
  try {
    setLoading(prev => ({ ...prev, attendance: true }));
    
    // Build query parameters as URL string
    let url = `/attendance?live_session_id=${encodeURIComponent(selectedSession)}`;
    
    // Add search query if it exists
    if (searchQuery && searchQuery.trim() !== '') {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    console.log('Fetching attendance with URL:', url); // Debug log

    const response = await api.get(url);
    
    // Check if response.data exists and is an array
    if (response.status === 200 && response.data) {
      // The API returns data directly, not wrapped in a data property
      const data = Array.isArray(response.data) ? response.data : 
                   response.data.data ? response.data.data : [];
      
      console.log('Received attendance data:', data); // Debug log
      
      // Transform API data to match component structure
      const transformedData = data.map((record, index) => ({
        id: record.user_id || index,
        name: `${record.first_name} ${record.last_name}`,
        studentId: record.username,
        email: record.email,
        attendance: record.attendance_percentage,
        present: record.status === 'Present',
        late: record.is_early === false && record.status === 'Present',
        lastSession: record.last_attendance_status,
        notes: '',
        user_id: record.user_id,
        attendance_percentage: record.attendance_percentage
      }));
      
      setAttendanceData(transformedData);
      setTotalItems(transformedData.length);
      setTotalPages(Math.ceil(transformedData.length / itemsPerPage));
    }
  } catch (err) {
    console.error('Error fetching attendance records:', err);
    showToast('Failed to load attendance records', 'error');
    setAttendanceData([]);
  } finally {
    setLoading(prev => ({ ...prev, attendance: false }));
  }
};

  const handleExportData = () => {
    try {
      // Export attendance data as CSV
      const csv = [
        ['Student Name', 'Student ID', 'Email', 'Status', 'Attendance %', 'Last Session'],
        ...attendanceData.map(student => [
          student.name,
          student.studentId,
          student.email,
          student.present ? (student.late ? 'Late' : 'Present') : 'Absent',
          `${student.attendance}%`,
          student.lastSession
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${selectedSession}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      
      showToast('Attendance data exported successfully!', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showToast('Failed to export data. Please try again.', 'error');
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchAttendanceRecords();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate pagination range
  const getPaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = maxVisiblePages - leftOffset - 1;
      
      let start = currentPage - leftOffset;
      let end = currentPage + rightOffset;
      
      if (start < 1) {
        end += 1 - start;
        start = 1;
      }
      
      if (end > totalPages) {
        start -= end - totalPages;
        end = totalPages;
      }
      
      start = Math.max(start, 1);
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
    }
    
    return range;
  };

  // Get current page data
  const getCurrentPageData = () => {
    if (loading.attendance) return [];
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return attendanceData.slice(startIndex, endIndex);
  };

  const currentPageData = getCurrentPageData();

  // Get selected session details
  const getSelectedSessionDetails = () => {
    return sessions.find(s => s.id === selectedSession);
  };

  const selectedSessionDetails = getSelectedSessionDetails();

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Attendance Overview</h1>
            <p className="text-primary-lighter">View attendance records for all class sessions</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={handleExportData}
              disabled={!selectedSession || attendanceData.length === 0}
              className="px-6 py-3 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {loading.stats ? '...' : stats.total_students}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {loading.stats ? '...' : stats.present_today}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {loading.stats ? '...' : stats.total_students > 0 
                  ? `${((stats.present_today / stats.total_students) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <UserCheck className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {loading.stats ? '...' : stats.absent_today}
              </p>
              <p className="text-sm text-red-600 mt-1">
                {loading.stats ? '...' : stats.total_students > 0 
                  ? `${((stats.absent_today / stats.total_students) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <UserX className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Attendance</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {loading.stats ? '...' : `${stats.avg_attendance}%`}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-500" size={20} />
              <select
                value={selectedSession}
                onChange={(e) => {
                  setSelectedSession(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent min-w-[250px]"
                disabled={sessionsLoading}
              >
                <option value="">Select a session</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedSessionDetails && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Duration: {selectedSessionDetails.duration}</span>
                <Calendar size={16} className="ml-2" />
                <span>
                  {new Date(selectedSessionDetails.schedule_time).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-primary-light focus:border-transparent"
                disabled={!selectedSession}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
            <button
              onClick={fetchAttendanceRecords}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Refresh"
              disabled={!selectedSession}
            >
              <RefreshCw size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Session Info Banner */}
        {selectedSession && !loading.attendance && attendanceData.length === 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-yellow-600" size={20} />
              <span className="text-yellow-800">No attendance records found for this session.</span>
            </div>
          </div>
        )}

        {!selectedSession && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-blue-600" size={20} />
              <span className="text-blue-800">Please select a session to view attendance records.</span>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Attendance %</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Session</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading.attendance ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading attendance data...</p>
                  </td>
                </tr>
              ) : !selectedSession ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center">
                    <Calendar className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-gray-600">Select a session to view attendance records</p>
                  </td>
                </tr>
              ) : currentPageData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center">
                    <AlertCircle className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-gray-600">No attendance records found</p>
                  </td>
                </tr>
              ) : (
                currentPageData.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">{student.studentId}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              student.attendance >= 90 ? 'bg-green-500' :
                              student.attendance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${student.attendance}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{student.attendance}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        student.lastSession === 'Present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.lastSession}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-lg text-sm inline-flex items-center ${
                        student.present
                          ? student.late
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {student.present ? (student.late ? 'Late' : 'Present') : 'Absent'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading.attendance && currentPageData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-6 border-t">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>

              {getPaginationRange().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === pageNum
                      ? 'bg-primary-dark text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        )}

        {/* No session selected message */}
        {!selectedSession && (
          <div className="text-center py-8">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Session Selected</h3>
            <p className="text-gray-600">Choose a session from the dropdown above to view attendance records.</p>
          </div>
        )}
      </div>
    </div>
  );
}