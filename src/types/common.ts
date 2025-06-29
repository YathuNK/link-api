import { Request, Response, NextFunction } from 'express';

// Common response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    current: number;
    pages: number;
    count: number;
    total: number;
  };
}

// Query interfaces
export interface QueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: string | undefined;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
}

// Controller types
export type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Image upload types
export interface ImageUploadResult {
  url: string;
  publicId: string;
}
