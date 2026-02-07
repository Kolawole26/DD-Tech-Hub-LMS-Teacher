// components/modals/ScheduleModal.js
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '@/services/api';

export default function ScheduleModal({ onClose }) {
  const [scheduleForm, setScheduleForm] = useState({
    schedule_id: '',
    title: '',
    link: '',
    session_password: '',
    instructions: '',
    duration: '',
    schedule_time: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        title: scheduleForm.title,
        session_password: scheduleForm.session_password,
        instructions: scheduleForm.instructions,
        duration: scheduleForm.duration,
        schedule_time: scheduleForm.schedule_time
      };

      const response = await api.post('/live-sessions', payload);
      
      if (response.status === 200 || response.status === 201) {
        alert(`Live session "${scheduleForm.title}" scheduled successfully!`);
        
        // Reset form
        setScheduleForm({
          schedule_id: '',
          title: '',
          link: '',
          session_password: '',
          instructions: '',
          duration: '',
          schedule_time: ''
        });
        
        onClose();
      }
    } catch (err) {
      alert(`Failed to schedule session: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Schedule Live Session</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule ID
            </label>
            <input
              type="text"
              value={scheduleForm.schedule_id}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, schedule_id: e.target.value }))}
              placeholder="Enter schedule ID"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div> */}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Title
            </label>
            <input
              type="text"
              value={scheduleForm.title}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter session title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div>
          
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Link
            </label>
            <input
              type="url"
              value={scheduleForm.link}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://zoom.us/j/1234567890"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div> */}
          
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Password
            </label>
            <input
              type="text"
              value={scheduleForm.session_password}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, session_password: e.target.value }))}
              placeholder="Enter session password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div> */}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={scheduleForm.instructions}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Enter session instructions"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={scheduleForm.duration}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 60 minutes"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              value={scheduleForm.schedule_time}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, schedule_time: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg transition-colors"
            >
              Schedule Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}