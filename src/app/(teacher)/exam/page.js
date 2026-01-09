'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Users,
  FileText,
  BarChart3,
  Plus,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import ExamCard from '@/components/teacher/exam/ExamCard';
import ExamFormModal from '@/components/teacher/exam/ExamFormModal';
import ExamStats from '@/components/teacher/exam/ExamStats';
import ExamDetailModal from '@/components/teacher/exam/ExamDetailModal';

export default function ExamManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([]);
  const [filterType, setFilterType] = useState('all');

  // Initialize with sample data
  useEffect(() => {
    const sampleExams = [
      {
        id: 1,
        title: 'Midterm Exam - Web Development',
        course: 'CS-101 - Web Development',
        date: '2024-03-15',
        time: '10:00 AM',
        endTime: '12:00 PM',
        duration: '120',
        totalMarks: 100,
        passingMarks: 40,
        status: 'upcoming',
        students: 45,
        submissions: 0,
        type: 'written',
        description: 'Covers HTML, CSS, and JavaScript fundamentals',
        createdBy: 'Dr. Sarah Johnson',
        createdAt: '2024-02-15',
        instructions: 'Bring your student ID. No electronic devices allowed.',
        location: 'Main Hall, Room 101',
        allowLateSubmission: false,
        enablePlagiarismCheck: true,
        autoGrade: false,
      },
      {
        id: 2,
        title: 'Final Project Submission',
        course: 'CS-201 - Advanced JS',
        date: '2024-03-10',
        time: '11:59 PM',
        endTime: '11:59 PM',
        duration: 'N/A',
        totalMarks: 150,
        passingMarks: 60,
        status: 'active',
        students: 38,
        submissions: 15,
        type: 'project',
        description: 'Build a full-stack web application',
        createdBy: 'Dr. Sarah Johnson',
        createdAt: '2024-02-01',
        instructions: 'Submit your GitHub repository link',
        location: 'Online Submission',
        allowLateSubmission: true,
        enablePlagiarismCheck: true,
        autoGrade: false,
      },
      {
        id: 3,
        title: 'Quiz - React Fundamentals',
        course: 'CS-301 - React Development',
        date: '2024-03-05',
        time: '02:00 PM',
        endTime: '03:00 PM',
        duration: '60',
        totalMarks: 50,
        passingMarks: 20,
        status: 'completed',
        students: 42,
        submissions: 42,
        graded: 30,
        type: 'quiz',
        description: 'Multiple choice questions on React basics',
        createdBy: 'Dr. Sarah Johnson',
        createdAt: '2024-02-20',
        instructions: '20 multiple choice questions',
        location: 'Online - LMS Platform',
        allowLateSubmission: false,
        enablePlagiarismCheck: false,
        autoGrade: true,
      },
      {
        id: 4,
        title: 'Practical Exam - API Integration',
        course: 'CS-401 - Backend Development',
        date: '2024-03-20',
        time: '09:00 AM',
        endTime: '11:00 AM',
        duration: '120',
        totalMarks: 100,
        passingMarks: 40,
        status: 'upcoming',
        students: 35,
        submissions: 0,
        type: 'practical',
        description: 'Build REST APIs with authentication',
        createdBy: 'Dr. Sarah Johnson',
        createdAt: '2024-02-25',
        instructions: 'Use Node.js and Express',
        location: 'Computer Lab 3',
        allowLateSubmission: false,
        enablePlagiarismCheck: true,
        autoGrade: false,
      },
      {
        id: 5,
        title: 'Term Test - Database Concepts',
        course: 'CS-202 - Database Systems',
        date: '2024-02-28',
        time: '10:00 AM',
        endTime: '12:00 PM',
        duration: '120',
        totalMarks: 100,
        passingMarks: 40,
        status: 'graded',
        students: 40,
        submissions: 40,
        graded: 40,
        averageScore: 78.5,
        type: 'written',
        description: 'SQL queries and database design',
        createdBy: 'Dr. Sarah Johnson',
        createdAt: '2024-02-01',
        instructions: 'Open book, no internet',
        location: 'Room 205',
        allowLateSubmission: false,
        enablePlagiarismCheck: true,
        autoGrade: false,
      },
      {
        id: 6,
        title: 'Assignment - CSS Frameworks',
        course: 'CS-102 - Frontend Design',
        date: '2024-03-08',
        time: '11:59 PM',
        endTime: '11:59 PM',
        duration: 'N/A',
        totalMarks: 75,
        passingMarks: 30,
        status: 'active',
        students: 50,
        submissions: 32,
        type: 'assignment',
        description: 'Create responsive layouts with Tailwind CSS',
        createdBy: 'Dr. Sarah Johnson',
        createdAt: '2024-02-22',
        instructions: 'Submit as a GitHub Pages link',
        location: 'Online Submission',
        allowLateSubmission: true,
        enablePlagiarismCheck: true,
        autoGrade: false,
      },
    ];
    setExams(sampleExams);
  }, []);

  const tabs = [
    { id: 'all', label: 'All Exams', count: exams.length },
    { id: 'upcoming', label: 'Upcoming', count: exams.filter(e => e.status === 'upcoming').length },
    { id: 'active', label: 'Active', count: exams.filter(e => e.status === 'active').length },
    { id: 'completed', label: 'Completed', count: exams.filter(e => e.status === 'completed').length },
    { id: 'graded', label: 'Graded', count: exams.filter(e => e.status === 'graded').length },
  ];

  const filteredExams = exams.filter(exam => {
    if (activeTab !== 'all' && exam.status !== activeTab) return false;
    if (filterType !== 'all' && exam.type !== filterType) return false;
    if (searchQuery) {
      return exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             exam.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
             exam.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleCreateExam = (examData) => {
    const newExam = {
      id: exams.length + 1,
      ...examData,
      students: parseInt(examData.students) || 0,
      submissions: 0,
      status: 'upcoming',
      createdBy: 'Dr. Sarah Johnson',
      createdAt: new Date().toISOString().split('T')[0],
      graded: 0,
    };
    setExams([newExam, ...exams]);
    setShowCreateModal(false);
    alert(`Exam "${examData.title}" created successfully!`);
  };

  const handleUpdateExam = (examData) => {
    setExams(exams.map(exam => 
      exam.id === editingExam.id ? { ...exam, ...examData } : exam
    ));
    setEditingExam(null);
    setShowCreateModal(false);
    alert(`Exam "${examData.title}" updated successfully!`);
  };

  const handleDeleteExam = (id) => {
    if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      setExams(exams.filter(exam => exam.id !== id));
      alert('Exam deleted successfully!');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setExams(exams.map(exam => 
      exam.id === id ? { ...exam, status: newStatus } : exam
    ));
    alert(`Exam status changed to ${newStatus}`);
  };

  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setShowCreateModal(true);
  };

  const handleViewDetails = (exam) => {
    setSelectedExam(exam);
    setShowDetailModal(true);
  };

  const handleGradeExam = (id) => {
    // Navigate to grading page or open grading modal
    alert(`Redirecting to grading interface for exam ID: ${id}`);
    // In a real app: router.push(`/teacher/exam/${id}/grade`);
  };

  const handleExportResults = (id) => {
    const exam = exams.find(e => e.id === id);
    if (!exam) return;

    const data = {
      exam: {
        title: exam.title,
        course: exam.course,
        date: exam.date,
        totalMarks: exam.totalMarks,
      },
      statistics: {
        totalStudents: exam.students,
        submissions: exam.submissions,
        submissionRate: exam.students > 0 ? Math.round((exam.submissions / exam.students) * 100) : 0,
        averageScore: exam.averageScore || 'N/A',
      },
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_results_${exam.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    alert(`Results for "${exam.title}" exported successfully!`);
  };

  const handleBulkExport = () => {
    const exportData = {
      exams: filteredExams.map(exam => ({
        id: exam.id,
        title: exam.title,
        course: exam.course,
        status: exam.status,
        date: exam.date,
        submissions: exam.submissions,
        totalMarks: exam.totalMarks,
      })),
      exportDate: new Date().toISOString(),
      totalExams: filteredExams.length,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_exams_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    alert(`Exported ${filteredExams.length} exams successfully!`);
  };

  const handleSendReminders = () => {
    const upcomingExams = exams.filter(e => e.status === 'upcoming');
    if (upcomingExams.length === 0) {
      alert('No upcoming exams to send reminders for.');
      return;
    }
    
    const confirmed = window.confirm(
      `Send reminders to students for ${upcomingExams.length} upcoming exam(s)?`
    );
    
    if (confirmed) {
      // Simulate API call
      setTimeout(() => {
        alert(`Reminders sent successfully for ${upcomingExams.length} exam(s)!`);
      }, 1000);
    }
  };

  const handleQuickActivate = () => {
    const upcomingExams = exams.filter(e => e.status === 'upcoming');
    if (upcomingExams.length === 0) {
      alert('No upcoming exams to activate.');
      return;
    }

    const confirmed = window.confirm(
      `Activate ${upcomingExams.length} upcoming exam(s)? This will make them available for submissions.`
    );
    
    if (confirmed) {
      setExams(exams.map(exam => 
        exam.status === 'upcoming' ? { ...exam, status: 'active' } : exam
      ));
      alert(`${upcomingExams.length} exam(s) activated successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Exam Management</h1>
            <p className="text-primary-lighter">Create, schedule, and manage all course examinations</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <button
              onClick={handleSendReminders}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center space-x-2"
            >
              <AlertCircle size={16} />
              <span>Send Reminders</span>
            </button>
            <button
              onClick={handleQuickActivate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2"
            >
              <CheckCircle size={16} />
              <span>Quick Activate</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white text-gray-800 hover:bg-gray-100 font-semibold rounded-lg flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create New Exam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleBulkExport}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export All</span>
            </button>
            <button
              onClick={() => alert('Feature coming soon!')}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg flex items-center space-x-2"
            >
              <Calendar size={16} />
              <span>Schedule All</span>
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredExams.length} of {exams.length} exams
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <ExamStats exams={exams} />

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search exams by title, course, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <span className="text-gray-600">Filter by:</span>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="written">Written</option>
              <option value="quiz">Quiz</option>
              <option value="practical">Practical</option>
              <option value="project">Project</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-1 pb-4 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-dark text-primary-dark font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-primary-dark text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onDelete={handleDeleteExam}
            onEdit={handleEditExam}
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
            onGrade={handleGradeExam}
            onExportResults={handleExportResults}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredExams.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No exams found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? 'Try a different search term' : 'Create your first exam to get started'}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary-dark hover:bg-primary-light text-white rounded-lg"
          >
            Create New Exam
          </button>
        </div>
      )}

      {/* Create/Edit Exam Modal */}
      {showCreateModal && (
        <ExamFormModal
          exam={editingExam}
          onClose={() => {
            setShowCreateModal(false);
            setEditingExam(null);
          }}
          onSubmit={editingExam ? handleUpdateExam : handleCreateExam}
        />
      )}

      {/* Exam Detail Modal */}
      {showDetailModal && selectedExam && (
        <ExamDetailModal
          exam={selectedExam}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedExam(null);
          }}
          onEdit={() => {
            setShowDetailModal(false);
            handleEditExam(selectedExam);
          }}
          onDelete={() => {
            setShowDetailModal(false);
            handleDeleteExam(selectedExam.id);
          }}
        />
      )}
    </div>
  );
}