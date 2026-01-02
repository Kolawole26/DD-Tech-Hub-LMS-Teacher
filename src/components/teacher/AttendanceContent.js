'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Download,
  Upload,
  Filter,
  Search,
  MoreVertical,
  BarChart3,
  AlertCircle,
  UserCheck,
  UserX,
  TrendingUp,
  ChevronRight,
  FileText,
  Check,
  X,
  Plus,
  BookOpen
} from 'lucide-react';

export default function AttendanceContent() {
  const [selectedCourse, setSelectedCourse] = useState('cs101');
  const [selectedSession, setSelectedSession] = useState('all');
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const courses = [
    { id: 'cs101', name: 'Web App Development', students: 45 },
    { id: 'cs201', name: 'Advanced JavaScript', students: 32 },
    { id: 'cs301', name: 'React Masterclass', students: 28 },
  ];

  const sessions = [
    { id: 'all', name: 'All Sessions' },
    { id: 'session1', name: 'Dec 13 - JavaScript Basics' },
    { id: 'session2', name: 'Dec 10 - CSS Grid' },
    { id: 'session3', name: 'Dec 6 - HTML Fundamentals' },
  ];

  // Initialize attendance data
  useEffect(() => {
    const generateAttendanceData = () => {
      const students = [];
      const course = courses.find(c => c.id === selectedCourse);
      
      for (let i = 1; i <= (course?.students || 30); i++) {
        students.push({
          id: i,
          name: `Student ${i}`,
          studentId: `STU2025${String(i).padStart(3, '0')}`,
          email: `student${i}@example.com`,
          attendance: Math.floor(Math.random() * 100),
          present: Math.random() > 0.2,
          late: Math.random() > 0.7,
          lastSession: Math.random() > 0.3 ? 'Present' : 'Absent',
          notes: '',
        });
      }
      
      setAttendanceData(students);
    };

    generateAttendanceData();
  }, [selectedCourse]);

  const handleToggleAttendance = (studentId) => {
    setAttendanceData(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, present: !student.present, late: false }
          : student
      )
    );
  };

  const handleToggleLate = (studentId) => {
    setAttendanceData(prev =>
      prev.map(student =>
        student.id === studentId
          ? { ...student, late: !student.late, present: true }
          : student
      )
    );
  };

  const handleSubmitAttendance = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Attendance submitted successfully!');
    }, 1500);
  };

  const handleExportData = () => {
    // Export attendance data as CSV
    const csv = [
      ['Student ID', 'Name', 'Email', 'Status', 'Attendance %', 'Last Session'],
      ...attendanceData.map(student => [
        student.studentId,
        student.name,
        student.email,
        student.present ? (student.late ? 'Late' : 'Present') : 'Absent',
        `${student.attendance}%`,
        student.lastSession,
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedCourse}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // New handler functions for previously non-working buttons
  const handleMarkAllPresent = () => {
    setAttendanceData(prev =>
      prev.map(student => ({
        ...student,
        present: true,
        late: false
      }))
    );
    alert('All students marked as present!');
  };

  const handleImportRoster = () => {
    alert('Import roster feature would open file picker here');
    // In a real app, this would trigger file input and process CSV
  };

  const handleDownloadTemplate = () => {
    const template = [
      ['Student ID', 'Name', 'Email', 'Grade Level'],
      ['STU2025001', 'John Student', 'john@example.com', 'Senior'],
      ['STU2025002', 'Jane Student', 'jane@example.com', 'Junior'],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_template.csv';
    a.click();
  };

  const handlePrepareAttendance = (classItem) => {
    setSelectedClass(classItem);
    setShowAttendanceModal(true);
  };

  const handleSaveDraft = () => {
    alert('Attendance draft saved!');
  };

  const handleAddNote = (studentId) => {
    const note = prompt('Add note for this student:');
    if (note) {
      setAttendanceData(prev =>
        prev.map(student =>
          student.id === studentId
            ? { ...student, notes: note }
            : student
        )
      );
    }
  };

  const handleViewDetails = (studentId) => {
    const student = attendanceData.find(s => s.id === studentId);
    if (student) {
      alert(`Student Details:\n\nName: ${student.name}\nID: ${student.studentId}\nEmail: ${student.email}\nAttendance: ${student.attendance}%\nStatus: ${student.present ? 'Present' : 'Absent'}${student.late ? ' (Late)' : ''}\nLast Session: ${student.lastSession}\nNotes: ${student.notes || 'None'}`);
    }
  };

  const handleCloseModal = () => {
    setShowAttendanceModal(false);
    setSelectedClass(null);
  };

  const handleSubmitClassAttendance = () => {
    if (selectedClass) {
      alert(`Attendance prepared for ${selectedClass.course} class at ${selectedClass.time}`);
    }
    handleCloseModal();
  };

  const filteredStudents = attendanceData.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const attendanceStats = {
    total: attendanceData.length,
    present: attendanceData.filter(s => s.present).length,
    absent: attendanceData.filter(s => !s.present).length,
    late: attendanceData.filter(s => s.late).length,
    averageAttendance: attendanceData.reduce((sum, s) => sum + s.attendance, 0) / attendanceData.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Attendance & Roster Management</h1>
            <p className="text-primary-lighter">Track and submit student attendance for all class types</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={handleSubmitAttendance}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white text-green-600 hover:bg-gray-100 font-semibold rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
            </button>
            <button
              onClick={handleExportData}
              className="px-6 py-3 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{attendanceStats.total}</p>
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
                  <p className="text-2xl font-bold text-gray-800 mt-1">{attendanceStats.present}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {((attendanceStats.present / attendanceStats.total) * 100).toFixed(1)}%
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
                  <p className="text-2xl font-bold text-gray-800 mt-1">{attendanceStats.absent}</p>
                  <p className="text-sm text-red-600 mt-1">
                    {((attendanceStats.absent / attendanceStats.total) * 100).toFixed(1)}%
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
                  <p className="text-2xl font-bold text-gray-800 mt-1">{attendanceStats.averageAttendance.toFixed(1)}%</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    +5.2%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <BarChart3 className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={handleMarkAllPresent}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2"
            >
              <CheckCircle size={16} />
              <span>Mark All Present</span>
            </button>
            <button 
              onClick={handleImportRoster}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
            >
              <Upload size={16} />
              <span>Import Roster</span>
            </button>
            <button 
              onClick={handleDownloadTemplate}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Download Template</span>
            </button>
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
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.students} students)
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

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
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleAttendance(student.id)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          student.present
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                      >
                        {student.present ? 'Present' : 'Absent'}
                      </button>
                      <button
                        onClick={() => handleToggleLate(student.id)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          student.late
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                      >
                        {student.late ? 'Late' : 'On Time'}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleAddNote(student.id)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Add Note"
                      >
                        <FileText size={16} />
                      </button>
                      <button 
                        onClick={() => handleViewDetails(student.id)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="View Details"
                      >
                        <AlertCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <div className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {attendanceData.length} students
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleSaveDraft}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Save Draft
            </button>
            <button
              onClick={handleSubmitAttendance}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
            </button>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Attendance History</h2>
            <select 
              onChange={(e) => alert(`Viewing data for: ${e.target.value}`)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This semester</option>
            </select>
          </div>

          <div className="space-y-4">
            {[
              { date: 'Dec 13, 2025', present: 42, absent: 3, late: 2, topic: 'JavaScript Basics' },
              { date: 'Dec 10, 2025', present: 40, absent: 5, late: 0, topic: 'CSS Grid' },
              { date: 'Dec 6, 2025', present: 38, absent: 7, late: 3, topic: 'HTML Fundamentals' },
            ].map((record, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{record.date}</h3>
                    <p className="text-sm text-gray-600">{record.topic}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">
                      {((record.present / (record.present + record.absent)) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <span className="text-sm">{record.present} Present</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="text-red-500" size={16} />
                    <span className="text-sm">{record.absent} Absent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="text-yellow-500" size={16} />
                    <span className="text-sm">{record.late} Late</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Schedule */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Classes</h2>
            <Calendar className="text-gray-500" size={20} />
          </div>

          <div className="space-y-4">
            {[
              { time: 'Today, 10:00 AM', course: 'Web App Dev', type: 'Live', description: 'React Hooks and State Management' },
              { time: 'Tomorrow, 2:00 PM', course: 'Advanced JS', type: 'Recorded', description: 'Async/Await and Promises' },
              { time: 'Wednesday, 11:00 AM', course: 'React Masterclass', type: 'Live', description: 'Component Lifecycle' },
            ].map((classItem, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary-lighter transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{classItem.time}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    classItem.type === 'Live' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {classItem.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">{classItem.course}</p>
                <p className="text-sm text-gray-500 mb-3">{classItem.description}</p>
                <button 
                  onClick={() => handlePrepareAttendance(classItem)}
                  className="w-full px-4 py-2 border border-primary-dark text-primary-dark hover:bg-primary-lighter rounded-lg"
                >
                  Prepare Attendance
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Prepare Attendance</h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg">
                  <BookOpen className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{selectedClass.course}</h4>
                  <p className="text-sm text-gray-600">{selectedClass.time}</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedClass.type} Class</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendance Method
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg">
                    <option>Manual Entry</option>
                    <option>QR Code Check-in</option>
                    <option>Auto-detect (for online classes)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="Add any notes about this class session..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitClassAttendance}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Start Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}