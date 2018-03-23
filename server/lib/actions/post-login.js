import Joi from 'joi';
import Boom from 'boom';
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
    }),
  },
  handler: async ({ payload }) => {
    try {
      const user = await User.findOne({ email: payload.email });

      if (!user) {
        return Boom.notFound();
      }
      console.log(payload.password, user.password);
      if (!Bcrypt.compareSync(payload.password, user.password)) {
        return Boom.badRequest();
      }
      const token = {
        id: user.id,
      };

      return jwt.sign(token, AUTH_SECRET, {
        expiresIn: 2592000,
      });
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
