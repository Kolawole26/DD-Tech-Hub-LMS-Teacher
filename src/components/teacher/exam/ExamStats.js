import { Calendar, Users, FileText, BarChart3, TrendingUp, Award, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function ExamStats({ exams }) {
  const [timeRange, setTimeRange] = useState('month');

  const calculateStats = () => {
    const now = new Date();
    const filteredExams = exams.filter(exam => {
      if (timeRange === 'week') {
        const examDate = new Date(exam.date);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return examDate >= weekAgo;
      } else if (timeRange === 'month') {
        const examDate = new Date(exam.date);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return examDate >= monthAgo;
      }
      return true;
    });

    const totalExams = filteredExams.length;
    const upcomingExams = filteredExams.filter(e => e.status === 'upcoming').length;
    const activeExams = filteredExams.filter(e => e.status === 'active').length;
    const gradedExams = filteredExams.filter(e => e.status === 'graded');
    
    const totalStudents = filteredExams.reduce((sum, exam) => sum + (exam.students || 0), 0);
    const totalSubmissions = filteredExams.reduce((sum, exam) => sum + (exam.submissions || 0), 0);
    const submissionRate = totalStudents > 0 ? Math.round((totalSubmissions / totalStudents) * 100) : 0;
    
    const avgScore = gradedExams.length > 0 
      ? (gradedExams.reduce((sum, exam) => sum + (exam.averageScore || 0), 0) / gradedExams.length).toFixed(1)
      : 'N/A';

    return {
      totalExams,
      upcomingExams,
      activeExams,
      totalStudents,
      submissionRate,
      avgScore,
    };
  };

  const statsData = calculateStats();

  const stats = [
    {
      title: 'Total Exams',
      value: statsData.totalExams,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+2 this week',
    },
    {
      title: 'Upcoming Exams',
      value: statsData.upcomingExams,
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      change: 'Next 30 days',
    },
    {
      title: 'Active Exams',
      value: statsData.activeExams,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: `${statsData.submissionRate}% submission rate`,
    },
    {
      title: 'Avg. Score',
      value: `${statsData.avgScore}${statsData.avgScore !== 'N/A' ? '%' : ''}`,
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: 'Based on graded exams',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Exam Statistics</h2>
          <p className="text-gray-600">Overview of exam performance and activity</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <span className="text-gray-600">Time Range:</span>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Time</option>
            <option value="month">Last 30 Days</option>
            <option value="week">Last 7 Days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`rounded-xl ${stat.bgColor} p-5`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                  <Icon className={`${stat.textColor}`} size={24} />
                </div>
                <span className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.change}</p>
              
              {index === 2 && statsData.totalStudents > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Students: {statsData.totalStudents}</span>
                    <span>Submissions: {statsData.submissionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 rounded-full h-2"
                      style={{ width: `${statsData.submissionRate}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Insights */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <AlertCircle className="text-yellow-600" size={20} />
            <div>
              <p className="font-medium text-gray-800">Urgent Action</p>
              <p className="text-sm text-gray-600">
                {exams.filter(e => e.status === 'active' && e.submissions === 0).length} exams with no submissions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="text-blue-600" size={20} />
            <div>
              <p className="font-medium text-gray-800">Pending Grading</p>
              <p className="text-sm text-gray-600">
                {exams.filter(e => e.status === 'completed' && (!e.graded || e.graded < e.submissions)).length} exams to grade
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Users className="text-green-600" size={20} />
            <div>
              <p className="font-medium text-gray-800">Student Engagement</p>
              <p className="text-sm text-gray-600">
                {statsData.submissionRate}% overall submission rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}