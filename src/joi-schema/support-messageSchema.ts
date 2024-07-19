import * as Joi from 'joi';
import { ESupportMessagesStatus } from '../enums/user/support-messages.enum';

export const supportMessageCreateSchema = Joi.object().keys({
  title: Joi.string().min(2).max(300).required().messages({
    'string.empty': 'title|The title is empty.',
    'string.min': 'title|The title cannot be less than 2 characters',
    'string.max': 'title|The title cannot be more than 300 characters',
  }),
  message: Joi.string().min(2).max(1000).required().messages({
    'string.empty': 'message|The message is empty.',
    'string.min': 'message|The message cannot be less than 2 characters',
    'string.max': 'message|The message cannot be more than 1000 characters',
  }),
});

export const supportMessageUpdateSchema = Joi.object().keys({
  status: Joi.number().valid(...Object.values(ESupportMessagesStatus)),
});
