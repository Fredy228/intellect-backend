import * as Joi from 'joi';

export const SendEmailSchema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'The email is incorrect',
      'string.empty': 'The email is empty.',
    }),
});
