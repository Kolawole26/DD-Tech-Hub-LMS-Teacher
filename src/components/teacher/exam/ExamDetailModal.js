import { 
  X, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  BarChart3,
  MapPin,
  AlertCircle,
  CheckCircle,
  Download,
  Send,
  Printer
} from 'lucide-react';

const statusConfig = {
  upcoming: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  completed: { color: 'bg-blue-100 text-blue-800', icon: Clock },
  graded: { color: 'bg-purple-100 text-purple-800', icon: BarChart3 },
};

const typeConfig = {
  written: { color: 'bg-blue-50 text-blue-700' },
  quiz: { color: 'bg-green-50 text-green-700' },
  practical: { color: 'bg-orange-50 text-orange-700' },
  project: { color: 'bg-purple-50 text-purple-700' },
  assignment: { color: 'bg-indigo-50 text-indigo-700' },
};

export default function ExamDetailModal({ exam, onClose, onEdit, onDelete }) {
  const StatusIcon = statusConfig[exam.status].icon;

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>${exam.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #666; }
            .value { margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${exam.title}</h1>
            <h3>${exam.course}</h3>
          </div>
          <div class="section">
            <div class="value"><span class="label">Date:</span> ${exam.date}</div>
            <div class="value"><span class="label">Time:</span> ${exam.time}${exam.endTime ? ` - ${exam.endTime}` : ''}</div>
            <div class="value"><span class="label">Location:</span> ${exam.location}</div>
            <div class="value"><span class="label">Total Marks:</span> ${exam.totalMarks}</div>
            <div class="value"><span class="label">Passing Marks:</span> ${exam.passingMarks}</div>
            <div class="value"><span class="label">Students Enrolled:</span> ${exam.students}</div>
            <div class="value"><span class="label">Submissions:</span> ${exam.submissions}</div>
            ${exam.averageScore ? `<div class="value"><span class="label">Average Score:</span> ${exam.averageScore}%</div>` : ''}
          </div>
          <div class="section">
            <h3>Description</h3>
            <p>${exam.description}</p>
          </div>
          <div class="section">
            <h3>Instructions</h3>
            <p>${exam.instructions}</p>
          </div>
          <div class="section">
            <h3>Settings</h3>
            <table>
              <tr><td>Late Submissions Allowed</td><td>${exam.allowLateSubmission ? 'Yes' : 'No'}</td></tr>
              <tr><td>Plagiarism Check</td><td>${exam.enablePlagiarismCheck ? 'Enabled' : 'Disabled'}</td></tr>
              <tr><td>Auto Grading</td><td>${exam.autoGrade ? 'Enabled' : 'Disabled'}</td></tr>
            </table>
          </div>
          <div class="section">
            <p><em>Printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</em></p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportPDF = () => {
    alert(`Exporting "${exam.title}" details as PDF...`);
    // In a real app, this would generate and download a PDF
  };

  const handleSendReminder = () => {
    alert(`Sending reminder for "${exam.title}" to ${exam.students} students...`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-dark to-primary-light p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{exam.title}</h2>
              <p className="text-primary-lighter">{exam.course}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="p-2 hover:bg-white/10 rounded-lg"
                title="Print Details"
              >
                <Printer size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status and Type Badges */}
          <div className="flex items-center space-x-3 mb-6">
            <span className={`px-4 py-2 rounded-full font-medium flex items-center space-x-2 ${typeConfig[exam.type].color}`}>
              {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)} Exam
            </span>
            <span className={`px-4 py-2 rounded-full font-medium flex items-center space-x-2 ${statusConfig[exam.status].color}`}>
              <StatusIcon size={16} />
              <span>{statusConfig[exam.status].label}</span>
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Calendar size={16} />
                <span className="text-sm">Date</span>
              </div>
              <p className="font-bold text-gray-800">{exam.date}</p>
              <p className="text-sm text-gray-600">{exam.time} {exam.endTime && `- ${exam.endTime}`}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Users size={16} />
                <span className="text-sm">Students</span>
              </div>
              <p className="font-bold text-gray-800">{exam.students}</p>
              <p className="text-sm text-gray-600">{exam.submissions} submissions</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FileText size={16} />
                <span className="text-sm">Marks</span>
              </div>
              <p className="font-bold text-gray-800">{exam.totalMarks}</p>
              <p className="text-sm text-gray-600">Pass: {exam.passingMarks}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <BarChart3 size={16} />
                <span className="text-sm">Progress</span>
              </div>
              <p className="font-bold text-gray-800">
                {exam.status === 'graded' && exam.averageScore ? `${exam.averageScore}%` : 
                 exam.status === 'completed' ? `${exam.graded || 0} graded` :
                 `${exam.submissions} submitted`}
              </p>
            </div>
          </div>

          {/* Location */}
          {exam.location && exam.location !== 'Online Submission' && (
            <div className="flex items-center space-x-2 text-gray-700 mb-6">
              <MapPin size={16} />
              <span>{exam.location}</span>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{exam.description}</p>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-3">Instructions</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{exam.instructions}</p>
          </div>

          {/* Settings */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-3">Exam Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-700">Late Submissions</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  exam.allowLateSubmission ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {exam.allowLateSubmission ? 'Allowed' : 'Not Allowed'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-700">Plagiarism Check</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  exam.enablePlagiarismCheck ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {exam.enablePlagiarismCheck ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-700">Auto Grading</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  exam.autoGrade ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {exam.autoGrade ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-gray-700">Duration</span>
                <span className="font-medium">{exam.duration} minutes</span>
              </div>
            </div>
          </div>

          {/* Created Info */}
          <div className="text-sm text-gray-500 mb-8">
            <p>Created by {exam.createdBy} on {exam.createdAt}</p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <button
              onClick={handleSendReminder}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center space-x-2"
            >
              <Send size={16} />
              <span>Send Reminder</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Export as PDF</span>
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Edit2 size={16} />
              <span>Edit Exam</span>
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Delete Exam</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}