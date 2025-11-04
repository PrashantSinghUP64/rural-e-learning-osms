import React from 'react';
import { useAuth } from 'contexts/AuthContext';
import { useLanguage } from 'contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Award,
  Calendar,
  BarChart3,
  PlayCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboardContent />;
      case 'teacher':
        return <TeacherDashboardContent />;
      case 'parent':
        return <ParentDashboardContent />;
      default:
        return <DefaultDashboardContent />;
    }
  };

  const StudentDashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {currentLanguage === 'en' 
            ? `Welcome back, ${user?.name}!` 
            : `ਵਾਪਸ ਸਵਾਗਤ, ${user?.name}!`
          }
        </h1>
        <p className="text-primary-100">
          {currentLanguage === 'en'
            ? 'Ready to continue your learning journey?'
            : 'ਆਪਣੀ ਸਿੱਖਣ ਦੀ ਯਾਤਰਾ ਜਾਰੀ ਰੱਖਣ ਲਈ ਤਿਆਰ ਹੋ?'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('totalContent')}</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <BookOpen className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('completedContent')}</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('timeSpent')}</p>
              <p className="text-2xl font-bold text-gray-900">45h</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('pointsEarned')}</p>
              <p className="text-2xl font-bold text-gray-900">1,250</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentLanguage === 'en' ? 'Continue Learning' : 'ਸਿੱਖਣਾ ਜਾਰੀ ਰੱਖੋ'}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <PlayCircle className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium">Mathematics - Chapter 5</span>
              </div>
              <span className="text-xs text-gray-500">75%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <PlayCircle className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium">Science - Physics Basics</span>
              </div>
              <span className="text-xs text-gray-500">30%</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentLanguage === 'en' ? 'Upcoming Classes' : 'ਆਉਣ ਵਾਲੀਆਂ ਕਲਾਸਾਂ'}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Mathematics Class</p>
                <p className="text-xs text-gray-500">Today, 2:00 PM</p>
              </div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Science Lab</p>
                <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
              </div>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TeacherDashboardContent = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {currentLanguage === 'en' 
            ? `Welcome, ${user?.name}!` 
            : `ਸਵਾਗਤ, ${user?.name}!`
          }
        </h1>
        <p className="text-primary-100">
          {currentLanguage === 'en'
            ? 'Manage your classes and create amazing content'
            : 'ਆਪਣੀਆਂ ਕਲਾਸਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ ਅਤੇ ਸ਼ਾਨਦਾਰ ਸਮਗਰੀ ਬਣਾਓ'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <Users className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">120</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Content Created</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const ParentDashboardContent = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {currentLanguage === 'en' 
            ? `Welcome, ${user?.name}!` 
            : `ਸਵਾਗਤ, ${user?.name}!`
          }
        </h1>
        <p className="text-primary-100">
          {currentLanguage === 'en'
            ? 'Monitor your child\'s learning progress'
            : 'ਆਪਣੇ ਬੱਚੇ ਦੀ ਸਿੱਖਣ ਦੀ ਤਰੱਕੀ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentLanguage === 'en' ? 'Child Progress' : 'ਬੱਚੇ ਦੀ ਤਰੱਕੀ'}
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Mathematics</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Science</span>
                <span>72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '72%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentLanguage === 'en' ? 'Recent Activity' : 'ਤਾਜ਼ੀ ਗਤੀਵਿਧੀ'}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Completed Math Quiz</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Watched Science Video</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Earned 50 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DefaultDashboardContent = () => (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {currentLanguage === 'en' ? 'Welcome to Rural E-Learning' : 'ਪੇਂਡੂ ਈ-ਲਰਨਿੰਗ ਵਿੱਚ ਸਵਾਗਤ'}
      </h1>
      <p className="text-gray-600 mb-8">
        {currentLanguage === 'en'
          ? 'Please complete your profile to access personalized features'
          : 'ਨਿੱਜੀਕ੍ਰਿਤ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਤੱਕ ਪਹੁੰਚ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪ੍ਰੋਫਾਈਲ ਪੂਰਾ ਕਰੋ'
        }
      </p>
      <button
        onClick={() => navigate('/profile')}
        className="btn-primary"
      >
        {currentLanguage === 'en' ? 'Complete Profile' : 'ਪ੍ਰੋਫਾਈਲ ਪੂਰਾ ਕਰੋ'}
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {getDashboardContent()}
    </div>
  );
};

export default Dashboard;

