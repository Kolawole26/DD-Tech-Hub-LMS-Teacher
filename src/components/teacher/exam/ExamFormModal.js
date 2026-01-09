import { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, Users, FileText, AlertCircle } from 'lucide-react';

export default function ExamFormModal({ exam, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    date: '',
    time: '',
    endTime: '',
    duration: '',
    totalMarks: '',
    passingMarks: '',
    type: 'written',
    description: '',
    instructions: '',
    location: '',
    students: '',
    allowLateSubmission: false,
    enablePlagiarismCheck: true,
    autoGrade: false,
  });

  const [errors, setErrors] = useState({});

  const courseOptions = [
    'CS-101 - Web Development',
    'CS-201 - Advanced JS',
    'CS-301 - React Development',
    'CS-401 - Backend Development',
    'CS-202 - Database Systems',
    'CS-102 - Frontend Design',
  ];

  const typeOptions = [
    { value: 'written', label: 'Written Exam' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'practical', label: 'Practical Exam' },
    { value: 'project', label: 'Project Submission' },
    { value: 'assignment', label: 'Assignment' },
  ];

  const locationOptions = [
    'Main Hall, Room 101',
    'Computer Lab 1',
    'Computer Lab 2',
    'Computer Lab 3',
    'Room 205',
    'Room 302',
    'Online - LMS Platform',
    'Online Submission',
  ];

  useEffect(() => {
    if (exam) {
      setFormData({
        title: exam.title || '',
        course: exam.course || '',
        date: exam.date || '',
        time: exam.time || '',
        endTime: exam.endTime || '',
        duration: exam.duration || '',
        totalMarks: exam.totalMarks || '',
        passingMarks: exam.passingMarks || '',
        type: exam.type || 'written',
        description: exam.description || '',
        instructions: exam.instructions || '',
        location: exam.location || '',
        students: exam.students || '',
        allowLateSubmission: exam.allowLateSubmission || false,
        enablePlagiarismCheck: exam.enablePlagiarismCheck !== false,
        autoGrade: exam.autoGrade || false,
      });
    }
  }, [exam]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.totalMarks) newErrors.totalMarks = 'Total marks is required';
    if (!formData.passingMarks) newErrors.passingMarks = 'Passing marks is required';
    
    if (formData.passingMarks && formData.totalMarks && 
        parseInt(formData.passingMarks) > parseInt(formData.totalMarks)) {
      newErrors.passingMarks = 'Passing marks cannot exceed total marks';
    }
    
    if (formData.endTime && formData.time && formData.endTime <= formData.time) {
      newErrors.endTime = 'End time must be after start time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    const submitData = {
      ...formData,
      totalMarks: parseInt(formData.totalMarks),
      passingMarks: parseInt(formData.passingMarks),
      students: parseInt(formData.students) || 0,
      duration: formData.duration || 'N/A',
    };

    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-dark to-primary-light p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{exam ? 'Edit Exam' : 'Create New Exam'}</h2>
              <p className="text-primary-lighter">{exam ? 'Update exam details' : 'Fill in the details to schedule a new examination'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Midterm Exam - Web Development"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle size={12} />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* Course and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent ${
                    errors.course ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a course</option>
                  {courseOptions.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </select>
                {errors.course && (
                  <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle size={12} />
                    <span>{errors.course}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                >
                  {typeOptions.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date, Time, Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>Date *</span>
                  </div>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>Start Time *</span>
                  </div>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent ${
                    errors.time ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>End Time</span>
                  </div>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent ${
                    errors.endTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                )}
              </div>
            </div>

            {/* Marks and Students */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} />
                    <span>Total Marks *</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  min="1"
                  max="500"
                  placeholder="e.g., 100"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent ${
                    errors.totalMarks ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.totalMarks && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalMarks}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} />
                    <span>Passing Marks *</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  min="1"
                  max={formData.totalMarks || 500}
                  placeholder="e.g., 40"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent ${
                    errors.passingMarks ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.passingMarks && (
                  <p className="mt-1 text-sm text-red-600">{errors.passingMarks}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Users size={16} />
                    <span>Duration (minutes)</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="480"
                  placeholder="e.g., 120"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                />
              </div>
            </div>

            {/* Location and Students */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                >
                  <option value="">Select location</option>
                  {locationOptions.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Users size={16} />
                    <span>Expected Students</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="students"
                  value={formData.students}
                  onChange={handleChange}
                  min="1"
                  max="500"
                  placeholder="e.g., 45"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide exam description and topics covered..."
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Provide exam instructions and guidelines..."
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              />
            </div>

            {/* Additional Settings */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Additional Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="enablePlagiarismCheck"
                    checked={formData.enablePlagiarismCheck}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-dark focus:ring-primary-dark"
                  />
                  <span className="text-gray-700">Enable plagiarism check</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="allowLateSubmission"
                    checked={formData.allowLateSubmission}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-dark focus:ring-primary-dark"
                  />
                  <span className="text-gray-700">Allow late submissions</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="autoGrade"
                    checked={formData.autoGrade}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary-dark focus:ring-primary-dark"
                  />
                  <span className="text-gray-700">Auto-grade multiple choice</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="rounded border-gray-300 text-primary-dark focus:ring-primary-dark"
                  />
                  <span className="text-gray-700">Require file upload</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary-dark hover:bg-primary-light text-white rounded-lg font-medium flex items-center space-x-2"
            >
              <Save size={20} />
              <span>{exam ? 'Update Exam' : 'Create Exam'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}