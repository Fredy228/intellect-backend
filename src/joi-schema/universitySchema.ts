import * as Joi from 'joi';

export const universityCreateSchema = Joi.object().keys({
  university_name: Joi.string().min(2).max(300),
  university_short_name: Joi.string().min(2).max(30),
});

export const universityUpdateSchema = Joi.object().keys({
  university_name: Joi.string().min(2).max(300),
  university_short_name: Joi.string().min(2).max(30),
  registration_year: Joi.number().integer().min(900).max(2100).allow(null),
  post_index_u: Joi.string()
    .pattern(/^\d{5}$/)
    .allow(null),
  university_site: Joi.string().uri({ allowRelative: false }).allow(null),
  contacts: Joi.array().items(
    Joi.object({
      title: Joi.string().min(1).max(30).messages({
        'string.empty': 'contactsTitle|The country code is empty.',
        'string.min':
          'contactsTitle|The country code cannot be less than 1 characters',
        'string.max':
          'contactsTitle|The country code cannot be more than 30 characters',
      }),
      country: Joi.string().min(1).max(3).messages({
        'string.empty': 'countryCode|The country code is empty.',
        'string.min':
          'countryCode|The country code cannot be less than 1 characters',
        'string.max':
          'countryCode|The country code cannot be more than 3 characters',
      }),
      number: Joi.string().min(2).max(30).messages({
        'number.empty': 'numberPhone|The number phone is empty.',
        'number.min':
          'numberPhone|The number phone cannot be less than 2 characters',
        'number.max':
          'numberPhone|The number phone cannot be more than 30 characters',
      }),
    }),
  ),
});

export const AdminOneCreateSchema = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'The email is incorrect',
      'string.empty': 'The email is empty.',
    }),
});
