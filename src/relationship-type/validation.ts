import Joi from 'joi';
import { ValidationResult } from '../types/common';

const relationshipTypeSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Relationship type name is required',
    'string.max': 'Relationship type name cannot exceed 50 characters',
    'any.required': 'Relationship type name is required'
  })
});

const updateRelationshipTypeSchema = relationshipTypeSchema.fork(
  ['name'],
  (schema) => schema.optional()
);

export const validateCreateRelationshipType = (data: any): ValidationResult => {
  const { error } = relationshipTypeSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};

export const validateUpdateRelationshipType = (data: any): ValidationResult => {
  const { error } = updateRelationshipTypeSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};
