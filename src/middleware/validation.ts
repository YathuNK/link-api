import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ValidationResult } from '../types/common';

export const validateRequest = (validator: (data: any) => ValidationResult) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = validator(req.body);
    
    if (!result.isValid) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: result.errors
      });
      return;
    }
    
    next();
  };
};

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
      return;
    }
    
    next();
  };
};
