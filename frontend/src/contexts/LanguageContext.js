import React, { createContext, useState, useContext } from 'react';

// NOTE: You will need a function 't' for translation. This is a placeholder.
const translations = {
  en: { home: 'Home', dashboard: 'Dashboard', content: 'Content', offline: 'Offline', online: 'Online', profile: 'Profile', logout: 'Logout', login: 'Login', register: 'Register' },
  pa: { home: 'ਮੁੱਖ ਪੰਨਾ', dashboard: 'ਡੈਸ਼ਬੋਰਡ', content: 'ਸਮੱਗਰੀ', offline: 'ਔਫਲਾਈਨ', online: 'ਆਨਲਾਈਨ', profile: 'ਪ੍ਰੋਫਾਈਲ', logout: 'ਲੌਗਆਉਟ', login: 'ਲਾਗਿਨ', register: 'ਰਜਿਸਟਰ' },
};

// Create the context
export const LanguageContext = createContext();

// Create the provider component
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  const changeLanguage = (lang) => setCurrentLanguage(lang);
  
  const t = (key) => translations[currentLanguage][key] || key;

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create the custom hook
export const useLanguage = () => {
  return useContext(LanguageContext);
};