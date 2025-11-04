import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    content: 'Content',
    classroom: 'Classroom',
    profile: 'Profile',
    offline: 'Offline',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    role: 'Role',
    student: 'Student',
    teacher: 'Teacher',
    parent: 'Parent',
    grade: 'Grade',
    subjects: 'Subjects',
    loginSuccess: 'Login successful!',
    registerSuccess: 'Registration successful!',
    loginError: 'Login failed',
    registerError: 'Registration failed',
    
    // Dashboard
    welcome: 'Welcome',
    myProgress: 'My Progress',
    recentActivity: 'Recent Activity',
    upcomingClasses: 'Upcoming Classes',
    assignments: 'Assignments',
    totalContent: 'Total Content',
    completedContent: 'Completed',
    timeSpent: 'Time Spent',
    pointsEarned: 'Points Earned',
    
    // Content
    video: 'Video',
    audio: 'Audio',
    quiz: 'Quiz',
    document: 'Document',
    interactive: 'Interactive',
    download: 'Download',
    play: 'Play',
    pause: 'Pause',
    completed: 'Completed',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    
    // Classroom
    joinClassroom: 'Join Classroom',
    leaveClassroom: 'Leave Classroom',
    sendMessage: 'Send Message',
    liveSession: 'Live Session',
    startSession: 'Start Session',
    endSession: 'End Session',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    offline: 'Offline',
    online: 'Online',
    
    // Features
    adaptiveLearning: 'Adaptive Learning',
    digitalTutor: 'Digital Tutor',
    virtualClassroom: 'Virtual Classroom',
    arVrLabs: 'AR/VR Labs',
    skillPath: 'Skill to Earning Path',
    contextualExamples: 'Contextual Examples',
    gamification: 'Gamification',
    
    // Punjabi specific
    punjabi: 'ਪੰਜਾਬੀ',
    english: 'English'
  }
};

// Punjabi translations
const pa = {
  translation: {
    // Navigation
    home: 'ਘਰ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    content: 'ਸਮਗਰੀ',
    classroom: 'ਕਲਾਸਰੂਮ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    offline: 'ਔਫਲਾਈਨ',
    login: 'ਲੌਗ ਇਨ',
    register: 'ਰਜਿਸਟਰ',
    logout: 'ਲੌਗ ਆਉਟ',
    
    // Auth
    email: 'ਈਮੇਲ',
    password: 'ਪਾਸਵਰਡ',
    confirmPassword: 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    name: 'ਨਾਮ',
    role: 'ਭੂਮਿਕਾ',
    student: 'ਵਿਦਿਆਰਥੀ',
    teacher: 'ਅਧਿਆਪਕ',
    parent: 'ਮਾਤਾ-ਪਿਤਾ',
    grade: 'ਕਲਾਸ',
    subjects: 'ਵਿਸ਼ੇ',
    loginSuccess: 'ਲੌਗ ਇਨ ਸਫਲ!',
    registerSuccess: 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਫਲ!',
    loginError: 'ਲੌਗ ਇਨ ਅਸਫਲ',
    registerError: 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਸਫਲ',
    
    // Dashboard
    welcome: 'ਸਵਾਗਤ',
    myProgress: 'ਮੇਰੀ ਤਰੱਕੀ',
    recentActivity: 'ਤਾਜ਼ੀ ਗਤੀਵਿਧੀ',
    upcomingClasses: 'ਆਉਣ ਵਾਲੀਆਂ ਕਲਾਸਾਂ',
    assignments: 'ਅਸਾਈਨਮੈਂਟ',
    totalContent: 'ਕੁੱਲ ਸਮਗਰੀ',
    completedContent: 'ਪੂਰਾ ਕੀਤਾ',
    timeSpent: 'ਸਮਾਂ ਬਿਤਾਇਆ',
    pointsEarned: 'ਪੁਆਇੰਟ ਮਿਲੇ',
    
    // Content
    video: 'ਵੀਡੀਓ',
    audio: 'ਆਡੀਓ',
    quiz: 'ਕੁਇਜ਼',
    document: 'ਦਸਤਾਵੇਜ਼',
    interactive: 'ਇੰਟਰਐਕਟਿਵ',
    download: 'ਡਾਊਨਲੋਡ',
    play: 'ਚਲਾਓ',
    pause: 'ਰੋਕੋ',
    completed: 'ਪੂਰਾ',
    inProgress: 'ਚੱਲ ਰਿਹਾ',
    notStarted: 'ਸ਼ੁਰੂ ਨਹੀਂ ਹੋਇਆ',
    
    // Classroom
    joinClassroom: 'ਕਲਾਸਰੂਮ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
    leaveClassroom: 'ਕਲਾਸਰੂਮ ਛੱਡੋ',
    sendMessage: 'ਸੁਨੇਹਾ ਭੇਜੋ',
    liveSession: 'ਲਾਈਵ ਸੈਸ਼ਨ',
    startSession: 'ਸੈਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ',
    endSession: 'ਸੈਸ਼ਨ ਖਤਮ ਕਰੋ',
    
    // Common
    save: 'ਸੇਵ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    edit: 'ਸੰਪਾਦਨ',
    delete: 'ਮਿਟਾਓ',
    search: 'ਖੋਜ',
    filter: 'ਫਿਲਟਰ',
    sort: 'ਸੌਰਟ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ...',
    error: 'ਗਲਤੀ',
    success: 'ਸਫਲਤਾ',
    offline: 'ਔਫਲਾਈਨ',
    online: 'ਔਨਲਾਈਨ',
    
    // Features
    adaptiveLearning: 'ਅਨੁਕੂਲ ਸਿੱਖਣਾ',
    digitalTutor: 'ਡਿਜੀਟਲ ਟਿਊਟਰ',
    virtualClassroom: 'ਵਰਚੁਅਲ ਕਲਾਸਰੂਮ',
    arVrLabs: 'AR/VR ਲੈਬ',
    skillPath: 'ਹੁਨਰ ਤੋਂ ਕਮਾਈ ਦਾ ਰਸਤਾ',
    contextualExamples: 'ਸੰਦਰਭਿਕ ਉਦਾਹਰਣਾਂ',
    gamification: 'ਖੇਡੀਕਰਨ',
    
    // Punjabi specific
    punjabi: 'ਪੰਜਾਬੀ',
    english: 'English'
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      pa
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;


























