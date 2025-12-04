// API Configuration for SwasthTel App
// Update this URL based on your environment

// For local development with Android Emulator
// const API_BASE_URL = 'http://10.0.2.2:5000/api';

// For local development with iOS Simulator or same machine
// const API_BASE_URL = 'http://localhost:5000/api';

// For physical device on same network - replace with your computer's IP
// Find your IP: Windows (ipconfig), Mac/Linux (ifconfig or ip addr)
// const API_BASE_URL = 'http://192.168.1.100:5000/api';

// For production
// const API_BASE_URL = 'https://your-production-api.com/api';

// Default: Use your computer's IP for physical device, 10.0.2.2 for emulator
import { Platform } from 'react-native';

// *** IMPORTANT: Your computer's local IP for physical device testing ***
const LOCAL_IP = '192.168.1.5';

const getBaseUrl = () => {
  if (__DEV__) {
    // Development mode - Use local IP for physical device
    // This works for both physical devices AND emulators on the same network
    return `http://${LOCAL_IP}:5000/api`;
  }
  // Production URL - update this when you deploy
  return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getBaseUrl();

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    SOCIAL: '/auth/social',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    COMPLETE_ONBOARDING: '/auth/complete-onboarding',
    CHANGE_PASSWORD: '/auth/change-password',
    DELETE_ACCOUNT: '/auth/account',
  },
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
