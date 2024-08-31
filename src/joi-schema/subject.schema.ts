import * as Joi from 'joi';

export const subjectCreateSchema = Joi.object().keys({
  name: Joi.string().min(2).max(250).required(),
  short_name: Joi.string().min(2).max(50).allow(null).required(),
  icon_name: Joi.string().min(2).max(25).required(),
});

export const subjectUpdateSchema = Joi.object().keys({
  name: Joi.string().min(2).max(250),
  short_name: Joi.string().min(2).max(50).allow(null),
  icon_name: Joi.string().min(2).max(25),
});
