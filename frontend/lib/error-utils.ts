import { ErrorResponse, ErrorType } from './error-handler';
import { ToastType, errorTypeToToastType } from '@/components/Toast';

/**
 * Utility function to handle errors in components
 * This function can be used in catch blocks to handle errors consistently
 */
export function handleComponentError(
  error: any, 
  showToast: (type: ToastType, message: string, duration?: number) => void,
  fallbackMessage: string = 'An unexpected error occurred'
): ErrorResponse {
  // If it's already an ErrorResponse, use it directly
  if (error && error.type && Object.values(ErrorType).includes(error.type)) {
    const errorResponse = error as ErrorResponse;
    showToast(
      errorTypeToToastType(errorResponse.type),
      errorResponse.message,
      errorResponse.type === ErrorType.NETWORK ? 8000 : 5000
    );
    return errorResponse;
  }
  
  // Otherwise, create a generic error response
  const errorResponse: ErrorResponse = {
    type: ErrorType.UNKNOWN,
    message: error?.message || fallbackMessage,
    details: error
  };
  
  showToast(
    ToastType.ERROR,
    errorResponse.message
  );
  
  return errorResponse;
}

/**
 * Utility function to handle async operations with loading state and error handling
 */
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  options: {
    setLoading?: (loading: boolean) => void;
    showToast?: (type: ToastType, message: string, duration?: number) => void;
    onSuccess?: (result: T) => void;
    onError?: (error: ErrorResponse) => void;
    successMessage?: string;
    errorMessage?: string;
  }
): Promise<T | null> {
  const { 
    setLoading, 
    showToast, 
    onSuccess, 
    onError, 
    successMessage, 
    errorMessage = 'An error occurred' 
  } = options;
  
  try {
    if (setLoading) setLoading(true);
    
    const result = await operation();
    
    if (successMessage && showToast) {
      showToast(ToastType.SUCCESS, successMessage);
    }
    
    if (onSuccess) onSuccess(result);
    
    return result;
  } catch (error: any) {
    const errorResponse = showToast 
      ? handleComponentError(error, showToast, errorMessage)
      : error;
    
    if (onError) onError(errorResponse);
    
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
} 