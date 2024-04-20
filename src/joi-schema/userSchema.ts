import * as Joi from 'joi';

export const userCreateSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'email|The email is incorrect',
        'string.empty': 'email|The email is empty.',
      }),
    firstName: Joi.string().min(2).max(30).required().messages({
      'string.empty': 'name|The name is empty.',
      'string.min': 'name|The name cannot be less than 2 characters',
      'string.max': 'name|The name cannot be more than 30 characters',
    }),
    lastName: Joi.string().min(2).max(30).required().messages({
      'string.empty': 'name|The name is empty.',
      'string.min': 'name|The name cannot be less than 2 characters',
      'string.max': 'name|The name cannot be more than 30 characters',
    }),
    password: Joi.string()
      .regex(/(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,30}/)
      .required()
      .messages({
        'string.empty': 'password|The password is empty.',
        'string.pattern.base':
          'password|Password may have a minimum of 8 characters, including at least one capital letter and one number',
      }),
  })
  .options({ stripUnknown: false });

export const userUpdateSchema = Joi.object()
  .keys({
    firstName: Joi.string().min(2).max(30).messages({
      'string.empty': 'firstName|The first name is empty.',
      'string.base': 'firstName|The first name is empty.',
      'string.min': 'firstName|The first name cannot be less than 2 characters',
      'string.max':
        'firstName|The first name cannot be more than 30 characters',
    }),
    lastName: Joi.string().min(2).max(30).messages({
      'string.empty': 'lastName|The last name is empty.',
      'string.base': 'lastName|The last name is empty.',
      'string.min': 'lastName|The last name cannot be less than 2 characters',
      'string.max': 'lastName|The last name cannot be more than 30 characters',
    }),
    middleName: Joi.string().min(2).max(30).allow(null).messages({
      'string.empty': 'middleName|The middle name is empty.',
      'string.min':
        'middleName|The middle name cannot be less than 2 characters',
      'string.max':
        'middleName|The middle name cannot be more than 30 characters',
    }),
    bio: Joi.string().min(1).max(100).allow(null).messages({
      'string.empty': 'bio|The about me is empty.',
      'string.min': 'bio|The about me cannot be less than 2 characters',
      'string.max': 'bio|The about me cannot be more than 30 characters',
    }),
    sex: Joi.number().min(0).max(1).allow(null).messages({
      'number.empty': 'sex|The sex is empty.',
      'number.min': 'sex|The sex cannot be less than 0 characters',
      'number.max': 'sex|The sex cannot be more than 1 characters',
    }),
    birthday: Joi.date().allow(null),
    phone: Joi.object({
      country: Joi.string().min(1).max(3),
      number: Joi.string().min(2).max(30),
    }),
  })
  .options({ stripUnknown: false });
