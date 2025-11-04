import React from 'react';
import { useLanguage } from 'contexts/LanguageContext';

const OfflineContent = () => {
  const { t, currentLanguage } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {currentLanguage === 'en' ? 'Offline Content' : 'ਔਫਲਾਈਨ ਸਮਗਰੀ'}
        </h1>
        <p className="text-gray-600">
          {currentLanguage === 'en' 
            ? 'Offline content management features coming soon...' 
            : 'ਔਫਲਾਈਨ ਸਮਗਰੀ ਪ੍ਰਬੰਧਨ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਜਲਦੀ ਆ ਰਹੀਆਂ ਹਨ...'
          }
        </p>
      </div>
    </div>
  );
};

export default OfflineContent;


