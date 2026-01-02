'use client';

import { Bell, Calendar, Search, Settings, Users, Video } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getPageTitle = () => {
    if (pathname.includes('dashboard')) return 'Teacher Dashboard';
    if (pathname.includes('lectures')) return 'Lecture Management';
    if (pathname.includes('attendance')) return 'Attendance Management';
    if (pathname.includes('grading')) return 'Assessment Grading';
    if (pathname.includes('discussions')) return 'Discussion Groups';
    if (pathname.includes('courses')) return 'My Courses';
    if (pathname.includes('calendar')) return 'Schedule Calendar';
    if (pathname.includes('analytics')) return 'Performance Analytics';
    if (pathname.includes('notifications')) return 'Notifications';
    if (pathname.includes('settings')) return 'Settings';
    return 'Teacher Portal';
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 py-3 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Left Section - Date & Title */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-gray-600">
              <Calendar size={20} />
              <span className="font-medium">{currentDate}</span>
            </div>
            <div className="md:hidden">
              <h2 className="text-lg font-bold text-gray-800">{getPageTitle()}</h2>
            </div>
            <div className="text-sm bg-primary-lighter text-primary-darker px-3 py-1 rounded-full font-medium">
              Teacher Mode
            </div>
          </div>

          {/* Right Section - Search & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative flex-1 md:flex-initial">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students, courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            {/* Notification Bell */}
            <Link href="/teacher/notifications" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-status-red rounded-full"></span>
            </Link>

            {/* Profile */}
            <Link href="/teacher/settings" className="p-2 text-gray-600 hover:text-primary transition-colors">
              <Settings size={24} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}