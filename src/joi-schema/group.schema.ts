import * as Joi from 'joi';

export const groupCreateSchema = Joi.object().keys({
  name: Joi.string().min(2).max(300).required(),
  level: Joi.number().integer().min(1).max(15).default(null),
  start_date: Joi.date().allow(null).default(null),
  end_date: Joi.date().allow(null).default(null),
});

export const groupUpdateSchema = Joi.object().keys({
  name: Joi.string().min(2).max(300),
  level: Joi.number().integer().min(1).max(15),
  start_date: Joi.date().allow(null),
  end_date: Joi.date().allow(null),
});
