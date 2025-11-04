import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from 'contexts/LanguageContext';
import { 
  BookOpen, 
  Users, 
  Brain, 
  Video, 
  Headphones, 
  Globe,
  Smartphone,
  Award,
  Zap,
  Shield
} from 'lucide-react';

const Home = () => {
  const { t, currentLanguage } = useLanguage();

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: t('adaptiveLearning'),
      description: currentLanguage === 'en' 
        ? 'Personalized learning paths that adapt to your pace and style'
        : 'ਤੁਹਾਡੀ ਗਤੀ ਅਤੇ ਸ਼ੈਲੀ ਦੇ ਅਨੁਕੂਲ ਨਿੱਜੀ ਸਿੱਖਣ ਦੇ ਰਸਤੇ',
      color: 'bg-blue-500'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: t('digitalTutor'),
      description: currentLanguage === 'en'
        ? 'AI-powered hints and guidance for better understanding'
        : 'ਬਿਹਤਰ ਸਮਝ ਲਈ AI-ਸੰਚਾਲਿਤ ਸੰਕੇਤ ਅਤੇ ਮਾਰਗਦਰਸ਼ਨ',
      color: 'bg-purple-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('virtualClassroom'),
      description: currentLanguage === 'en'
        ? 'Lightweight audio-first virtual classroom experience'
        : 'ਹਲਕਾ ਆਡੀਓ-ਪਹਿਲਾ ਵਰਚੁਅਲ ਕਲਾਸਰੂਮ ਅਨੁਭਵ',
      color: 'bg-green-500'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('contextualExamples'),
      description: currentLanguage === 'en'
        ? 'Local, real-life examples relevant to rural communities'
        : 'ਪੇਂਡੂ ਸਮੁਦਾਇਆਂ ਨਾਲ ਸੰਬੰਧਿਤ ਸਥਾਨਕ, ਅਸਲ-ਜੀਵਨ ਦੀਆਂ ਉਦਾਹਰਣਾਂ',
      color: 'bg-orange-500'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: t('arVrLabs'),
      description: currentLanguage === 'en'
        ? 'Low-cost AR experiments with video fallback'
        : 'ਵੀਡੀਓ ਫਾਲਬੈਕ ਦੇ ਨਾਲ ਘੱਟ ਲਾਗਤ AR ਪ੍ਰਯੋਗ',
      color: 'bg-pink-500'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('skillPath'),
      description: currentLanguage === 'en'
        ? 'Learn skills that lead to real earning opportunities'
        : 'ਉਹ ਹੁਨਰ ਸਿੱਖੋ ਜੋ ਅਸਲ ਕਮਾਈ ਦੇ ਮੌਕੇ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਨ',
      color: 'bg-yellow-500'
    }
  ];

  const stats = [
    { number: '10K+', label: currentLanguage === 'en' ? 'Students' : 'ਵਿਦਿਆਰਥੀ' },
    { number: '500+', label: currentLanguage === 'en' ? 'Teachers' : 'ਅਧਿਆਪਕ' },
    { number: '1000+', label: currentLanguage === 'en' ? 'Content Items' : 'ਸਮਗਰੀ ਆਈਟਮ' },
    { number: '50+', label: currentLanguage === 'en' ? 'Schools' : 'ਸਕੂਲ' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {currentLanguage === 'en' 
                ? 'Rural E-Learning Platform' 
                : 'ਪੇਂਡੂ ਈ-ਲਰਨਿੰਗ ਪਲੇਟਫਾਰਮ'
              }
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {currentLanguage === 'en'
                ? 'Empowering rural communities with accessible, offline-first education technology'
                : 'ਪਹੁੰਚਯੋਗ, ਔਫਲਾਈਨ-ਪਹਿਲਾ ਸਿੱਖਿਆ ਤਕਨਾਲੋਜੀ ਨਾਲ ਪੇਂਡੂ ਸਮੁਦਾਇਆਂ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('register')}
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                {t('login')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentLanguage === 'en' 
                ? 'Key Features' 
                : 'ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ'
              }
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentLanguage === 'en'
                ? 'Comprehensive learning solutions designed for rural education challenges'
                : 'ਪੇਂਡੂ ਸਿੱਖਿਆ ਦੀਆਂ ਚੁਣੌਤੀਆਂ ਲਈ ਤਿਆਰ ਕੀਤੇ ਗਏ ਵਿਆਪਕ ਸਿੱਖਣ ਦੇ ਹੱਲ'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 hover:shadow-medium transition-shadow">
                <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline-First Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {currentLanguage === 'en' 
                  ? 'Offline-First Learning' 
                  : 'ਔਫਲਾਈਨ-ਪਹਿਲਾ ਸਿੱਖਣਾ'
                }
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {currentLanguage === 'en'
                  ? 'Access educational content even without internet connection. Download lessons, videos, and quizzes to learn anywhere, anytime.'
                  : 'ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਦੇ ਬਿਨਾਂ ਵੀ ਸਿੱਖਿਆ ਸਮਗਰੀ ਤੱਕ ਪਹੁੰਚ। ਕਿਤੇ ਵੀ, ਕਿਸੇ ਵੀ ਸਮੇਂ ਸਿੱਖਣ ਲਈ ਪਾਠ, ਵੀਡੀਓ ਅਤੇ ਕੁਇਜ਼ ਡਾਊਨਲੋਡ ਕਰੋ।'
                }
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {currentLanguage === 'en' ? 'Works without internet' : 'ਇੰਟਰਨੈੱਟ ਦੇ ਬਿਨਾਂ ਕੰਮ ਕਰਦਾ ਹੈ'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">
                    {currentLanguage === 'en' ? 'Fast local access' : 'ਤੇਜ਼ ਸਥਾਨਕ ਪਹੁੰਚ'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Video className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">
                    {currentLanguage === 'en' ? 'Compressed media files' : 'ਸੰਕੁਚਿਤ ਮੀਡੀਆ ਫਾਈਲਾਂ'}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <Smartphone className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    {currentLanguage === 'en' ? 'Mobile Optimized' : 'ਮੋਬਾਈਲ ਅਨੁਕੂਲਿਤ'}
                  </h3>
                  <p className="text-primary-100">
                    {currentLanguage === 'en' 
                      ? 'Designed for low-end devices and limited storage'
                      : 'ਘੱਟ-ਅਜ਼ਮਾਇਸ਼ ਵਾਲੇ ਉਪਕਰਣਾਂ ਅਤੇ ਸੀਮਿਤ ਸਟੋਰੇਜ ਲਈ ਤਿਆਰ'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {currentLanguage === 'en' 
              ? 'Ready to Start Learning?' 
              : 'ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ?'
            }
          </h2>
          <p className="text-xl mb-8">
            {currentLanguage === 'en'
              ? 'Join thousands of students and teachers in our rural education revolution'
              : 'ਸਾਡੇ ਪੇਂਡੂ ਸਿੱਖਿਆ ਕ੍ਰਾਂਤੀ ਵਿੱਚ ਹਜ਼ਾਰਾਂ ਵਿਦਿਆਰਥੀਆਂ ਅਤੇ ਅਧਿਆਪਕਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ'
            }
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            {currentLanguage === 'en' ? 'Get Started Today' : 'ਅੱਜ ਹੀ ਸ਼ੁਰੂ ਕਰੋ'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

