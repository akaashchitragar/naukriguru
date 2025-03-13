/**
 * Error handling utility for Naukri Guru
 * Provides consistent error handling across the application
 */

// Custom error types
export enum ErrorType {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NETWORK = 'network',
  SERVER = 'server',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
  PAYMENT = 'payment',
  FILE_UPLOAD = 'file_upload',
  RATE_LIMIT = 'rate_limit',
  MAINTENANCE = 'maintenance'
}

// Error response structure
export interface ErrorResponse {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  retry?: boolean;
}

/**
 * Handles API errors and returns a standardized error response
 */
export function handleApiError(error: any): ErrorResponse {
  console.error('API Error:', error);
  
  // Network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      type: ErrorType.NETWORK,
      message: 'Unable to connect to the server. Please check your internet connection.',
      retry: true
    };
  }
  
  // Handle HTTP errors
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode;
    
    switch (status) {
      case 401:
        return {
          type: ErrorType.AUTHENTICATION,
          message: 'Your session has expired. Please sign in again.',
          code: 'SESSION_EXPIRED'
        };
        
      case 403:
        return {
          type: ErrorType.AUTHORIZATION,
          message: 'You do not have permission to perform this action.',
          code: 'PERMISSION_DENIED'
        };
        
      case 404:
        return {
          type: ErrorType.SERVER,
          message: 'The requested resource was not found.',
          code: 'RESOURCE_NOT_FOUND'
        };
        
      case 422:
        return {
          type: ErrorType.VALIDATION,
          message: 'The provided data is invalid.',
          details: error.data || error.details,
          code: 'VALIDATION_ERROR'
        };
        
      case 429:
        return {
          type: ErrorType.RATE_LIMIT,
          message: 'Too many requests. Please try again later.',
          retry: true,
          code: 'RATE_LIMITED'
        };
        
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ErrorType.SERVER,
          message: 'A server error occurred. Our team has been notified.',
          retry: true,
          code: 'SERVER_ERROR'
        };
        
      default:
        return {
          type: ErrorType.UNKNOWN,
          message: 'An unexpected error occurred. Please try again.',
          code: `HTTP_${status}`
        };
    }
  }
  
  // Firebase authentication errors
  if (error.code && error.code.startsWith('auth/')) {
    return handleFirebaseAuthError(error);
  }
  
  // File upload errors
  if (error.message && error.message.includes('file')) {
    return {
      type: ErrorType.FILE_UPLOAD,
      message: 'There was a problem with the file upload. Please try again with a different file.',
      details: error.message
    };
  }
  
  // Default error
  return {
    type: ErrorType.UNKNOWN,
    message: error.message || 'An unexpected error occurred.',
    details: error
  };
}

/**
 * Handles Firebase authentication errors
 */
function handleFirebaseAuthError(error: any): ErrorResponse {
  const errorCode = error.code;
  let message = 'An authentication error occurred.';
  
  switch (errorCode) {
    case 'auth/invalid-email':
      message = 'The email address is not valid.';
      break;
    case 'auth/user-disabled':
      message = 'This user account has been disabled.';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email address.';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password. Please try again.';
      break;
    case 'auth/email-already-in-use':
      message = 'This email is already in use. Please use a different email or sign in.';
      break;
    case 'auth/weak-password':
      message = 'The password is too weak. Please use a stronger password.';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your internet connection.';
      break;
    case 'auth/too-many-requests':
      message = 'Too many unsuccessful login attempts. Please try again later.';
      break;
    case 'auth/requires-recent-login':
      message = 'This operation requires a recent login. Please sign in again.';
      break;
    default:
      message = 'An authentication error occurred. Please try again.';
  }
  
  return {
    type: ErrorType.AUTHENTICATION,
    message,
    code: errorCode
  };
}

/**
 * Displays an error message to the user
 * This can be integrated with a toast notification system
 */
export function showErrorMessage(error: ErrorResponse): void {
  // This function can be implemented to show error messages using a toast library
  console.error('Error:', error.message);
  
  // Here you would integrate with your UI notification system
  // Example: toast.error(error.message);
}

/**
 * Logs errors to a monitoring service
 */
export function logError(error: any, context?: any): void {
  // Log to console in development
  console.error('Error logged:', error, context);
  
  // In production, you would send this to a monitoring service like Sentry
  // Example: Sentry.captureException(error, { extra: context });
} 