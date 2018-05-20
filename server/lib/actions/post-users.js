import Joi from 'joi';
import Boom from 'boom';
import { omit } from 'lodash';
import Bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import { AUTH_SECRET } from '../authentification';

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
      description: Joi.string()
        .default('')
        .optional(),
      image: Joi.string().optional(),
    }),
  },
  handler: async ({ payload }) => {
    try {
      const user = await User.findOne({ email: payload.email });

      if (user) {
        return Boom.badRequest('Email already exists');
      }

      const result = (await User.create({
        ...payload,
        password: Bcrypt.hashSync(payload.password, 6),
      })).toObject();

      const token = {
        id: result._id,
      };

      return {
        id: result._id,
        ...omit(result, ['_id', '__v', 'password']),
        token: jwt.sign(token, AUTH_SECRET, {
          expiresIn: 2592000,
        }),
      };
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
