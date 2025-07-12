import Joi from 'joi';

export const googleAuthSchema = Joi.object({
  googleToken: Joi.string().required().messages({
    'string.empty': 'Google token is required',
    'any.required': 'Google token is required',
  }),
});

export const verifyTokenSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token is required',
    'any.required': 'Token is required',
  }),
});
