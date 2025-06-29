import Joi from 'joi';
import { ValidationResult } from '../types/common';

const entitySchema = Joi.object({
  type: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid entity type ID format',
    'any.required': 'Entity type is required'
  }),
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Entity name is required',
    'string.max': 'Entity name cannot exceed 100 characters',
    'any.required': 'Entity name is required'
  }),
  description: Joi.string().trim().max(1000).allow('').messages({
    'string.max': 'Description cannot exceed 1000 characters'
  }),
  websites: Joi.array().items(
    Joi.string().uri().messages({
      'string.uri': 'Invalid URL format'
    })
  ).default([]),
  images: Joi.array().items(Joi.string()).default([]),
  place: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).messages({
    'string.pattern.base': 'Invalid place ID format'
  })
});

const updateEntitySchema = entitySchema.fork(
  ['type', 'name'],
  (schema) => schema.optional()
);

export const validateCreateEntity = (data: any): ValidationResult => {
  const { error } = entitySchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};

export const validateUpdateEntity = (data: any): ValidationResult => {
  const { error } = updateEntitySchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};
