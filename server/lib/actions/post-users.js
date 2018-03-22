import Joi from 'joi';
import Boom from 'boom';
import { omit } from 'lodash';
import User from '../models/user';

export default {
  validate: {
    payload: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required(),
      name: Joi.string().required(),
      age: Joi.number()
        .integer()
        .min(18)
        .required(),
      description: Joi.string(),
    }),
  },
  handler: async ({ payload }, h) => {
    try {
      const user = await User.findOne({ email: payload.email });

      if (user) {
        return Boom.badRequest('Email already exists');
      }
      const result = (await User.create(payload)).toObject();
      return {
        id: result._id,
        ...omit(result, ['_id', '__v']),
      };
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
