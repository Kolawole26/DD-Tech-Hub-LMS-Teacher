'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/login');
      }
      
      if (isAuthenticated && isPublicRoute) {
        router.push('/');
      }
    }
  }, [isAuthenticated, loading, pathname, router, isPublicRoute]);

  if (loading) {
    return React.createElement(
      'div',
      {
        className: "min-h-screen flex items-center justify-center bg-gray-50"
      },
      React.createElement(
        'div',
        { className: "text-center" },
        [
          React.createElement(
            'div',
            {
              key: 'loader',
              className: "w-16 h-16 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"
            }
          ),
          React.createElement(
            'p',
            { key: 'text', className: "text-gray-600" },
            "Loading..."
          )
        ]
      )
    );
  }

  if (isPublicRoute) {
    return React.createElement(React.Fragment, null, children);
  }

  if (!isAuthenticated) {
    return null;
  }

  return React.createElement(React.Fragment, null, children);
}