'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Video, 
  FileText, 
  Calendar, 
  BarChart3, 
  MessageSquare,
  Clock,
  Award,
  TrendingUp,
  BookOpen,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

export default function TeacherDashboardContent() {
  const [activeTab, setActiveTab] = useState('today');

  const courses = [
    {
      id: 1,
      title: 'Web App Development',
      code: 'CS101',
      students: 45,
      progress: 75,
      nextClass: 'Today, 10:00 AM',
      assignmentsDue: 3,
      discussions: 8,
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      code: 'CS201',
      students: 32,
      progress: 60,
      nextClass: 'Tomorrow, 2:00 PM',
      assignmentsDue: 1,
      discussions: 12,
    },
    {
      id: 3,
      title: 'React Masterclass',
      code: 'CS301',
      students: 28,
      progress: 40,
      nextClass: 'Wednesday, 11:00 AM',
      assignmentsDue: 2,
      discussions: 5,
    },
  ];

  const upcomingClasses = [
    {
      id: 1,
      course: 'Web App Development',
      time: 'Today, 10:00 AM - 12:00 PM',
      type: 'live',
      students: 45,
      topic: 'Advanced JavaScript Concepts',
    }
  ];

  const stats = [
    { label: 'Total Students', value: '105', icon: Users, color: 'blue', change: '+12%' },
    { label: 'Active Courses', value: '3', icon: BookOpen, color: 'green', change: '' },
    { label: 'Avg. Attendance', value: '92%', icon: TrendingUp, color: 'purple', change: '+5%' },
    { label: 'Assignments Graded', value: '24/36', icon: Award, color: 'orange', change: '66%' },
  ];

  const recentActivities = [
    { id: 1, action: 'Graded Assignment 2', course: 'Web App Dev', time: '2 hours ago' },
    { id: 2, action: 'Uploaded Lecture Slides', course: 'Advanced JS', time: '5 hours ago' },
    { id: 3, action: 'Posted Announcement', course: 'React Masterclass', time: '1 day ago' },
    { id: 4, action: 'Updated Course Syllabus', course: 'Web App Dev', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary-light rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Dr. Sarah Johnson!</h1>
            <p className="text-primary-lighter">Manage your courses, students, and instructional duties</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm">
              <span>Teacher ID: TEA20251213</span>
              <span className="bg-green-500 px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
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
                  {stat.change && (
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  )}
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Courses & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Courses */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
              <Link 
                href="/courses" 
                className="text-primary-dark hover:text-primary font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-primary-lighter rounded-lg">
                          <BookOpen className="text-primary-dark" size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{course.title}</h3>
                          <p className="text-sm text-gray-600">Course Code: {course.code}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Students</p>
                          <p className="font-bold text-gray-800">{course.students}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Progress</p>
                          <p className="font-bold text-gray-800">{course.progress}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Assignments</p>
                          <p className="font-bold text-gray-800">{course.assignmentsDue}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Discussions</p>
                          <p className="font-bold text-gray-800">{course.discussions}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link 
                          href={`/lectures?course=${course.id}`}
                          className="px-4 py-2 bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white rounded-lg text-sm"
                        >
                          Manage Lectures
                        </Link>
                        {/* <Link 
                          href={`/discussions?course=${course.id}`}
                          className="px-4 py-2 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                        >
                          Discussion Group
                        </Link> */}
                        <Link 
                          href={`/grading?course=${course.id}`}
                          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                        >
                          Grade Assignments
                        </Link>
                        <Link 
                          href={`/attendance?course=${course.id}`}
                          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                        >
                          Take Attendance
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link 
                href="/lectures"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all hover:shadow-lg"
              >
                <Video size={32} className="mb-3" />
                <span className="font-semibold text-lg">Upload Lecture</span>
                <span className="text-sm opacity-90 mt-1">Materials & Videos</span>
              </Link>
              
              <Link 
                href="/lectures?tab=live"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all hover:shadow-lg"
              >
                <PlayCircle size={32} className="mb-3" />
                <span className="font-semibold text-lg">Start Live Class</span>
                <span className="text-sm opacity-90 mt-1">Begin session</span>
              </Link>
              
              <Link 
                href="/grading"
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all hover:shadow-lg"
              >
                <FileText size={32} className="mb-3" />
                <span className="font-semibold text-lg">Grade Assignments</span>
                <span className="text-sm opacity-90 mt-1">Review submissions</span>
              </Link>
              
              {/* <Link 
                href="/discussions"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all hover:shadow-lg"
              >
                <MessageSquare size={32} className="mb-3" />
                <span className="font-semibold text-lg">Discussion Groups</span>
                <span className="text-sm opacity-90 mt-1">Monitor & participate</span>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Right Column - Schedule & Activities */}
        <div className="space-y-6">
          {/* Upcoming Classes */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Upcoming Classes</h2>
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    activeTab === 'today'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveTab('week')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    activeTab === 'week'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  This Week
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{classItem.course}</h3>
                      <p className="text-sm text-gray-600">{classItem.topic}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      classItem.type === 'live'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {classItem.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{classItem.time}</span>
                    </span>
                    <span>•</span>
                    <span>{classItem.students} students</span>
                  </div>

                  <div className="flex space-x-2">
                    <Link 
                      href={`/lectures?start=${classItem.id}`}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg text-center"
                    >
                      Start Class
                    </Link>
                    <Link 
                      href={`/attendance?class=${classItem.id}`}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded-lg text-center"
                    >
                      Take Attendance
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* <Link 
              href="/calendar"
              className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-400 transition-colors flex items-center justify-center space-x-2"
            >
              <Calendar size={16} />
              <span>View Full Calendar</span>
            </Link> */}
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
              <MoreVertical className="text-gray-400" size={20} />
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{activity.course}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <button className="w-full mt-4 text-center text-primary-dark hover:text-primary font-medium text-sm">
              View All Activities →
            </button> */}
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Pending Tasks</h2>
              <AlertCircle className="text-yellow-500" size={20} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="text-yellow-600" size={16} />
                  <span className="font-medium">Grade Assignment 2</span>
                </div>
                <span className="text-sm text-yellow-700">Due Today</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Video className="text-blue-600" size={16} />
                  <span className="font-medium">Upload Lecture Videos</span>
                </div>
                <span className="text-sm text-blue-700">3 pending</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="text-green-600" size={16} />
                  <span className="font-medium">Submit Attendance</span>
                </div>
                <span className="text-sm text-green-700">2 classes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}