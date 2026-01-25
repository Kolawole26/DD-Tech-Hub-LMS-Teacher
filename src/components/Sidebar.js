'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';

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
  ChevronDown,
  ChevronRight,
  FolderKanban,
} from 'lucide-react';

export default function TeacherSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({
    teachingTools: false,
    assessment: false,
  });
  const pathname = usePathname();
  const router = useRouter();

    // Use AuthContext instead of direct localStorage
  const { user, logout, isAuthenticated } = useAuth();

  // Load user info from AuthContext
  const userInfo = user;

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout(); // Use logout from AuthContext
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

    // Format user name
  const getUserFullName = () => {
    if (!userInfo) return 'Administrator';
    const firstName = userInfo.first_name || '';
    const lastName = userInfo.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Administrator';
  };

  const getUserInitials = () => {
  if (!userInfo) return 'A';
  
  const { first_name = '', last_name = '' } = userInfo;
  
  // Filter out empty strings and get first letters
  const initials = [first_name, last_name]
    .filter(name => name.trim())
    .map(name => name.charAt(0).toUpperCase())
    .join('');
  
  return initials || 'A';
};

    // Get user email
  const getUserEmail = () => {
    if (!userInfo) return 'admin@example.com';
    return userInfo.email || 'admin@example.com';
  };

    // Get user role with proper formatting
  const getUserRole = () => {
    if (!userInfo) return 'Teacher';
    
    if (userInfo.role) {
      const role = userInfo.role;
      return role === 'Super Admin' ? 'Super Admin' : 
             role === 'Admin' ? 'Teacher' : 
             role.charAt(0).toUpperCase() + role.slice(1);
    }
    
    return userInfo.type || 'Teacher';
  };

  const teachingToolsItems = [
    { id: 'dashboard', label: 'Teacher Dashboard', icon: Home, href: '/' },
    { id: 'lectures', label: 'Lecture Management', icon: Presentation, href: '/lectures' },
    { id: 'attendance', label: 'Attendance & Roster', icon: ClipboardCheck, href: '/attendance' },
  ];

  const assessmentItems = [
    { id: 'grading', label: 'Assessment Grading', icon: FileText, href: '/grading' },
    { id: 'exam', label: 'Exam Management', icon: FolderKanban, href: '/exam' },
    { id: 'assignments', label: 'Assignment Review', icon: BookOpen, href: '/assignments' },
  ];

  const directLinks = [
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

    // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <LogOut className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to log out? You will need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div className="mb-2 bg-white rounded-md w-fit mx-auto">
            <Image src="/assets/images/ddTechLogo.png" alt="logo" width="50" height="50" className="w-[80px] p-0" />
          </div>
        </div>

        {/* Main Navigation - Scrollable section */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
          {/* Teaching Tools Dropdown */}
          <div className="mb-4">
            <button
              onClick={() => toggleDropdown('teachingTools')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors border border-primary-lighter text-white hover:text-primary-dark hover:bg-primary-lighter"
            >
              <div className="flex items-center space-x-3">
                <Presentation size={20} />
                <span className="font-medium">Teaching Tools</span>
              </div>
              {openDropdowns.teachingTools ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            
            {openDropdowns.teachingTools && (
              <div className="ml-8 mt-2 space-y-1">
                {teachingToolsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`
                        flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm
                        ${isActive 
                          ? 'bg-primary-lighter border border-primary-light text-primary-dark' 
                          : 'text-primary-light hover:text-white hover:bg-primary-lighter/50'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Assessment Management Dropdown */}
          <div className="mb-4">
            <button
              onClick={() => toggleDropdown('assessment')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors border border-primary-lighter text-white hover:text-primary-dark hover:bg-primary-lighter"
            >
              <div className="flex items-center space-x-3">
                <FileText size={20} />
                <span className="font-medium">Assessment Management</span>
              </div>
              {openDropdowns.assessment ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            
            {openDropdowns.assessment && (
              <div className="ml-8 mt-2 space-y-1">
                {assessmentItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`
                        flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm
                        ${isActive 
                          ? 'bg-primary-lighter border border-primary-light text-primary-dark' 
                          : 'text-primary-light hover:text-white hover:bg-primary-lighter/50'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Direct Links - Added gap between buttons */}
          <div className="mt-6 pt-4 border-t border-primary-light/30 space-y-3">
            {directLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors border border-primary-lighter block
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
          </div>
        </nav>

        {/* Profile & Logout Section - Fixed bottom section */}
        <div className="flex-shrink-0 w-full p-4 border-t border-primary-light">
          <div className="flex items-center space-x-3 p-3 bg-primary-lighter rounded-lg mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="font-bold text-white">{getUserInitials()}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-primary-dark">{getUserFullName()}</p>
              <p className="text-sm text-primary-dark">{getUserRole()}</p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors border border-primary-lighter text-white hover:text-primary-dark hover:bg-primary-lighter
            `}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}