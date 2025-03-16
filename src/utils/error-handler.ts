import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';

export class ErrorHandler {
  static handle(error: unknown): ApiError {
    if (this.isAxiosError(error)) {
      return this.handleAxiosError(error);
    }
    return this.handleGenericError(error);
  }

  private static isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError === true;
  }

  private static handleAxiosError(error: AxiosError): ApiError {
    const status = error.response?.status;
    const data = error.response?.data as any;

    switch (status) {
      case 400:
        return {
          message: 'Invalid request',
          errors: data.errors,
          status: 400
        };
      case 401:
        return {
          message: 'Unauthorized access',
          status: 401
        };
      case 403:
        return {
          message: 'Access forbidden',
          status: 403
        };
      case 404:
        return {
          message: 'Resource not found',
          status: 404
        };
      case 422:
        return {
          message: 'Validation error',
          errors: data.errors,
          status: 422
        };
      default:
        return {
          message: 'An unexpected error occurred',
          status: status || 500
        };
    }
  }

  private static handleGenericError(error: unknown): ApiError {
    return {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      status: 500
    };
  }
}