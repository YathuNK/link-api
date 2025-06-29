import Joi from 'joi';
import { ValidationResult } from '../types/common';

const entityTypeSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Entity type name is required',
    'string.max': 'Entity type name cannot exceed 50 characters',
    'any.required': 'Entity type name is required'
  }),
  description: Joi.string().trim().max(200).allow('').messages({
    'string.max': 'Description cannot exceed 200 characters'
  })
});

const updateEntityTypeSchema = entityTypeSchema.fork(
  ['name'],
  (schema) => schema.optional()
);

export const validateCreateEntityType = (data: any): ValidationResult => {
  const { error } = entityTypeSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};

export const validateUpdateEntityType = (data: any): ValidationResult => {
  const { error } = updateEntityTypeSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};
