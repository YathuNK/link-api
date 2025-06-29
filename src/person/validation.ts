import Joi from 'joi';
import { ValidationResult } from '../types/common';

const personSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().trim().max(50).allow('').messages({
    'string.max': 'Last name cannot exceed 50 characters'
  }),
  description: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'Description cannot exceed 500 characters'
  }),
  dateOfBirth: Joi.date().max('now').allow(null).messages({
    'date.max': 'Date of birth cannot be in the future'
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

const updatePersonSchema = personSchema.fork(
  ['firstName'],
  (schema) => schema.optional()
);

export const validateCreatePerson = (data: any): ValidationResult => {
  const { error } = personSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};

export const validateUpdatePerson = (data: any): ValidationResult => {
  const { error } = updatePersonSchema.validate(data, { abortEarly: false });
  
  if (error) {
    return {
      isValid: false,
      errors: error.details.map(detail => detail.message)
    };
  }
  
  return { isValid: true, errors: [] };
};
