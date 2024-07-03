import * as Joi from 'joi';

export const studentOneCreateSchema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'email|The email is incorrect',
      'string.empty': 'email|The email is empty.',
    }),
});
