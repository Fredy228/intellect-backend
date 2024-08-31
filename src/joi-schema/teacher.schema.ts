import * as Joi from 'joi';

export const teacherOneCreateSchema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'The email is incorrect',
      'string.empty': 'The email is empty.',
    }),
  job_title: Joi.string().min(2).max(250).required().messages({
    'string.empty': 'The job title is empty.',
    'string.min': 'The job title cannot be less than 2 characters',
    'string.max': 'The job title cannot be more than 250 characters',
  }),
});

export const teacherUpdateSchema = Joi.object().keys({
  job_title: Joi.string().min(2).max(250).messages({
    'string.empty': 'The job title is empty.',
    'string.min': 'The job title cannot be less than 2 characters',
    'string.max': 'The job title cannot be more than 250 characters',
  }),
});
