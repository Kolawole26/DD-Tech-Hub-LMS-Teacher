'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/image";

import {
  Home,
  Video,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Calendar,
  Settings,
  BookOpen,
  Award,
  Bell,
  Menu,
  X,
  LogOut,
  ClipboardCheck,
  GraduationCap,
  Presentation,
} from 'lucide-react';

export default function TeacherSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Teacher Dashboard', icon: Home, href: '/' },
    { id: 'lectures', label: 'Lecture Management', icon: Presentation, href: '/lectures' },
    { id: 'attendance', label: 'Attendance & Roster', icon: ClipboardCheck, href: '/attendance' },
    { id: 'grading', label: 'Assessment Grading', icon: FileText, href: '/grading' },
    // { id: 'discussions', label: 'Discussion Groups', icon: MessageSquare, href: '/discussions' },
    // { id: 'courses', label: 'My Courses', icon: BookOpen, href: '/courses' },
  ];

  const secondaryItems = [
    // { id: 'calendar', label: 'Schedule Calendar', icon: Calendar, href: '/calendar' },
    // { id: 'analytics', label: 'Performance Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside className={`
        ${isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        fixed md:relative z-50
        w-64 md:w-64
        h-screen
        bg-gradient-to-b from-primary to-primary
        text-white
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-primary-lighter border border-primary-light text-primary-dark p-2 rounded-full md:hidden"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>

        {/* Logo & Title - Fixed height section */}
        <div className="p-4 border-b border-primary-light flex-shrink-0">
          <div className=" mb-2 bg-white rounded-md w-fit  mx-auto">
            <Image src="/assets/images/ddTechLogo.png" alt="logo" width="50" height="50" className=" w-[80px] p-0" />
          </div>
          {/* <div className="mt-2">
            <div className="flex justify-between items-center text-sm">
              <span>Teacher Portal</span>
              <span className="bg-status-green text-white px-2 py-1 rounded-full">
                Active
              </span>
            </div>
          </div> */}
        </div>

        {/* Main Navigation - Scrollable section */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
          <h2 className="text-sm font-semibold text-primary-light uppercase tracking-wider px-4 py-2">
            TEACHING TOOLS
          </h2>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors border border-primary-lighter shadow-sm
                  ${isActive 
                    ? 'bg-primary-lighter border border-primary-light text-primary-dark' 
                    : 'text-white hover:text-primary-dark hover:bg-primary-lighter'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <h2 className="text-sm font-semibold text-primary-light uppercase tracking-wider px-4 py-2 mt-6">
            ADMINISTRATION
          </h2>
          
          {secondaryItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors border border-primary-lighter shadow-sm
                  ${isActive 
                    ? 'bg-primary-lighter border border-primary-light text-primary-dark' 
                    : 'text-white hover:text-primary-dark hover:bg-primary-lighter'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* <h2 className="text-sm font-semibold text-primary-light uppercase tracking-wider px-4 py-2 mt-6">
            ACCOUNT
          </h2>
          
          {secondaryItems.slice(2).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary-lighter border border-primary-light text-primary-dark' 
                    : 'text-white hover:text-primary-dark hover:bg-primary-lighter'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })} */}
        </nav>

        {/* Profile & Logout Section - Fixed bottom section */}
        <div className="flex-shrink-0 w-full p-4 border-t border-primary-light">
          <div className="flex items-center space-x-3 p-3 bg-primary-lighter rounded-lg mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="font-bold text-white">SJ</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-primary-dark">Dr. Sarah Johnson</p>
              <p className="text-sm text-primary-dark">Computer Science</p>
            </div>
          </div>
          
          {/* <Link 
            href="/"
            className="w-full flex items-center space-x-3 px-4 py-3 text-primary-dark hover:text-primary-darker hover:bg-primary-light rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Link> */}
        </div>
      </aside>
    </>
  );
}