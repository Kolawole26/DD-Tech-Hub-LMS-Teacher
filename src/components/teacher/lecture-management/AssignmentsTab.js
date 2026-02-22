// components/teacher/lecture-management/AssignmentsTab.js
'use client';

import { useState } from 'react';
import { 
  FileText,
  Plus,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
  Save,
  AlertCircle
} from 'lucide-react';

export default function AssignmentsTab({ selectedCourse, searchQuery, courses }) {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'JavaScript Calculator',
      lectureMaterial: 'Introduction to JavaScript',
      dueDate: '2026-03-15',
      assignment: 'Build a calculator using JavaScript that can perform basic arithmetic operations (+, -, *, /). Include error handling for division by zero.',
      requirements: '- Create HTML structure with buttons for numbers and operators\n- Implement JavaScript functions for calculations\n- Add clear/reset functionality\n- Handle decimal numbers\n- Display error messages appropriately',
      course: 'Web App Development',
      status: 'active',
      submissions: 12,
      totalStudents: 45
    },
    {
      id: 2,
      title: 'CSS Flexbox Layout',
      lectureMaterial: 'CSS Grid & Flexbox',
      dueDate: '2026-03-20',
      assignment: 'Create a responsive card layout using Flexbox. The layout should display product cards in a grid that adjusts based on screen size.',
      requirements: '- Use Flexbox for layout (no Grid)\n- Cards should have image, title, description, and button\n- Implement responsive breakpoints\n- Add hover effects\n- Ensure accessibility',
      course: 'Web App Development',
      status: 'active',
      submissions: 5,
      totalStudents: 45
    },
    {
      id: 3,
      title: 'React Component Library',
      lectureMaterial: 'React State Management',
      dueDate: '2026-03-25',
      assignment: 'Build a reusable component library with at least 5 components (Button, Card, Modal, Input, Dropdown).',
      requirements: '- Each component should be properly documented\n- Include PropTypes or TypeScript\n- Add storybook stories\n- Implement proper state management\n- Write unit tests',
      course: 'React Masterclass',
      status: 'draft',
      submissions: 0,
      totalStudents: 28
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state for new assignment
  const [formData, setFormData] = useState({
    title: '',
    lectureMaterial: '',
    dueDate: '',
    assignment: '',
    requirements: '',
    course: ''
  });

  // Mock lecture materials for dropdown
  const lectureMaterials = [
    { id: 1, title: 'Introduction to JavaScript', course: 'Web App Development' },
    { id: 2, title: 'CSS Grid & Flexbox', course: 'Web App Development' },
    { id: 3, title: 'React State Management', course: 'React Masterclass' },
    { id: 4, title: 'Advanced JavaScript Concepts', course: 'Advanced JavaScript' }
  ];

  // Filter assignments based on course, search, and status
  const filteredAssignments = assignments.filter(assignment => {
    const courseMatch = selectedCourse === 'all' || assignment.course === courses.find(c => c.id === selectedCourse)?.name;
    const searchMatch = !searchQuery || 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.assignment.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = filterStatus === 'all' || assignment.status === filterStatus;
    return courseMatch && searchMatch && statusMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAssignments = filteredAssignments.slice(startIndex, startIndex + itemsPerPage);

  const handleAddAssignment = () => {
    if (!formData.title || !formData.lectureMaterial || !formData.dueDate || !formData.assignment) {
      alert('Please fill in all required fields');
      return;
    }

    const newAssignment = {
      id: assignments.length + 1,
      ...formData,
      status: 'active',
      submissions: 0,
      totalStudents: courses.find(c => c.name === formData.course)?.students || 0
    };

    setAssignments([newAssignment, ...assignments]);
    setShowAddModal(false);
    setFormData({
      title: '',
      lectureMaterial: '',
      dueDate: '',
      assignment: '',
      requirements: '',
      course: ''
    });
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setFormData({
      title: assignment.title,
      lectureMaterial: assignment.lectureMaterial,
      dueDate: assignment.dueDate,
      assignment: assignment.assignment,
      requirements: assignment.requirements,
      course: assignment.course
    });
    setSelectedAssignment(assignment);
    setShowAddModal(true);
  };

  const handleDeleteAssignment = (id) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Draft</span>;
      case 'archived':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Archived</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Assignments</h2>
        <button
          onClick={() => {
            setSelectedAssignment(null);
            setFormData({
              title: '',
              lectureMaterial: '',
              dueDate: '',
              assignment: '',
              requirements: '',
              course: ''
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white font-semibold rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={16} />
          <span>Add Assignment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {Math.min(startIndex + 1, filteredAssignments.length)} - {Math.min(startIndex + itemsPerPage, filteredAssignments.length)} of {filteredAssignments.length} assignments
        </div>
      </div>

      {/* Assignments Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Lecture Material</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Submissions</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAssignments.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center">
                  <AlertCircle className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-gray-600">No assignments found</p>
                </td>
              </tr>
            ) : (
              currentAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800">{assignment.title}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{assignment.course}</td>
                  <td className="py-4 px-4 text-gray-600">{assignment.lectureMaterial}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar size={14} />
                      <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(assignment.status)}</td>
                  <td className="py-4 px-4">
                    <span className="font-medium">{assignment.submissions}/{assignment.totalStudents}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewAssignment(assignment)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="p-1 text-primary-dark hover:text-primary-light hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredAssignments.length > 0 && (
        <div className="flex items-center justify-end space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === i + 1
                  ? 'bg-primary-dark text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Add/Edit Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedAssignment ? 'Edit Assignment' : 'Add New Assignment'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                  placeholder="e.g., JavaScript Calculator"
                />
              </div>

              <div className="">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lecture Material <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.lectureMaterial}
                    onChange={(e) => setFormData({ ...formData, lectureMaterial: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                  >
                    <option value="">Select a material</option>
                    {lectureMaterials
                      .filter(m => !formData.course || m.course === formData.course)
                      .map((material) => (
                        <option key={material.id} value={material.title}>
                          {material.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.assignment}
                  onChange={(e) => setFormData({ ...formData, assignment: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                  rows="4"
                  placeholder="Describe the assignment in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements (Optional)
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                  rows="6"
                  placeholder="List the requirements (one per line)..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssignment}
                className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{selectedAssignment ? 'Update Assignment' : 'Create Assignment'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Assignment Modal */}
      {showViewModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Assignment Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h4 className="text-lg font-bold text-gray-800 mb-2">{selectedAssignment.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Course:</span>
                    <span className="ml-2 font-medium">{selectedAssignment.course}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Lecture Material:</span>
                    <span className="ml-2 font-medium">{selectedAssignment.lectureMaterial}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Due Date:</span>
                    <span className="ml-2 font-medium flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2">{getStatusBadge(selectedAssignment.status)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-gray-800 mb-2">Assignment Description</h5>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedAssignment.assignment}</p>
              </div>

              {selectedAssignment.requirements && (
                <div>
                  <h5 className="font-bold text-gray-800 mb-2">Requirements</h5>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedAssignment.requirements}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-600">Submissions</p>
                      <p className="text-xl font-bold text-gray-800">
                        {selectedAssignment.submissions}/{selectedAssignment.totalStudents}
                      </p>
                    </div>
                    <div className="w-px h-10 bg-gray-300"></div>
                    <div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-xl font-bold text-gray-800">
                        {selectedAssignment.totalStudents > 0 
                          ? Math.round((selectedAssignment.submissions / selectedAssignment.totalStudents) * 100)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditAssignment(selectedAssignment);
                }}
                className="px-4 py-2 border border-primary-dark text-primary-dark hover:bg-primary-lighter rounded-lg transition-colors flex items-center space-x-2"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}