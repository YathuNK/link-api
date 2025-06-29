import Joi from 'joi';
import { ValidationResult } from '../types/common';

const placeSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Place name is required',
    'string.max': 'Place name cannot exceed 100 characters',
    'any.required': 'Place name is required'
  }),
  description: Joi.string().trim().max(1000).allow('').messages({
    'string.max': 'Description cannot exceed 1000 characters'
  }),
  images: Joi.array().items(Joi.string()).default([])
});

const updatePlaceSchema = placeSchema.fork(
  ['name'],
  (schema) => schema.optional()
);

export const validateCreatePlace = (data: any): ValidationResult => {
  const { error } = placeSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};

export const validateUpdatePlace = (data: any): ValidationResult => {
  const { error } = updatePlaceSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};
