// components/lecture-management/RecordingsTab.js
'use client';

import { useState } from 'react';
import { 
  Video,
  Filter,
  Sparkles,
  Edit,
  Download,
  MessageSquare,
  Scissors,
  CheckCircle,
  Clock,
  X,
  Play,
  Share2
} from 'lucide-react';

export default function RecordingsTab({ selectedCourse, searchQuery, courses }) {
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      title: 'JavaScript Fundamentals Live Session',
      course: 'Web App Development',
      date: 'Dec 12, 2025',
      duration: '2h 15m',
      size: '1.8 GB',
      status: 'processed',
      thumbnail: '/thumb1.jpg',
      views: 156,
      captionStatus: 'available',
      downloadCount: 45,
      description: 'Complete JavaScript fundamentals session covering variables, functions, and DOM manipulation',
      resolution: '1080p',
      audioQuality: 'High',
      chapters: [
        { time: '0:00', title: 'Introduction' },
        { time: '15:30', title: 'Variables & Data Types' },
        { time: '45:20', title: 'Functions & Scope' },
        { time: '1:15:00', title: 'DOM Manipulation' },
      ],
      processing: {
        progress: 100,
        status: 'complete',
        steps: [
          { name: 'Video Optimization', completed: true },
          { name: 'Audio Enhancement', completed: true },
          { name: 'Caption Generation', completed: true },
          { name: 'Chapter Detection', completed: true }
        ]
      },
      favorite: false
    },
    // ... other recordings
  ]);

  const [recordingSettings, setRecordingSettings] = useState({
    recordAll: true,
    cloudSave: true,
    autoCaption: false,
    quality: 'Full HD (1080p)',
    retention: '90 days',
    format: 'mp4',
    autoStart: true,
    audioBitrate: '128kbps',
    videoBitrate: '5000kbps',
    storageLocation: 'cloud',
    watermark: false,
    autoPublish: false
  });

  const [filters, setFilters] = useState({
    status: 'all'
  });

  const [processingQueue, setProcessingQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [showRecordingModal, setShowRecordingModal] = useState(false);

  const toggleRecordingSetting = (setting) => {
    setRecordingSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleProcessRecording = (recordingId) => {
    const recording = recordings.find(r => r.id === recordingId);
    if (!recording) return;
    
    setIsProcessing(true);
    setProcessingQueue(prev => [...prev, recordingId]);
    
    const interval = setInterval(() => {
      setRecordings(prev => prev.map(r => {
        if (r.id === recordingId) {
          const newProgress = Math.min(r.processing.progress + 10, 100);
          
          if (newProgress === 100) {
            setIsProcessing(false);
            setProcessingQueue(prevQueue => prevQueue.filter(id => id !== recordingId));
            clearInterval(interval);
            
            return {
              ...r,
              status: 'processed',
              captionStatus: 'available',
              processing: {
                ...r.processing,
                progress: 100,
                status: 'complete',
                steps: r.processing.steps.map(step => ({ ...step, completed: true }))
              }
            };
          }
          
          return {
            ...r,
            processing: {
              ...r.processing,
              progress: newProgress,
              status: 'in-progress'
            }
          };
        }
        return r;
      }));
    }, 500);
    
    alert(`Processing recording ${recording.title}...\nGenerating captions and optimizing video quality.`);
  };

  const handleEditRecording = (recording) => {
    setSelectedRecording(recording);
    // This would open the editor modal
  };

  const handleDownloadRecording = (recording) => {
    const content = `Recording: ${recording.title}\nCourse: ${recording.course}\nDate: ${recording.date}\nDuration: ${recording.duration}\nSize: ${recording.size}\nResolution: ${recording.resolution}\nAudio Quality: ${recording.audioQuality}\nDescription: ${recording.description}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.title.replace(/\s+/g, '_')}_recording.txt`;
    a.click();
    
    setRecordings(prev =>
      prev.map(r =>
        r.id === recording.id
          ? { ...r, downloadCount: r.downloadCount + 1 }
          : r
      )
    );
  };

  const toggleFavoriteRecording = (recordingId) => {
    setRecordings(prev =>
      prev.map(recording =>
        recording.id === recordingId
          ? { ...recording, favorite: !recording.favorite }
          : recording
      )
    );
  };

  const filteredRecordings = recordings.filter(recording => {
    if (selectedCourse !== 'all' && recording.course !== courses.find(c => c.id === selectedCourse)?.name) return false;
    if (searchQuery && !recording.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !recording.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.status !== 'all' && recording.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Recording Settings */}
      <div className="p-6 border border-gray-200 rounded-xl bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Recording Settings</h3>
            <p className="text-gray-600">Configure automatic recording settings</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" size={20} />
            <span className="font-medium text-green-600">Auto-Recording Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Record all live sessions</span>
              <button 
                onClick={() => toggleRecordingSetting('recordAll')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  recordingSettings.recordAll ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  recordingSettings.recordAll ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Save to cloud storage</span>
              <button 
                onClick={() => toggleRecordingSetting('cloudSave')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  recordingSettings.cloudSave ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  recordingSettings.cloudSave ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Auto-generate captions</span>
              <button 
                onClick={() => toggleRecordingSetting('autoCaption')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  recordingSettings.autoCaption ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  recordingSettings.autoCaption ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recording Quality
              </label>
              <select 
                value={recordingSettings.quality}
                onChange={(e) => setRecordingSettings(prev => ({ ...prev, quality: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              >
                <option>HD (720p)</option>
                <option>Full HD (1080p)</option>
                <option>4K (2160p)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retention Period
              </label>
              <select 
                value={recordingSettings.retention}
                onChange={(e) => setRecordingSettings(prev => ({ ...prev, retention: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              >
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
                <option>Forever</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format
              </label>
              <select 
                value={recordingSettings.format}
                onChange={(e) => setRecordingSettings(prev => ({ ...prev, format: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
              >
                <option>mp4</option>
                <option>webm</option>
                <option>mov</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Auto-start recording</span>
              <button 
                onClick={() => toggleRecordingSetting('autoStart')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  recordingSettings.autoStart ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  recordingSettings.autoStart ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Queue */}
      {processingQueue.length > 0 && (
        <div className="p-4 bg-primary-lighter border border-primary-light rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-primary-dark" size={20} />
              <h4 className="font-semibold text-primary-dark">Processing Queue</h4>
            </div>
            <span className="text-sm text-primary-dark">
              {processingQueue.length} recording{processingQueue.length !== 1 ? 's' : ''} in queue
            </span>
          </div>
          <div className="space-y-2">
            {processingQueue.map(recordingId => {
              const recording = recordings.find(r => r.id === recordingId);
              if (!recording) return null;
              
              return (
                <div key={recordingId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-primary-light">
                  <div>
                    <div className="font-medium text-gray-800">{recording.title}</div>
                    <div className="text-sm text-gray-600">{recording.course}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{recording.processing.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${recording.processing.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      recording.processing.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {recording.processing.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="processed">Processed</option>
          <option value="processing">Processing</option>
          <option value="raw">Raw</option>
        </select>
      </div>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecordings.map((recording) => (
          <div key={recording.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-800 line-clamp-1">{recording.title}</h4>
                <p className="text-sm text-gray-600">{recording.course}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => toggleFavoriteRecording(recording.id)}
                  className={`p-1 ${recording.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                  title={recording.favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {recording.favorite ? '★' : '☆'}
                </button>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  recording.status === 'processed' ? 'bg-green-100 text-green-800' :
                  recording.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {recording.status}
                </span>
              </div>
            </div>

            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="text-gray-400" size={40} />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {recording.duration}
              </div>
              {recording.captionStatus === 'available' && (
                <div className="absolute bottom-2 right-2 bg-primary-dark text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <MessageSquare size={10} />
                  <span>CC</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {recording.resolution}
              </div>
            </div>

            {recording.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recording.description}</p>
            )}

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center justify-between">
                <span>Date Recorded</span>
                <span className="font-medium">{recording.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>File Size</span>
                <span className="font-medium">{recording.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Views/Downloads</span>
                <span className="font-medium">{recording.views}/{recording.downloadCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Processing</span>
                <div className="w-24">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        recording.processing.progress === 100 ? 'bg-green-500' :
                        recording.processing.progress > 0 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${recording.processing.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => handleProcessRecording(recording.id)}
                disabled={recording.status === 'processed' || recording.status === 'processing'}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 transition-colors"
              >
                <Sparkles size={14} />
                <span>Process</span>
              </button>
              <button 
                onClick={() => handleEditRecording(recording)}
                className="flex-1 px-3 py-2 bg-primary-dark hover:bg-primary-light text-white text-sm rounded-lg flex items-center justify-center space-x-1 transition-colors"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
              <button 
                onClick={() => handleDownloadRecording(recording)}
                className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded-lg transition-colors"
                title="Download"
              >
                <Download size={14} />
              </button>
            </div>

            {/* Chapter Preview if available */}
            {recording.chapters && recording.chapters.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-xs font-medium text-gray-500 mb-2 flex items-center justify-between">
                  <span>Chapters</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{recording.chapters.length} chapters</span>
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {recording.chapters.slice(0, 3).map((chapter, idx) => (
                    <div key={idx} className="flex text-xs text-gray-600 hover:bg-gray-50 p-1 rounded">
                      <span className="w-12 font-mono">{chapter.time}</span>
                      <span className="truncate">{chapter.title}</span>
                    </div>
                  ))}
                  {recording.chapters.length > 3 && (
                    <div className="text-xs text-gray-500 text-center pt-1">
                      +{recording.chapters.length - 3} more chapters
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}