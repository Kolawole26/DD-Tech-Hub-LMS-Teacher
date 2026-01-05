'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Key, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Request, 2: Code, 3: Reset
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      switch (step) {
        case 1:
          // Email validation
          if (!formData.email || !formData.email.includes('@')) {
            setError('Please enter a valid email address');
          } else {
            setSuccess('Reset code sent to your email');
            setTimeout(() => setStep(2), 1500);
          }
          break;

        case 2:
          // Code validation
          if (formData.code.length !== 6) {
            setError('Please enter the 6-digit code');
          } else {
            setSuccess('Code verified successfully');
            setTimeout(() => setStep(3), 1500);
          }
          break;

        case 3:
          // Password reset
          if (!formData.newPassword || !formData.confirmPassword) {
            setError('Please fill in all fields');
          } else if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
          } else if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
          } else {
            setSuccess('Password reset successful! Redirecting to login...');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          }
          break;
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleResendCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSuccess('New code sent to your email');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-dark to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/8 rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div>
            <div className="mb-8">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-white hover:text-primary-lighter transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Login
              </Link>
            </div>

            <div className="mt-12">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="text-white" size={32} />
              </div>
              
              <h2 className="text-4xl font-bold mb-6">Reset Your Password</h2>
              <p className="text-xl text-primary-lighter mb-10">
                Follow the steps to securely reset your password and regain access to your account
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-white text-primary-dark' : 'bg-white/20 text-white'}`}>
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Enter Your Email</h3>
                    <p className="text-primary-lighter">We'll send a verification code to your email address</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-white text-primary-dark' : 'bg-white/20 text-white'}`}>
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Verify Code</h3>
                    <p className="text-primary-lighter">Enter the 6-digit code sent to your email</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-white text-primary-dark' : 'bg-white/20 text-white'}`}>
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Set New Password</h3>
                    <p className="text-primary-lighter">Create a strong new password for your account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <Shield className="text-primary-dark" size={24} />
              </div>
              <div>
                <p className="font-medium">Security Tip</p>
                <p className="text-primary-lighter text-sm">Always use a strong, unique password for your admin account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full">
          {/* Mobile Back Button */}
          <div className="lg:hidden mb-6">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-primary-dark hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Login
            </Link>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-dark rounded-2xl mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-600 mt-2">
              {step === 1 && 'Enter your email to receive a reset code'}
              {step === 2 && 'Enter the 6-digit code sent to your email'}
              {step === 3 && 'Create your new password'}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 && 'Enter Your Email'}
              {step === 2 && 'Verify Your Identity'}
              {step === 3 && 'Create New Password'}
            </h2>
            <p className="text-gray-600">
              {step === 1 && 'We will send a verification code to your email'}
              {step === 2 && 'Check your email for the 6-digit code'}
              {step === 3 && 'Choose a strong password for security'}
            </p>
          </div>

          {/* Progress Steps (Mobile) */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= num ? 'bg-primary-dark text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {num}
                    </div>
                    {num < 3 && (
                      <div className={`w-12 h-1 ${step > num ? 'bg-primary-dark' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Email Input */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
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
                  <p className="text-sm text-gray-500 mt-2">
                    We'll send a 6-digit code to this email
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Code Verification */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    6-digit Verification Code
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      maxLength="6"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark text-center text-xl tracking-widest font-mono"
                      placeholder="000000"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                      Sent to {formData.email}
                    </p>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-sm text-primary-dark hover:text-primary transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : 'Resend Code'}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-900 mb-2">Important</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Check your email inbox and spam folder</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>The code is valid for 15 minutes only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Enter the code exactly as shown in the email</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Strength:</span>
                      <span className={`font-medium ${
                        formData.newPassword.length >= 8 ? 'text-green-600' : 
                        formData.newPassword.length >= 4 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formData.newPassword.length >= 8 ? 'Strong' : 
                         formData.newPassword.length >= 4 ? 'Medium' : 'Weak'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-full rounded-full transition-all ${
                          formData.newPassword.length >= 8 ? 'bg-green-500 w-full' : 
                          formData.newPassword.length >= 4 ? 'bg-yellow-500 w-2/3' : 
                          'bg-red-500 w-1/3'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-primary-dark"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.newPassword && formData.confirmPassword && (
                    <p className={`text-sm mt-2 ${
                      formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formData.newPassword === formData.confirmPassword ? 
                        '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Password Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className={`flex items-center gap-2 ${formData.newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                      <span>{formData.newPassword.length >= 8 ? '✓' : '•'}</span>
                      At least 8 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <span>•</span>
                      Include uppercase and lowercase letters
                    </li>
                    <li className="flex items-center gap-2">
                      <span>•</span>
                      Include at least one number
                    </li>
                    <li className={`flex items-center gap-2 ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'text-green-600' : ''}`}>
                      <span>{formData.newPassword === formData.confirmPassword && formData.newPassword ? '✓' : '•'}</span>
                      Passwords match
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
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
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-dark text-white py-3 px-4 rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {step === 1 && 'Sending Code...'}
                  {step === 2 && 'Verifying...'}
                  {step === 3 && 'Resetting...'}
                </>
              ) : (
                <>
                  {step === 1 && 'Send Reset Code'}
                  {step === 2 && 'Verify Code'}
                  {step === 3 && 'Reset Password'}
                </>
              )}
            </button>

            {/* Cancel/Back Button */}
            <button
              type="button"
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                } else {
                  window.location.href = '/login';
                }
              }}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium mt-3"
            >
              <ArrowLeft size={18} />
              {step === 1 ? 'Cancel' : 'Go Back'}
            </button>
          </form>

          {/* Support Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Need help?{' '}
              <Link 
                href="/support" 
                className="text-primary-dark hover:text-primary font-medium transition-colors"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}