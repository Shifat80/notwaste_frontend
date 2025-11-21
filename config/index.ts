// API Configuration
// IMPORTANT: React Native cannot access 'localhost' on physical devices/emulators
// Use your computer's IP address instead
export const API_BASE_URL = 'https://waste-backend-dun.vercel.app/api';

// For production, you can override this with environment variables
// export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.113:5000/api';

export const API_TIMEOUT = 30000; // 30 seconds

export const DEFAULT_PAGE_SIZE = 20;
