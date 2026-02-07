// LectureManagementContent.js
'use client';

import { useState, useRef, useEffect } from 'react';
import LectureMaterialsTab from '@/components/teacher/lecture-management/LectureMaterialsTab';
import LiveSessionsTab from '@/components/teacher/lecture-management/LiveSessionsTab';
import RecordingsTab from '@/components/teacher/lecture-management/RecordingsTab';
import ScheduleModal from '@/components/teacher/modals/ScheduleModal';
import { 
  Calendar,
  Search,
  Upload,
  X
} from 'lucide-react';

export default function LectureManagementContent() {
  const [activeTab, setActiveTab] = useState('materials');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const courses = [
    { id: 'all', name: 'All Courses' },
    { id: 'cs101', name: 'Web App Development' },
    { id: 'cs201', name: 'Advanced JavaScript' },
    { id: 'cs301', name: 'React Masterclass' },
    { id: 'cs401', name: 'Full Stack Development' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Lecture Management</h1>
            <p className="text-primary-lighter">Upload materials, conduct live sessions, and manage recordings</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-6 py-3 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg transition-colors flex items-center space-x-2"
            >
              <Calendar size={20} />
              <span>Schedule Live</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex space-x-1 mb-4 md:mb-0 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'materials'
                  ? 'bg-white text-primary-dark shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Lecture Materials
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'live'
                  ? 'bg-white text-primary-dark shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Live Sessions
            </button>
            <button
              onClick={() => setActiveTab('recordings')}
              className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'recordings'
                  ? 'bg-white text-primary-dark shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Recordings
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'materials' && (
          <LectureMaterialsTab
            selectedCourse={selectedCourse}
            searchQuery={searchQuery}
            courses={courses}
          />
        )}

        {activeTab === 'live' && (
          <LiveSessionsTab
            selectedCourse={selectedCourse}
            searchQuery={searchQuery}
            courses={courses}
            onScheduleLive={() => setShowScheduleModal(true)}
          />
        )}

        {activeTab === 'recordings' && (
          <RecordingsTab
            selectedCourse={selectedCourse}
            searchQuery={searchQuery}
            courses={courses}
          />
        )}
      </div>

      {/* Modals */}
      {showScheduleModal && (
        <ScheduleModal
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
}