// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://d918281c-1bd6-402c-9393-c4aff6ab45cd-00-24vj3sc6uk3ba.worf.replit.dev',
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_RESET_TOKEN: '/api/auth/verify-reset-token',
    RESET_PASSWORD: '/api/auth/reset-password',
    
    // User endpoints
    USER_ASK: '/api/user/ask',
    USER_CREDITS: '/api/user/credits',
    USER_PROFILE: '/api/user/profile',
    USER_FEEDBACK: '/api/user/feedback',
    USER_FEEDBACK_SEARCH: '/api/user/feedback/search',
    USER_FEEDBACK_DELETE: '/api/user/feedback',
    USER_FEEDBACK_HISTORY: '/api/user/feedback/my',
    USER_SEARCH_HISTORY: '/api/user/search-history',
    USER_SEARCH_HISTORY_STATS: '/api/user/search-history/stats',
    USER_TICKETS: '/api/user/tickets',
    
    // System endpoints
    MAINTENANCE_STATUS: '/api/maintenance/status',
    // Payment settings
    USER_PAYMENT_SETTINGS: '/api/user/payment-settings',
    HEALTH: '/health'
  }
}

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}