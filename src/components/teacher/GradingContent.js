'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Download,
  Upload,
  Filter,
  Search,
  MessageSquare,
  Star,
  Award,
  TrendingUp,
  MoreVertical,
  ChevronRight,
  Eye,
  Edit,
  Send,
  BookOpen,
  X,
  User,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '@/services/api';

export default function GradingContent() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // API Data States
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({
    total_submissions: 0,
    total_pending: 0,
    avg_grade: 0
  });
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  // Grading state
  const [gradingData, setGradingData] = useState({
    code_quality: 0,
    documentation: 0,
    functionality: 0,
    creativity: 0,
    final_grade: 0
  });

  // Modal states
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [gradeValue, setGradeValue] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  const courses = [
    { id: 'all', name: 'All Courses', assignments: 15 },
    { id: 'cs101', name: 'Web App Development', assignments: 8 },
    { id: 'cs201', name: 'Advanced JavaScript', assignments: 4 },
    { id: 'cs301', name: 'React Masterclass', assignments: 3 },
  ];

  // Fetch assignments from API
  useEffect(() => {
    fetchAssignments();
    fetchStats();
  }, [selectedStatus, currentPage, itemsPerPage]);

  const fetchAssignments = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `/assignment-submissions?page=${currentPage}&limit=${itemsPerPage}`;
      
      if (selectedStatus !== 'all') {
        url += `&status=${selectedStatus}`;
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await api.get(url);
      
      if (response.status === 200 && response.data[0]) {
        const responseData = response.data[0]; // API returns array with one object
        
        if (responseData) {
          setPagination(responseData.metadata);
          
          const formattedAssignments = responseData.data.map(item => ({
            id: item._id,
            title: item.title,
            course: 'Web App Development', // You might want to fetch this from material_id
            student: `${item.user.first_name} ${item.user.last_name}`,
            studentId: item.user.username,
            submitted: new Date(item.date).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: item.status.toLowerCase(),
            score: item.final_grade || null,
            maxScore: 100,
            fileType: item.submission_src ? 'Link' : 'File',
            fileSize: 'N/A',
            description: item.comment || 'No description provided',
            submission_src: item.submission_src,
            material_id: item.material_id,
            user: item.user
          }));
          
          setAssignments(formattedAssignments);
        }
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await api.get('/assignment-submissions/stats');
      
      if (response.status === 200 && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Handler functions
  const handleDownloadSubmission = (submissionSrc) => {
    if (submissionSrc) {
      window.open(submissionSrc, '_blank');
    } else {
      alert('No submission file available');
    }
  };

  const handleGradeAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    
    // Pre-fill grading data if already graded
    if (assignment.score) {
      setGradingData({
        code_quality: assignment.score * 0.25, // Approximate distribution
        documentation: assignment.score * 0.25,
        functionality: assignment.score * 0.25,
        creativity: assignment.score * 0.25,
        final_grade: assignment.score
      });
      setGradeValue(assignment.score.toString());
    } else {
      setGradingData({
        code_quality: 0,
        documentation: 0,
        functionality: 0,
        creativity: 0,
        final_grade: 0
      });
      setGradeValue('');
    }
    
    setShowGradeModal(true);
  };

  const handlePreview = (assignment) => {
    setSelectedAssignment(assignment);
    setShowPreviewModal(true);
  };

  const handleAddFeedback = (assignment) => {
    setSelectedAssignment(assignment);
    setFeedbackText(assignment.description || '');
    setShowFeedbackModal(true);
  };

  const handleSubmitGrade = async () => {
    if (!selectedAssignment || !gradeValue) {
      alert('Please enter a grade');
      return;
    }

    const score = parseInt(gradeValue);
    if (isNaN(score) || score < 0 || score > 100) {
      alert('Please enter a valid grade between 0 and 100');
      return;
    }

    setSubmittingGrade(true);
    
    try {
      // Calculate individual scores (you might want to adjust this logic)
      const payload = {
        submission_id: selectedAssignment.id,
        score: {
          code_quality: Math.round(score * 0.25),
          documentation: Math.round(score * 0.25),
          functionality: Math.round(score * 0.25),
          creativity: Math.round(score * 0.25),
          final_grade: score
        }
      };

      const response = await api.post('/assignment-submissions/grade', payload);
      
      if (response.status === 200) {
        alert(`Grade ${score}/100 submitted successfully for ${selectedAssignment.title}`);
        
        // Refresh the assignments list
        fetchAssignments();
        fetchStats();
        
        handleCloseGradeModal();
      } else {
        throw new Error(response.message || 'Failed to submit grade');
      }
    } catch (err) {
      console.error('Error submitting grade:', err);
      alert(`Failed to submit grade: ${err.message}`);
    } finally {
      setSubmittingGrade(false);
    }
  };

  const handleUpdateGradingCriteria = (criteria, value) => {
    const newGradingData = {
      ...gradingData,
      [criteria]: parseInt(value) || 0
    };
    
    // Calculate final grade as average of all criteria
    const total = newGradingData.code_quality + newGradingData.documentation + 
                  newGradingData.functionality + newGradingData.creativity;
    newGradingData.final_grade = Math.round(total / 4);
    
    setGradingData(newGradingData);
    setGradeValue(newGradingData.final_grade.toString());
  };

  const handleSubmitFeedback = async () => {
    if (!selectedAssignment || !feedbackText.trim()) {
      alert('Please enter feedback text');
      return;
    }

    try {
      // You might need an endpoint for feedback
      alert(`Feedback submitted for ${selectedAssignment.title}`);
      handleCloseFeedbackModal();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback');
    }
  };

  // Modal close handlers
  const handleCloseGradeModal = () => {
    setShowGradeModal(false);
    setSelectedAssignment(null);
    setGradeValue('');
    setGradingData({
      code_quality: 0,
      documentation: 0,
      functionality: 0,
      creativity: 0,
      final_grade: 0
    });
  };

  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setSelectedAssignment(null);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedAssignment(null);
    setFeedbackText('');
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAssignments();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending</span>;
      case 'graded':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Graded</span>;
      case 'resubmitted':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Resubmitted</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Assessment Grading</h1>
            <p className="text-primary-lighter">Grade assignments, provide feedback, and track student performance</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button 
              onClick={fetchAssignments}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total_submissions}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Grading</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total_pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.avg_grade}%</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Time Submissions</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">92%</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="">
        {/* Left Column - Grading Interface */}
        <div className="">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Assignment Submissions</h2>
              
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-500" size={20} />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Graded">Graded</option>
                  <option value="Resubmitted">Resubmitted</option>
                </select>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-primary-dark text-white rounded-lg"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto mb-4"></div>
                <p className="text-gray-600">Loading assignments...</p>
              </div>
            ) : (
              <>
                {/* Assignments List */}
                <div className="space-y-4">
                  {assignments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">No Submissions Found</h3>
                      <p className="text-gray-600">No assignment submissions match your criteria.</p>
                    </div>
                  ) : (
                    assignments.map((assignment) => (
                      <div key={assignment.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="text-blue-600" size={20} />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-bold text-gray-800">{assignment.title}</h3>
                                  {getStatusBadge(assignment.status)}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  <span>{assignment.course}</span>
                                  <span>•</span>
                                  <span>{assignment.student} ({assignment.studentId})</span>
                                  <span>•</span>
                                  <span className="flex items-center space-x-1">
                                    <Calendar size={12} />
                                    <span>{assignment.submitted}</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">File Type</p>
                                <p className="font-semibold">{assignment.fileType}</p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">File Size</p>
                                <p className="font-semibold">{assignment.fileSize}</p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Max Score</p>
                                <p className="font-semibold">{assignment.maxScore}</p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">Score</p>
                                <p className={`font-semibold ${
                                  assignment.score === null 
                                    ? 'text-gray-600' 
                                    : assignment.score >= 90 
                                      ? 'text-green-600' 
                                      : assignment.score >= 70 
                                        ? 'text-yellow-600' 
                                        : 'text-red-600'
                                }`}>
                                  {assignment.score !== null ? `${assignment.score}/${assignment.maxScore}` : 'Not Graded'}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {assignment.submission_src && (
                                <button
                                  onClick={() => handleDownloadSubmission(assignment.submission_src)}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                                >
                                  <Download size={16} />
                                  <span>View Submission</span>
                                </button>
                              )}
                              {!assignment.score && (
                                <button
                                  onClick={() => handleGradeAssignment(assignment)}
                                  className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg flex items-center space-x-2"
                                >
                                  <Edit size={16} />
                                  <span>Grade Now</span>
                                </button>
                              )}
                              <button
                                onClick={() => handlePreview(assignment)}
                                className="px-4 py-2 border border-purple-500 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center space-x-2"
                              >
                                <Eye size={16} />
                                <span>Details</span>
                              </button>
                              <button
                                onClick={() => handleAddFeedback(assignment)}
                                className="px-4 py-2 border border-green-500 text-green-600 hover:bg-green-50 rounded-lg flex items-center space-x-2"
                              >
                                <MessageSquare size={16} />
                                <span>Add Feedback</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {assignments.length > 0 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} assignments
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-4 py-2 border rounded-lg ${
                            currentPage === i + 1
                              ? 'bg-primary-dark text-white border-primary-dark'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.pages}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grade Assignment Modal */}
      {showGradeModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedAssignment.score ? 'Update Grade' : 'Grade Assignment'}
              </h3>
              <button
                onClick={handleCloseGradeModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{selectedAssignment.title}</h4>
                  <p className="text-sm text-gray-600">{selectedAssignment.student} • {selectedAssignment.course}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Grading Criteria */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-3">Grading Criteria</h5>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Code Quality (0-25)</label>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={gradingData.code_quality}
                        onChange={(e) => handleUpdateGradingCriteria('code_quality', e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span className="font-medium text-primary-dark">{gradingData.code_quality}/25</span>
                        <span>25</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Documentation (0-25)</label>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={gradingData.documentation}
                        onChange={(e) => handleUpdateGradingCriteria('documentation', e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span className="font-medium text-primary-dark">{gradingData.documentation}/25</span>
                        <span>25</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Functionality (0-25)</label>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={gradingData.functionality}
                        onChange={(e) => handleUpdateGradingCriteria('functionality', e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span className="font-medium text-primary-dark">{gradingData.functionality}/25</span>
                        <span>25</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Creativity (0-25)</label>
                      <input
                        type="range"
                        min="0"
                        max="25"
                        value={gradingData.creativity}
                        onChange={(e) => handleUpdateGradingCriteria('creativity', e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span className="font-medium text-primary-dark">{gradingData.creativity}/25</span>
                        <span>25</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-800">Final Grade</span>
                    <span className="text-2xl font-bold text-green-600">{gradingData.final_grade}/100</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="Add any additional comments or notes..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseGradeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitGrade}
                disabled={submittingGrade}
                className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submittingGrade ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Grade</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Assignment Modal */}
      {showPreviewModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Assignment Details</h3>
              <button
                onClick={handleClosePreviewModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{selectedAssignment.title}</h4>
                    <p className="text-gray-600">{selectedAssignment.course}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Student</p>
                    <p className="font-semibold">{selectedAssignment.student}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Student ID</p>
                    <p className="font-semibold">{selectedAssignment.studentId}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-semibold">{selectedAssignment.submitted}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold">{getStatusBadge(selectedAssignment.status)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-bold text-gray-800 mb-2">Student Comment</h5>
                  <p className="text-gray-600">{selectedAssignment.description || 'No comment provided'}</p>
                </div>
                
                <div>
                  <h5 className="font-bold text-gray-800 mb-2">Submission Details</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">File Type</p>
                      <p className="font-semibold">{selectedAssignment.fileType}</p>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">Submission Link</p>
                      {selectedAssignment.submission_src ? (
                        <a 
                          href={selectedAssignment.submission_src} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-dark hover:underline font-semibold text-sm"
                        >
                          View Submission
                        </a>
                      ) : (
                        <p className="font-semibold text-gray-500">No link available</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-bold text-gray-800 mb-2">Grade Information</h5>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {selectedAssignment.score ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-gray-800">Current Grade</p>
                          <p className="text-sm text-gray-600">Graded assignment</p>
                        </div>
                        <div className="text-3xl font-bold text-green-600">
                          {selectedAssignment.score}%
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-600">Not yet graded</p>
                        <button
                          onClick={() => {
                            handleClosePreviewModal();
                            handleGradeAssignment(selectedAssignment);
                          }}
                          className="mt-2 px-4 py-2 bg-primary-dark text-white rounded-lg"
                        >
                          Grade Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {selectedAssignment.submission_src && (
                <a
                  href={selectedAssignment.submission_src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-primary-dark text-primary-dark hover:bg-primary-lighter rounded-lg flex items-center space-x-2"
                >
                  <Download size={16} />
                  <span>Open Submission</span>
                </a>
              )}
              <button
                onClick={handleClosePreviewModal}
                className="px-6 py-3 bg-primary-dark hover:bg-primary-light text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Feedback Modal */}
      {showFeedbackModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add Feedback</h3>
              <button
                onClick={handleCloseFeedbackModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg">
                  <User className="text-gray-600" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{selectedAssignment.student}</p>
                  <p className="text-sm text-gray-600">{selectedAssignment.title}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="6"
                    placeholder="Provide constructive feedback for the student..."
                  />
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Tip:</span> Be specific about what was done well and what can be improved. 
                    Include examples and suggestions for future work.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseFeedbackModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}