'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, LogIn, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

        setTimeout(() => {
          router.push('/');
        }, 1000);

    // Simulate API call
    setTimeout(() => {
      // Mock login logic
      if (formData.email === 'admin@edutech.com' && formData.password === 'password123') {
        setSuccess('Login successful! Redirecting...');
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        
        // Redirect after delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1500);
  };


  const handleDemoLogin = (role) => {
    setFormData({
      email: `${role}@edutech.com`,
      password: 'demo123'
    });
    
    setTimeout(() => {
      setSuccess(`Demo login as ${role} ready. Click Login to continue.`);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-dark to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/8 rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div>
            <div className="flex items-center gap-3 mb-8">
                        <div className=" bg-white rounded-xl">
                          <Image src="/assets/images/ddTechLogo.png" alt="logo" width="50" height="50" className="w-[80px] p-0" />
                        </div>
              <div>
                <h1 className="text-2xl font-bold">DDTech</h1>
                <p className="text-primary-lighter text-sm">Learning Platform</p>
              </div>
            </div>

            <div className="mt-20">
              <h2 className="text-4xl font-bold mb-6">Welcome to DDTech Teacher</h2>
              <p className="text-xl text-primary-lighter mb-10">
                Manage your educational platform with powerful tools and analytics
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Secure Access</h3>
                    <p className="text-primary-lighter text-sm">Enterprise-grade security</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Real-time Analytics</h3>
                    <p className="text-primary-lighter text-sm">Monitor platform performance</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Team Collaboration</h3>
                    <p className="text-primary-lighter text-sm">Manage teachers and staff</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 bg-white/20 rounded-full border-2 border-primary-dark"></div>
              ))}
            </div>
            <div>
              <p className="font-medium">Join 500+ administrators</p>
              <p className="text-primary-lighter text-sm">Managing educational platforms worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-dark rounded-2xl mb-4">
              <BookOpen className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">DDTech Teacher</h1>
            <p className="text-gray-600 mt-2">Sign in to your admin dashboard</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access the dashboard</p>
          </div>

          {/* Demo Login Buttons */}
          {/* <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => handleDemoLogin('admin')}
              className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors border border-blue-100"
            >
              Admin
            </button>
            <button
              onClick={() => handleDemoLogin('teacher')}
              className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-100 transition-colors border border-green-100"
            >
              Teacher
            </button>
            <button
              onClick={() => handleDemoLogin('moderator')}
              className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm hover:bg-purple-100 transition-colors border border-purple-100"
            >
              Moderator
            </button>
          </div> */}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                  placeholder="admin@edutech.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link 
                  href="/forgot-password"
                  className="text-sm text-primary-dark hover:text-primary transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-dark rounded focus:ring-primary-dark"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            </div>

            {/* Error/Success Messages */}
            {/* {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-sm text-green-700">{success}</span>
              </div>
            )} */}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-dark text-white py-3 px-4 rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          {/* <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">Or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div> */}

          {/* Social Login */}
          {/* <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
              </svg>
              Microsoft
            </button>
          </div> */}

          {/* Sign Up Link */}
          {/* <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-primary-dark hover:text-primary font-medium transition-colors"
              >
                Request Access
              </Link>
            </p>
          </div> */}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-700 transition-colors">
                Terms of Service
              </Link>
              <Link href="/help" className="hover:text-gray-700 transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="hover:text-gray-700 transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-center text-gray-500 text-xs mt-4">
              © 2024 DDTech Teacher. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}