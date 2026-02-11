'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, LogIn, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Get login function from AuthContext
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setFormErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // API call to login endpoint
      const response = await api.post('/auths/login', {
        email: formData.email,
        password: formData.password
      });

      // Check if response is successful
      if (response.status === 200 && response.data) {
        setSuccess(response.message || 'Login successful!');
        
        // Get user data and token from response
        const { user, token } = response.data;
        
        // Use the login function from AuthContext
        // This will handle all storage and redirect
        login(user, token, rememberMe);
        
        // Note: No need for setTimeout or manual redirect here
        // The login function from AuthContext will handle the redirect
        
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific error cases
      if (err.message.includes('401') || err.message.includes('Invalid credentials')) {
        setError('Invalid email or password');
      } else if (err.message.includes('Network')) {
        setError('Network error. Please check your connection.');
      } else if (err.message.includes('404')) {
        setError('Service unavailable. Please try again later.');
      } else {
        setError(err.message || 'An error occurred during login');
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      email: `${role}@edutech.com`,
      password: 'demo123'
    };
    
    setFormData(demoCredentials);
    setFormErrors({ email: '', password: '' });
    setError('');
    setSuccess(`Demo login as ${role} ready. Click Login to continue.`);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image/Illustration */}
<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-dark to-primary relative overflow-hidden">
  {/* Subtle Texture Background */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute inset-0" style={{
      backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
      backgroundSize: '40px 40px'
    }}></div>
  </div>
  
  {/* Soft Organic Shapes */}
  <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
  <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

  {/* Minimalist Accent Lines */}
  <div className="absolute top-20 right-20 w-px h-40 bg-gradient-to-b from-white/30 to-transparent"></div>
  <div className="absolute bottom-20 left-20 w-px h-40 bg-gradient-to-t from-white/30 to-transparent"></div>
  <div className="absolute top-1/2 right-40 w-20 h-px bg-white/20"></div>
  <div className="absolute bottom-1/3 left-40 w-20 h-px bg-white/20"></div>

  <div className="relative z-10 flex flex-col w-full h-full">
    
    {/* Simple Header */}
    <div className="px-12 pt-12">
      <div className="flex items-center gap-4">
        <div className="bg-white rounded-xl p-2 shadow-lg">
          <Image 
            src="/assets/images/ddTechLogo.png" 
            alt="DDTech" 
            width={45} 
            height={45} 
            className="w-[60px]" 
          />
        </div>
        <div>
          <h1 className="text-2xl font-light tracking-wide text-white">DDTech</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
            <p className="text-white/70 text-xs uppercase tracking-wider">Teacher Portal</p>
          </div>
        </div>
      </div>
    </div>

    {/* Centered Content - Minimal & Elegant */}
    <div className="flex-1 flex flex-col items-center justify-center px-12">
      <div className="max-w-md text-center">
        
        {/* Welcome Message */}
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-white/80 text-xs uppercase tracking-wider mb-6">
            Welcome Back
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight">
            DDTech
            <span className="font-semibold block mt-2">Teacher</span>
          </h2>
          <div className="w-16 h-0.5 bg-white/40 mx-auto my-6"></div>
          <p className="text-white/70 text-lg font-light leading-relaxed">
            Your dedicated workspace for managing courses, students, and educational content
          </p>
        </div>

        {/* Feature List - Clean Typography */}
        <div className="space-y-5 text-left bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Course Management</p>
              <p className="text-white/60 text-sm">Create and organize curriculum</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Student Progress</p>
              <p className="text-white/60 text-sm">Track and evaluate performance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Team Collaboration</p>
              <p className="text-white/60 text-sm">Work with fellow educators</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">Resource Library</p>
              <p className="text-white/60 text-sm">Access teaching materials</p>
            </div>
          </div>
        </div>

        {/* Decorative Quote */}
        <div className="mt-12 italic">
          <p className="text-white/50 text-sm font-light">
            "Empowering educators to inspire the next generation"
          </p>
        </div>
      </div>
    </div>

    {/* Simple Footer */}
    <div className="px-12 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 bg-white/15 rounded-full border border-white/30"></div>
            ))}
          </div>
          <p className="text-white/60 text-sm">
            Trusted by educators
          </p>
        </div>
        <div className="text-white/40 text-xs uppercase tracking-wider">
          v2.0
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">DDTech Admin</h1>
            <p className="text-gray-600 mt-2">Sign in to your admin dashboard</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access the dashboard</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-500" size={20} />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

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
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark ${
                    formErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="teacher@edutech.com"
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
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
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark ${
                    formErrors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
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

          {/* Demo Login Buttons (Optional) */}
          {/* <div className="mt-6">
            <p className="text-center text-gray-600 text-sm mb-3">Try demo accounts:</p>
            <div className="flex gap-2">
              {['admin', 'teacher', 'student'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleDemoLogin(role)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors capitalize"
                >
                  {role}
                </button>
              ))}
            </div>
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