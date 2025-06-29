import Joi from 'joi';
import { ValidationResult } from '../types/common';

const relationshipSchema = Joi.object({
  from: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid from ID format',
    'any.required': 'From field is required'
  }),
  to: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid to ID format',
    'any.required': 'To field is required'
  }),
  fromModel: Joi.string().valid('Person', 'Entity').required().messages({
    'any.only': 'From model must be either Person or Entity',
    'any.required': 'From model is required'
  }),
  toModel: Joi.string().valid('Person', 'Entity').required().messages({
    'any.only': 'To model must be either Person or Entity',
    'any.required': 'To model is required'
  }),
  relationship: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid relationship type ID format',
    'any.required': 'Relationship type is required'
  }),
  reverseRelationship: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid reverse relationship type ID format',
    'any.required': 'Reverse relationship type is required'
  })
});

const updateRelationshipSchema = relationshipSchema.fork(
  ['from', 'to', 'fromModel', 'toModel', 'relationship', 'reverseRelationship'],
  (schema) => schema.optional()
);

export const validateCreateRelationship = (data: any): ValidationResult => {
  const { error } = relationshipSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};

export const validateUpdateRelationship = (data: any): ValidationResult => {
  const { error } = updateRelationshipSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};
