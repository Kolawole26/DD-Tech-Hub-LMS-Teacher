'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Download, 
  Search, 
  Filter, 
  Users, 
  Award, 
  AlertCircle, 
  Eye, 
  MessageSquare, 
  Send, 
  Star, 
  ChevronDown, 
  ChevronUp,
  X,
  Edit,
  Trash2,
  Calendar,
  BarChart3,
  TrendingUp,
  BookOpen,
  FileCheck,
  FileX,
  ThumbsUp,
  PenTool,
  Percent,
  CheckSquare,
  Sparkles
} from 'lucide-react';

export default function AssignmentReviewContent() {
  // State management
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Courses data
  const courses = [
    { id: 'all', name: 'All Courses', students: 45 },
    { id: 'cs101', name: 'Web App Development', students: 45 },
    { id: 'cs201', name: 'Advanced JavaScript', students: 32 },
    { id: 'cs301', name: 'React Masterclass', students: 28 },
  ];

  // Status filters
  const statusFilters = [
    { id: 'all', name: 'All Submissions' },
    { id: 'pending', name: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'graded', name: 'Graded', color: 'bg-green-100 text-green-800' },
    { id: 'late', name: 'Submitted Late', color: 'bg-red-100 text-red-800' },
    { id: 'resubmitted', name: 'Resubmitted', color: 'bg-blue-100 text-blue-800' },
  ];

  // Generate initial data
  useEffect(() => {
    generateSubmissions();
    calculateStats();
  }, [selectedCourse]);

  const generateSubmissions = () => {
    const assignmentTitles = [
      'JavaScript Array Methods',
      'React Component Design',
      'CSS Grid Layout',
      'Node.js REST API',
      'Database Schema Design',
      'Authentication System',
      'Responsive Web Design',
      'State Management',
      'Testing Implementation',
      'Deployment Pipeline'
    ];

    const students = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      studentId: `STU2025${String(i + 1).padStart(3, '0')}`,
      email: `student${i + 1}@example.com`,
      performance: Math.floor(Math.random() * 100),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
    }));

    const generatedSubmissions = students.map((student, index) => {
      const status = index % 4 === 0 ? 'pending' : 
                    index % 4 === 1 ? 'graded' : 
                    index % 4 === 2 ? 'late' : 'resubmitted';
      
      return {
        id: index + 1,
        student: student,
        assignment: assignmentTitles[Math.floor(Math.random() * assignmentTitles.length)],
        course: courses[Math.floor(Math.random() * (courses.length - 1)) + 1].name,
        submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: status,
        grade: status === 'graded' ? Math.floor(Math.random() * 40) + 60 : null,
        maxGrade: 100,
        feedback: status === 'graded' ? ['Good work!', 'Needs improvement on methodology', 'Excellent solution!', 'Well documented'][Math.floor(Math.random() * 4)] : '',
        attachments: Math.floor(Math.random() * 3) + 1,
        lateSubmission: status === 'late',
        resubmissionCount: status === 'resubmitted' ? Math.floor(Math.random() * 3) + 1 : 0,
        aiScore: Math.floor(Math.random() * 30) + 70,
        plagiarismScore: Math.floor(Math.random() * 10),
        timeSpent: Math.floor(Math.random() * 120) + 30, // minutes
        wordCount: Math.floor(Math.random() * 1000) + 500,
        rubric: [
          { criterion: 'Code Quality', score: Math.floor(Math.random() * 20) + 80, max: 100 },
          { criterion: 'Documentation', score: Math.floor(Math.random() * 20) + 70, max: 100 },
          { criterion: 'Functionality', score: Math.floor(Math.random() * 20) + 85, max: 100 },
          { criterion: 'Creativity', score: Math.floor(Math.random() * 20) + 75, max: 100 },
        ]
      };
    });

    setSubmissions(generatedSubmissions);
  };

  const calculateStats = () => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === 'pending').length;
    const graded = submissions.filter(s => s.status === 'graded').length;
    const averageGrade = submissions
      .filter(s => s.grade)
      .reduce((sum, s) => sum + s.grade, 0) / graded || 0;
    const late = submissions.filter(s => s.lateSubmission).length;
    const resubmitted = submissions.filter(s => s.status === 'resubmitted').length;

    setStats({
      total,
      pending,
      graded,
      averageGrade,
      late,
      resubmitted,
      completionRate: (graded / total * 100) || 0
    });
  };

  // Show success popup
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(submission => {
    if (selectedCourse !== 'all' && submission.course !== courses.find(c => c.id === selectedCourse)?.name) {
      return false;
    }
    if (selectedStatus !== 'all' && submission.status !== selectedStatus) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        submission.student.name.toLowerCase().includes(query) ||
        submission.student.studentId.toLowerCase().includes(query) ||
        submission.assignment.toLowerCase().includes(query) ||
        submission.course.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Open review modal
  const handleOpenReview = (submission) => {
    setSelectedSubmission(submission);
    setShowReviewModal(true);
  };

  // Submit review
  const handleSubmitReview = (grade, feedback) => {
    setIsSubmittingReview(true);
    
    setTimeout(() => {
      setSubmissions(prev => 
        prev.map(s => 
          s.id === selectedSubmission.id 
            ? { 
                ...s, 
                status: 'graded', 
                grade: grade,
                feedback: feedback,
                gradedAt: new Date().toISOString()
              } 
            : s
        )
      );
      
      setIsSubmittingReview(false);
      setShowReviewModal(false);
      setSelectedSubmission(null);
      calculateStats();
      showSuccess(`✅ Assignment graded! ${grade}/100 given to ${selectedSubmission.student.name}`);
    }, 1500);
  };

  // Download submission
  const handleDownloadSubmission = (submission) => {
    // Simulate download
    const content = `Assignment Submission\n\nStudent: ${submission.student.name}\nID: ${submission.student.studentId}\nAssignment: ${submission.assignment}\nCourse: ${submission.course}\nSubmitted: ${new Date(submission.submittedAt).toLocaleString()}\nStatus: ${submission.status}\nGrade: ${submission.grade || 'Not graded'}\nFeedback: ${submission.feedback || 'None'}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${submission.student.name.replace(/\s+/g, '_')}_${submission.assignment.replace(/\s+/g, '_')}.txt`;
    a.click();
    
    showSuccess(`📥 Downloaded submission from ${submission.student.name}`);
  };

  // Send reminder
  const handleSendReminder = (submission) => {
    showSuccess(`📧 Reminder sent to ${submission.student.name} about ${submission.assignment}`);
  };

  // Bulk grade
  const handleBulkGrade = () => {
    showSuccess('🎯 Bulk grading feature would open here');
  };

  // AI analyze
  const handleAIAnalyze = (submission) => {
    showSuccess(`🤖 AI analysis completed for ${submission.student.name}'s submission`);
  };

  // Toggle expanded view
  const toggleExpanded = (id) => {
    setExpandedSubmission(expandedSubmission === id ? null : id);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate days late
  const calculateDaysLate = (submission) => {
    const submitted = new Date(submission.submittedAt);
    const due = new Date(submission.dueDate);
    const diff = submitted - due;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <CheckCircle size={24} />
            <div>
              <p className="font-semibold">{successMessage}</p>
            </div>
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="ml-4 hover:bg-white/20 p-1 rounded-full"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Assignment Review & Grading</h1>
            <p className="text-primary-lighter">Review, grade, and provide feedback on student submissions</p>
          </div>
          {/* <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={handleBulkGrade}
              className="px-6 py-3 bg-white text-primary-dark hover:bg-gray-100 font-semibold rounded-lg flex items-center space-x-2"
            >
              <CheckSquare size={20} />
              <span>Bulk Grade</span>
            </button>
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-6 py-3 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg flex items-center space-x-2"
            >
              <PenTool size={20} />
              <span>Quick Review</span>
            </button>
          </div> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pending || 0}</p>
              <p className="text-sm text-yellow-600 mt-1">
                {stats.total ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Grade</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.averageGrade ? stats.averageGrade.toFixed(1) : '0'}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp size={14} className="mr-1" />
                +2.5%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Award className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.completionRate ? stats.completionRate.toFixed(1) : '0'}%</p>
              <p className="text-sm text-purple-600 mt-1">
                {stats.graded || 0} graded
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Percent className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-500" size={20} />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
              >
                {statusFilters.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-primary-light focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-600" size={24} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">{submission.assignment}</h3>
                        <p className="text-sm text-gray-600">{submission.course}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${statusFilters.find(s => s.id === submission.status)?.color}`}>
                          {statusFilters.find(s => s.id === submission.status)?.name}
                        </span>
                        {submission.lateSubmission && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            {calculateDaysLate(submission)} days late
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                          <Users className="text-gray-600" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{submission.student.name}</p>
                          <p className="text-sm text-gray-600">{submission.student.studentId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Calendar className="text-gray-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-600">Submitted</p>
                          <p className="font-medium text-gray-800">{formatDate(submission.submittedAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {submission.grade ? (
                          <>
                            <Award className="text-green-500" size={16} />
                            <div>
                              <p className="text-sm text-gray-600">Grade</p>
                              <p className="font-bold text-gray-800">{submission.grade}/{submission.maxGrade}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Clock className="text-yellow-500" size={16} />
                            <div>
                              <p className="text-sm text-gray-600">Status</p>
                              <p className="font-medium text-gray-800">Awaiting Review</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => toggleExpanded(submission.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    {expandedSubmission === submission.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedSubmission === submission.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Submission Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time Spent:</span>
                          <span className="font-medium">{submission.timeSpent} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Word Count:</span>
                          <span className="font-medium">{submission.wordCount.toLocaleString()} words</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Attachments:</span>
                          <span className="font-medium">{submission.attachments} files</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">AI Score:</span>
                          <span className={`font-medium ${submission.aiScore >= 80 ? 'text-green-600' : submission.aiScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {submission.aiScore}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plagiarism:</span>
                          <span className={`font-medium ${submission.plagiarismScore < 5 ? 'text-green-600' : submission.plagiarismScore < 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {submission.plagiarismScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Rubric Scores</h4>
                      <div className="space-y-3">
                        {submission.rubric.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-700">{item.criterion}</span>
                              <span className="text-sm font-medium">{item.score}/{item.max}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(item.score / item.max) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleOpenReview(submission)}
                      className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg flex items-center space-x-2"
                    >
                      <PenTool size={16} />
                      <span>Grade Assignment</span>
                    </button>
                    <button 
                      onClick={() => handleDownloadSubmission(submission)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                    {submission.status === 'pending' && (
                      <button 
                        onClick={() => handleSendReminder(submission)}
                        className="px-4 py-2 border border-yellow-300 text-yellow-700 hover:bg-yellow-50 rounded-lg flex items-center space-x-2"
                      >
                        <MessageSquare size={16} />
                        <span>Send Reminder</span>
                      </button>
                    )}
                    <button 
                      onClick={() => handleAIAnalyze(submission)}
                      className="px-4 py-2 border border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg flex items-center space-x-2"
                    >
                      <Sparkles size={16} />
                      <span>AI Analyze</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">No submissions found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Grade Assignment</h3>
                <p className="text-gray-600">{selectedSubmission.assignment}</p>
              </div>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedSubmission(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{selectedSubmission.student.name}</h4>
                    <p className="text-sm text-gray-600">{selectedSubmission.student.studentId} • {selectedSubmission.course}</p>
                  </div>
                </div>
              </div>
              
              {/* Rubric */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Rubric Scoring</h4>
                <div className="space-y-4">
                  {selectedSubmission.rubric.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">{item.criterion}</span>
                        <span className="text-lg font-bold text-gray-800">{item.score}/{item.max}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(item.score / item.max) * 100}%` }}
                        />
                      </div>
                      <div className="flex space-x-2 mt-2">
                        {[50, 60, 70, 80, 90, 100].map(score => (
                          <button
                            key={score}
                            onClick={() => {
                              // Update rubric score
                              const newRubric = [...selectedSubmission.rubric];
                              newRubric[index].score = score;
                              setSelectedSubmission(prev => ({ ...prev, rubric: newRubric }));
                            }}
                            className={`px-2 py-1 text-sm rounded ${
                              item.score === score 
                                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Grade Input */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Final Grade</h4>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedSubmission.grade || 70}
                      onChange={(e) => setSelectedSubmission(prev => ({ ...prev, grade: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>25</span>
                      <span>50</span>
                      <span>75</span>
                      <span>100</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">
                      {selectedSubmission.grade || 70}
                    </div>
                    <div className="text-sm text-gray-600">/ 100</div>
                  </div>
                </div>
              </div>
              
              {/* Feedback */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Feedback</h4>
                <textarea
                  value={selectedSubmission.feedback}
                  onChange={(e) => setSelectedSubmission(prev => ({ ...prev, feedback: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  placeholder="Provide constructive feedback for the student..."
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Excellent work!', 'Needs improvement', 'Well documented', 'Great solution', 'Check methodology'].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSubmission(prev => ({ 
                        ...prev, 
                        feedback: prev.feedback ? prev.feedback + ' ' + template : template 
                      }))}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedSubmission(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitReview(selectedSubmission.grade || 70, selectedSubmission.feedback)}
                disabled={isSubmittingReview}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmittingReview ? (
                  <>
                    <Clock size={16} className="animate-spin" />
                    <span>Grading...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Submit Grade</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}