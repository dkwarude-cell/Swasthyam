// API Configuration for SwasthTel App
// Automatically detects the correct IP from Expo's manifest

import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = (): string => {
  if (__DEV__) {
    // Get the debugger host from Expo - this contains the IP and port
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    
    if (debuggerHost) {
      // Extract just the IP address (remove the port)
      const ip = debuggerHost.split(':')[0];
      console.log('API connecting to:', `http://${ip}:5000/api`);
      return `http://${ip}:5000/api`;
    }
    
    // Fallback for different platforms
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine
      return 'http://10.0.2.2:5000/api';
    }
    
    // iOS simulator or web
    return 'http://localhost:5000/api';
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
    UPDATE_PROFILE: '/auth/profile',
    COMPLETE_ONBOARDING: '/auth/complete-onboarding',
    CHANGE_PASSWORD: '/auth/change-password',
    DELETE_ACCOUNT: '/auth/account',
    SEARCH_USERS: '/auth/search-users',
    FAMILY: '/auth/family',
  },
  // Oil consumption endpoints
  OIL: {
    LOG: '/oil/log',
    LOG_GROUP: '/oil/log-group',
    ENTRIES: '/oil/entries',
    TODAY: '/oil/today',
    WEEKLY_STATS: '/oil/stats/weekly',
    USER_STATUS: '/oil/user-oil-status',
    UPDATE: '/oil',
    DELETE: '/oil',
  },
  // Group endpoints
  GROUPS: {
    BASE: '/groups',
    INVITATIONS: '/groups/invitations',
    ADMIN: '/groups/admin',
    SEARCH_USERS: '/groups/search-users',
    INVITE: (id: string) => `/groups/${id}/invite`,
    ACCEPT: (id: string) => `/groups/${id}/accept`,
    REJECT: (id: string) => `/groups/${id}/reject`,
    LEAVE: (id: string) => `/groups/${id}/leave`,
    REMOVE_MEMBER: (id: string, userId: string) => `/groups/${id}/members/${userId}`,
    PROMOTE: (id: string, userId: string) => `/groups/${id}/promote/${userId}`,
    DETAIL: (id: string) => `/groups/${id}`,
    UPDATE: (id: string) => `/groups/${id}`,
    DELETE: (id: string) => `/groups/${id}`,
  },
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
