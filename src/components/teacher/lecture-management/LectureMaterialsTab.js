// components/lecture-management/LectureMaterialsTab.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Video, 
  FileText, 
  Trash2,
  Edit,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Eye,
  File,
  Image,
  FileArchive,
  Plus,
  Check,
  XCircle
} from 'lucide-react';
import { api } from '@/services/api';

// Simple toast component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-100 border-green-200 text-green-800' 
                : type === 'error' ? 'bg-red-100 border-red-200 text-red-800'
                : 'bg-blue-100 border-blue-200 text-blue-800';

  const icon = type === 'success' ? '✓' 
             : type === 'error' ? '✗'
             : 'ℹ';

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg ${bgColor} flex items-center space-x-2 uppercase animate-slide-in`}>
      <span className="font-bold">{icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default function LectureMaterialsTab({ selectedCourse, searchQuery, courses }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'all'
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    type: 'application/pdf',
    file: null,
    fileName: ''
  });
  const [uploadErrors, setUploadErrors] = useState({});
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const fileInputRef = useRef(null);

  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Fetch lecture materials from API
  useEffect(() => {
    fetchLectureMaterials();
  }, []);

  const fetchLectureMaterials = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/lecture-materials');
      
      console.log('API Response:', response.data); // Debug log
      
      if (response.status === 200 && response.data?.data) {
        // Handle different response structures
        let materialsData = response.data.data;
        
        // Check if it's the nested structure from your example
        if (response.data.data?.data && Array.isArray(response.data.data.data)) {
          materialsData = response.data.data.data;
        }
        
        const apiMaterials = materialsData.map(material => ({
          id: material._id,
          title: material.title,
          type: getMaterialType(material.type),
          fileType: material.type,
          size: material.file_size,
          uploadDate: new Date(material.upload_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          upload_date: material.upload_date,
          views: 0,
          downloads: 0,
          description: `Uploaded on ${new Date(material.upload_date).toLocaleDateString()}`,
          tags: getTagsFromType(material.type),
          favorite: false,
          src: material.src,
          course_id: material.course_id,
          rawData: material
        }));
        
        console.log('Processed materials:', apiMaterials); // Debug log
        setMaterials(apiMaterials);
      }
    } catch (err) {
      console.error('Error fetching lecture materials:', err);
      setError('Failed to load lecture materials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine material type from MIME type
  const getMaterialType = (mimeType) => {
    if (!mimeType) return 'document';
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('video')) return 'video';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'slides';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive';
    if (mimeType.includes('csv') || mimeType.includes('spreadsheet')) return 'spreadsheet';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('text')) return 'document';
    return 'document';
  };

  // Helper function to get tags based on file type
  const getTagsFromType = (mimeType) => {
    if (!mimeType) return ['document'];
    if (mimeType.includes('pdf')) return ['document', 'pdf'];
    if (mimeType.includes('video')) return ['video'];
    if (mimeType.includes('powerpoint')) return ['presentation', 'slides'];
    if (mimeType.includes('image')) return ['image'];
    if (mimeType.includes('csv')) return ['spreadsheet', 'data'];
    return ['document'];
  };

  // Get icon based on material type
  const getMaterialIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="text-red-600" size={20} />;
      case 'slides': return <FileText className="text-blue-600" size={20} />;
      case 'image': return <Image className="text-purple-600" size={20} />;
      case 'archive': return <FileArchive className="text-orange-600" size={20} />;
      case 'spreadsheet': return <FileText className="text-green-600" size={20} />;
      default: return <File className="text-primary-dark" size={20} />;
    }
  };

  // Get background color based on material type
  const getMaterialBgColor = (type) => {
    switch (type) {
      case 'video': return 'bg-red-100';
      case 'slides': return 'bg-blue-100';
      case 'image': return 'bg-purple-100';
      case 'archive': return 'bg-orange-100';
      case 'spreadsheet': return 'bg-green-100';
      default: return 'bg-primary-light';
    }
  };

  const handleUploadModalOpen = () => {
    setUploadData({
      title: '',
      type: 'application/pdf',
      file: null,
      fileName: ''
    });
    setUploadErrors({});
    setShowUploadModal(true);
  };

  const validateUpload = () => {
    const errors = {};
    
    if (!uploadData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!uploadData.file) {
      errors.file = 'Please select a file';
    }
    
    setUploadErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      setUploadErrors({ file: 'File size exceeds 100MB limit. Please choose a smaller file.' });
      showToast('File size exceeds 100MB limit. Please choose a smaller file.', 'error');
      return;
    }

    // Determine file type from extension
    const fileExtension = file.name.split('.').pop().toLowerCase();
    let fileType = 'application/octet-stream';
    
    if (fileExtension === 'pdf') fileType = 'application/pdf';
    else if (fileExtension === 'mp4' || fileExtension === 'mov' || fileExtension === 'avi') fileType = 'video/mp4';
    else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') fileType = 'image/jpeg';
    else if (fileExtension === 'ppt' || fileExtension === 'pptx') fileType = 'application/vnd.ms-powerpoint';
    else if (fileExtension === 'csv') fileType = 'text/csv';
    else if (fileExtension === 'zip') fileType = 'application/zip';
    else if (fileExtension === 'doc' || fileExtension === 'docx') fileType = 'application/msword';
    else if (fileExtension === 'txt') fileType = 'text/plain';

    setUploadData(prev => ({
      ...prev,
      file,
      fileName: file.name,
      type: fileType
    }));
    setUploadErrors(prev => ({ ...prev, file: '' }));
  };

  const handleFileUpload = async () => {
    if (!validateUpload()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('type', uploadData.type);
    formData.append('files', uploadData.file);

    // Debug log
    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Upload to API
      const response = await api.post('/lecture-materials', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      console.log('Upload response:', response);

      if (response.status === 200 || response.status === 201) {
        await fetchLectureMaterials();
        
        setShowUploadModal(false);
        setUploadData({
          title: '',
          type: 'application/pdf',
          file: null,
          fileName: ''
        });
        setUploadErrors({});
        
        showToast(`${uploadData.fileName} uploaded successfully!`, 'success');
      } else {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      showToast(`Failed to upload file: ${errorMessage}`, 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    try {
      const response = await api.delete(`/lecture-materials/${materialId}`);
      
      if (response.status === 200) {
        setMaterials(prev => prev.filter(material => material.id !== materialId));
        setShowDeleteConfirm(null);
        showToast('Lecture material deleted successfully.', 'success');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete material. Please try again.', 'error');
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial({ ...material });
    setShowMaterialModal(true);
  };

  const handleUpdateMaterial = async () => {
    if (!editingMaterial) return;

    try {
      const response = await api.patch(`/lecture-materials/${editingMaterial.id}`, {
        title: editingMaterial.title,
        type: editingMaterial.fileType
      });

      if (response.status === 200) {
        setMaterials(prev =>
          prev.map(m =>
            m.id === editingMaterial.id
              ? { ...m, title: editingMaterial.title, fileType: editingMaterial.fileType }
              : m
          )
        );
        showToast('Material updated successfully!', 'success');
        setShowMaterialModal(false);
        setEditingMaterial(null);
      }
    } catch (error) {
      console.error('Update error:', error);
      showToast('Failed to update material. Please try again.', 'error');
    }
  };

  const handleDownloadMaterial = async (material) => {
    try {
      // If the material has a src URL, download it directly
      if (material.src) {
        const link = document.createElement('a');
        link.href = material.src;
        link.download = material.title || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Update download count in local state
        setMaterials(prev =>
          prev.map(m =>
            m.id === material.id
              ? { ...m, downloads: m.downloads + 1 }
              : m
          )
        );
        showToast('Download started!', 'success');
      } else {
        // If no src, you might want to call a download API endpoint
        const response = await api.get(`/lecture-materials/${material.id}/download`, {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = material.title || 'download';
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        
        // Update download count in local state
        setMaterials(prev =>
          prev.map(m =>
            m.id === material.id
              ? { ...m, downloads: m.downloads + 1 }
              : m
          )
        );
        showToast('Download started!', 'success');
      }
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to download material. Please try again.', 'error');
    }
  };

  const handlePreviewMaterial = (material) => {
    if (material.src) {
      window.open(material.src, '_blank');
      showToast('Opening file in new tab...', 'info');
    } else {
      showToast('Preview not available for this file.', 'info');
    }
  };

  const toggleFavoriteMaterial = (materialId) => {
    setMaterials(prev =>
      prev.map(material =>
        material.id === materialId
          ? { ...material, favorite: !material.favorite }
          : material
      )
    );
    const material = materials.find(m => m.id === materialId);
    showToast(
      material?.favorite 
        ? 'Removed from favorites' 
        : 'Added to favorites', 
      'success'
    );
  };

  const filteredMaterials = materials.filter(material => {
    // Filter by course
    if (selectedCourse !== 'all') {
      const selectedCourseName = courses.find(c => c.id === selectedCourse)?.name;
      if (selectedCourseName && material.course !== selectedCourseName) return false;
    }
    
    // Filter by search query
    if (searchQuery && !material.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !material.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Filter by type
    if (filters.type !== 'all' && material.type !== filters.type) return false;
    
    return true;
  });

  // Get supported file types for upload
  const getAcceptedFileTypes = () => {
    return ".pdf,.mp4,.mov,.avi,.jpg,.jpeg,.png,.ppt,.pptx,.csv,.zip,.doc,.docx,.txt";
  };

  const getFileTypeDisplayName = (type) => {
    switch (type) {
      case 'application/pdf': return 'PDF Document';
      case 'video/mp4': return 'Video File';
      case 'image/jpeg': return 'Image File';
      case 'application/vnd.ms-powerpoint': return 'PowerPoint Presentation';
      case 'text/csv': return 'CSV Spreadsheet';
      case 'application/zip': return 'ZIP Archive';
      case 'application/msword': return 'Word Document';
      case 'text/plain': return 'Text File';
      default: return 'Document';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-500 text-center" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Upload Button and Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="video">Video</option>
            <option value="slides">Slides</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="archive">Archive</option>
            <option value="spreadsheet">Spreadsheet</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleUploadModalOpen}
            disabled={isUploading}
            className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span>Upload Material</span>
          </button>
        </div>
      </div>

      {isUploading && (
        <div className="mb-6 p-4 bg-primary-lighter border border-primary-light rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-primary-dark">Uploading file...</span>
            <span className="text-primary-dark">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-dark h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lecture materials...</p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Lecture Materials</h3>
          <p className="text-gray-600 mb-4">Upload your first lecture material to get started.</p>
          <button
            onClick={handleUploadModalOpen}
            className="px-6 py-3 bg-primary-dark hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
          >
            Upload Material
          </button>
        </div>
      ) : (
        /* Materials Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${getMaterialBgColor(material.type)}`}>
                    {getMaterialIcon(material.type)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 max-w-[250px] truncate" title={material.title}>
                      {material.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{material.course}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => toggleFavoriteMaterial(material.id)}
                    className={`p-1 ${material.favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                    title={material.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {material.favorite ? '★' : '☆'}
                  </button>
                  <button 
                    onClick={() => handleEditMaterial(material)}
                    className="p-1 text-gray-400 hover:text-primary-dark rounded hover:bg-blue-50"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(material.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {material.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2" title={material.description}>
                  {material.description}
                </p>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>File Type</span>
                  <span className="font-medium capitalize">{material.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Upload Date</span>
                  <span className="font-medium">{material.uploadDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>File Size</span>
                  <span className="font-medium">{material.size}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={() => handleDownloadMaterial(material)}
                  className="flex-1 px-3 py-2 bg-primary-dark hover:bg-primary-light text-white text-sm rounded-lg flex items-center justify-center space-x-1 transition-colors"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>

              {/* File type tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {material.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Upload New Material</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadData({
                    title: '',
                    type: 'application/pdf',
                    file: null,
                    fileName: ''
                  });
                  setUploadErrors({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isUploading}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Title *
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => {
                    setUploadData(prev => ({ ...prev, title: e.target.value }));
                    setUploadErrors(prev => ({ ...prev, title: '' }));
                  }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent ${
                    uploadErrors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter material title"
                  disabled={isUploading}
                />
                {uploadErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{uploadErrors.title}</p>
                )}
              </div>
              
              {/* File Type Display (auto-detected) */}
              {uploadData.file && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">File Type</p>
                      <p className="text-sm text-gray-600">{getFileTypeDisplayName(uploadData.type)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  uploadErrors.file ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-dark hover:bg-gray-50'
                }`}>
                  {uploadData.file ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <Check className="text-green-500" size={24} />
                        <span className="font-medium text-gray-700">File Selected</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{uploadData.fileName}</p>
                      <p className="text-xs text-gray-500">
                        Size: {(uploadData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        onClick={() => {
                          setUploadData(prev => ({ ...prev, file: null, fileName: '' }));
                          setUploadErrors(prev => ({ ...prev, file: '' }));
                        }}
                        className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 flex items-center justify-center space-x-1 mx-auto"
                        disabled={isUploading}
                      >
                        <XCircle size={14} />
                        <span>Remove File</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-gray-600 mb-1">Click to select a file</p>
                      <p className="text-sm text-gray-500 mb-3">Supports: PDF, Video, Images, Documents, etc.</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white font-medium rounded-lg transition-colors"
                        disabled={isUploading}
                      >
                        Browse Files
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept={getAcceptedFileTypes()}
                    disabled={isUploading}
                  />
                </div>
                {uploadErrors.file && (
                  <p className="mt-1 text-sm text-red-600">{uploadErrors.file}</p>
                )}
              </div>
              
              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Uploading...</span>
                    <span className="text-sm text-primary-dark">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-dark h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadData({
                    title: '',
                    type: 'application/pdf',
                    file: null,
                    fileName: ''
                  });
                  setUploadErrors({});
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                disabled={isUploading || !uploadData.title || !uploadData.file}
                className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {showMaterialModal && editingMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Material</h3>
              <button
                onClick={() => {
                  setShowMaterialModal(false);
                  setEditingMaterial(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Title *
                </label>
                <input
                  type="text"
                  value={editingMaterial.title}
                  onChange={(e) => setEditingMaterial(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Type
                </label>
                <select
                  value={editingMaterial.fileType}
                  onChange={(e) => setEditingMaterial(prev => ({ ...prev, fileType: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent"
                >
                  <option value="application/pdf">PDF Document</option>
                  <option value="video/mp4">Video</option>
                  <option value="application/vnd.ms-powerpoint">PowerPoint</option>
                  <option value="image/jpeg">Image</option>
                  <option value="text/csv">CSV Spreadsheet</option>
                  <option value="application/zip">ZIP Archive</option>
                  <option value="application/msword">Word Document</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowMaterialModal(false);
                  setEditingMaterial(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMaterial}
                className="px-4 py-2 bg-primary-dark hover:bg-primary-light text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="text-red-600" size={20} />
                  <span className="text-red-700 font-medium">Warning: This action cannot be undone</span>
                </div>
              </div>
              
              <p className="text-gray-600">
                Are you sure you want to delete this lecture material? All associated data will be permanently removed.
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMaterial(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}