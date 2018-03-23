import Joi from 'joi';
import Boom from 'boom';
import { omit, get } from 'lodash';
import User from '../models/user';

export default {
  validate: {
    query: Joi.object({
      email: Joi.string().email(),
      name: Joi.string(),
    }).default({}),
  },
  handler: async ({ query, auth }) => {
    try {
      const users = await User.find(query);

      return users.map(user => ({
        id: user._id,
        ...omit(user.toObject(), ['_id', '__v', 'password']),
      }));
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
