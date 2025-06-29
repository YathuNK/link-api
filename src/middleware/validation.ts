import { Request, Response, NextFunction } from 'express';
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
