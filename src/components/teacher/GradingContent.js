'use client';

import { useState } from 'react';
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
  User
} from 'lucide-react';

export default function GradingContent() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [gradingRubric, setGradingRubric] = useState({
    criteria1: { score: 0, max: 25, comment: '' },
    criteria2: { score: 0, max: 25, comment: '' },
    criteria3: { score: 0, max: 25, comment: '' },
    criteria4: { score: 0, max: 25, comment: '' },
  });

  // Modal states
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [gradeValue, setGradeValue] = useState('');

  const courses = [
    { id: 'all', name: 'All Courses', assignments: 15 },
    { id: 'cs101', name: 'Web App Development', assignments: 8 },
    { id: 'cs201', name: 'Advanced JavaScript', assignments: 4 },
    { id: 'cs301', name: 'React Masterclass', assignments: 3 },
  ];

  const assignments = [
    {
      id: 1,
      title: 'Assignment 2: JavaScript Calculator',
      course: 'Web App Development',
      student: 'John Student',
      studentId: 'STU2025001',
      submitted: 'Nov 30, 2025',
      status: 'pending',
      score: null,
      maxScore: 100,
      fileType: 'ZIP',
      fileSize: '2.4 MB',
      description: 'A functional calculator built with vanilla JavaScript implementing basic arithmetic operations and error handling.',
    },
    {
      id: 2,
      title: 'Quiz 3: JavaScript Basics',
      course: 'Web App Development',
      student: 'Sarah Johnson',
      studentId: 'STU2025002',
      submitted: 'Dec 1, 2025',
      status: 'graded',
      score: 92,
      maxScore: 100,
      fileType: 'PDF',
      fileSize: '1.2 MB',
      description: 'Multiple choice quiz covering JavaScript fundamentals, closures, and event handling.',
    },
    {
      id: 3,
      title: 'Midterm Project',
      course: 'Advanced JavaScript',
      student: 'Michael Chen',
      studentId: 'STU2025003',
      submitted: 'Dec 10, 2025',
      status: 'needs_review',
      score: null,
      maxScore: 100,
      fileType: 'ZIP',
      fileSize: '15.8 MB',
      description: 'E-commerce dashboard with real-time data visualization and API integration.',
    },
    {
      id: 4,
      title: 'React Todo App',
      course: 'React Masterclass',
      student: 'Emily Wilson',
      studentId: 'STU2025004',
      submitted: 'Dec 12, 2025',
      status: 'pending',
      score: null,
      maxScore: 100,
      fileType: 'GIT',
      fileSize: 'N/A',
      description: 'Full-featured todo application with drag-and-drop functionality and local storage.',
    },
    {
      id: 5,
      title: 'CSS Grid Layout',
      course: 'Web App Development',
      student: 'David Brown',
      studentId: 'STU2025005',
      submitted: 'Nov 25, 2025',
      status: 'graded',
      score: 88,
      maxScore: 100,
      fileType: 'ZIP',
      fileSize: '3.1 MB',
      description: 'Responsive webpage layout using CSS Grid with mobile-first approach.',
    },
  ];

  const stats = [
    { label: 'Total Assignments', value: '15', icon: FileText, color: 'blue' },
    { label: 'Pending Grading', value: '8', icon: Clock, color: 'orange' },
    { label: 'Avg. Score', value: '89.2%', icon: TrendingUp, color: 'green' },
    { label: 'On Time Submissions', value: '92%', icon: CheckCircle, color: 'purple' },
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const courseMatch = selectedCourse === 'all' || assignment.course === courses.find(c => c.id === selectedCourse)?.name;
    const statusMatch = selectedStatus === 'all' || assignment.status === selectedStatus;
    return courseMatch && statusMatch;
  });

  // Handler functions
  const handleDownloadSubmission = (assignmentId) => {
    alert(`Downloading submission for assignment ${assignmentId}`);
  };

  const handleGradeAssignment = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    setSelectedAssignment(assignment);
    setGradeValue(assignment?.score?.toString() || '');
    setShowGradeModal(true);
  };

  const handlePreview = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    setSelectedAssignment(assignment);
    setShowPreviewModal(true);
  };

  const handleAddFeedback = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    setSelectedAssignment(assignment);
    setFeedbackText('');
    setShowFeedbackModal(true);
  };

  // Modal close handlers
  const handleCloseGradeModal = () => {
    setShowGradeModal(false);
    setSelectedAssignment(null);
    setGradeValue('');
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

  const handleSubmitGrade = () => {
    if (selectedAssignment && gradeValue) {
      const score = parseInt(gradeValue);
      if (!isNaN(score) && score >= 0 && score <= selectedAssignment.maxScore) {
        alert(`Grade ${score}/${selectedAssignment.maxScore} submitted for ${selectedAssignment.title}`);
        handleCloseGradeModal();
      } else {
        alert('Please enter a valid grade');
      }
    }
  };

  const handleSubmitFeedback = () => {
    if (selectedAssignment && feedbackText.trim()) {
      alert(`Feedback submitted for ${selectedAssignment.title}:\n\n${feedbackText}`);
      handleCloseFeedbackModal();
    } else {
      alert('Please enter feedback text');
    }
  };

  const handleUpdateRubric = (criteria, field, value) => {
    setGradingRubric(prev => ({
      ...prev,
      [criteria]: {
        ...prev[criteria],
        [field]: value
      }
    }));
  };

  const calculateTotalScore = () => {
    return Object.values(gradingRubric).reduce((sum, criteria) => sum + criteria.score, 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending</span>;
      case 'graded':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Graded</span>;
      case 'needs_review':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Needs Review</span>;
      default:
        return null;
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
          {/* <div className="mt-4 md:mt-0">
            <button className="px-6 py-3 bg-white text-purple-600 hover:bg-gray-100 font-semibold rounded-lg">
              Upload Grades
            </button>
          </div> */}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="">
        {/* Left Column - Grading Interface */}
        <div className="">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Assignment Submissions</h2>
              
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-500" size={20} />
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.assignments})
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="graded">Graded</option>
                  <option value="needs_review">Needs Review</option>
                </select>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>
              </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
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
                        <button
                          onClick={() => handleDownloadSubmission(assignment.id)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                        >
                          <Download size={16} />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handleGradeAssignment(assignment.id)}
                          className="px-4 py-2 bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white rounded-lg flex items-center space-x-2"
                        >
                          <Edit size={16} />
                          <span>Grade Now</span>
                        </button>
                        <button
                          onClick={() => handlePreview(assignment.id)}
                          className="px-4 py-2 border border-purple-500 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center space-x-2"
                        >
                          <Eye size={16} />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => handleAddFeedback(assignment.id)}
                          className="px-4 py-2 border border-green-500 text-green-600 hover:bg-green-50 rounded-lg flex items-center space-x-2"
                        >
                          <MessageSquare size={16} />
                          <span>Add Feedback</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-gray-600">
                Showing {filteredAssignments.length} of {assignments.length} assignments
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">
                  Previous
                </button>
                <button className="px-4 py-2 bg-primary-dark text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Grading Tools */}
        <div className="space-y-6">
          {/* Grading Rubric */}
          {/* <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Grading Rubric</h2>
              <Star className="text-yellow-500" size={20} />
            </div>

            <div className="space-y-4">
              {Object.entries(gradingRubric).map(([key, criteria]) => (
                <div key={key} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">
                      {key === 'criteria1' && 'Code Quality & Structure'}
                      {key === 'criteria2' && 'Functionality & Features'}
                      {key === 'criteria3' && 'Documentation & Comments'}
                      {key === 'criteria4' && 'Design & User Experience'}
                    </span>
                    <span className="font-bold text-gray-800">{criteria.score}/{criteria.max}</span>
                  </div>
                  
                  <div className="mb-3">
                    <input
                      type="range"
                      min="0"
                      max={criteria.max}
                      value={criteria.score}
                      onChange={(e) => handleUpdateRubric(key, 'score', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <textarea
                    value={criteria.comment}
                    onChange={(e) => handleUpdateRubric(key, 'comment', e.target.value)}
                    placeholder="Add comments for this criteria..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    rows="2"
                  />
                </div>
              ))}

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-800">Total Score</span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculateTotalScore()}/100
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${calculateTotalScore()}%` }}
                  ></div>
                </div>
              </div>

              <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
                <Send size={16} className="inline mr-2" />
                Publish Grade
              </button>
            </div>
          </div> */}

          {/* Quick Actions */}
          {/* <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => alert('Downloading all submissions...')}
                className="w-full p-4 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg text-left"
              >
                <div className="flex items-center space-x-3">
                  <Download size={20} />
                  <div>
                    <p className="font-medium">Download All Submissions</p>
                    <p className="text-sm text-gray-600">Batch download pending work</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => alert('Opening template upload...')}
                className="w-full p-4 border border-green-500 text-green-600 hover:bg-green-50 rounded-lg text-left"
              >
                <div className="flex items-center space-x-3">
                  <Upload size={20} />
                  <div>
                    <p className="font-medium">Upload Grading Template</p>
                    <p className="text-sm text-gray-600">Import scores from CSV</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => alert('Opening grade distribution...')}
                className="w-full p-4 border border-purple-500 text-purple-600 hover:bg-purple-50 rounded-lg text-left"
              >
                <div className="flex items-center space-x-3">
                  <Award size={20} />
                  <div>
                    <p className="font-medium">View Grade Distribution</p>
                    <p className="text-sm text-gray-600">Analytics & statistics</p>
                  </div>
                </div>
              </button>
            </div>
          </div> */}

          {/* Recent Grades */}
          {/* <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recently Graded</h2>
              <Clock className="text-gray-500" size={20} />
            </div>

            <div className="space-y-3">
              {assignments
                .filter(a => a.status === 'graded')
                .slice(0, 3)
                .map((assignment) => (
                  <div key={assignment.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800 truncate">{assignment.title}</span>
                      <span className={`font-bold ${
                        assignment.score >= 90 ? 'text-green-600' :
                        assignment.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {assignment.score}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{assignment.student}</p>
                  </div>
                ))}
            </div>

            <Link 
              href="/teacher/analytics"
              className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All Grades →
            </Link>
          </div> */}
        </div>
      </div>

      {/* Grade Assignment Modal */}
      {showGradeModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Grade Assignment</h3>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Score (out of {selectedAssignment.maxScore})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedAssignment.maxScore}
                    value={gradeValue}
                    onChange={(e) => setGradeValue(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter score"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="Add any additional comments or notes..."
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
                className="px-4 py-2 bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white rounded-lg"
              >
                Submit Grade
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
              <h3 className="text-xl font-bold text-gray-800">Preview Assignment</h3>
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
                  <h5 className="font-bold text-gray-800 mb-2">Assignment Description</h5>
                  <p className="text-gray-600">{selectedAssignment.description}</p>
                </div>
                
                <div>
                  <h5 className="font-bold text-gray-800 mb-2">Submission Details</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">File Type</p>
                      <p className="font-semibold">{selectedAssignment.fileType}</p>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">File Size</p>
                      <p className="font-semibold">{selectedAssignment.fileSize}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-bold text-gray-800 mb-2">Preview Content</h5>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-gray-600">Assignment content preview would appear here</p>
                        <p className="text-sm text-gray-500 mt-2">
                          For {selectedAssignment.fileType} files, you can view the content inline or download to preview
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClosePreviewModal}
                className="px-6 py-3 bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white rounded-lg"
              >
                Close Preview
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
                    rows="4"
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