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

export const studentManyCreateSchema = Joi.object().keys({
  groupId: Joi.array().items(Joi.number().integer()).required(),
});

export const studentChangeGroupSchema = Joi.object().keys({
  groupId: Joi.number().integer().required(),
});
