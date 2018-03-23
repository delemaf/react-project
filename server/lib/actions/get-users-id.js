import Joi from 'joi';
import Boom from 'boom';
import { omit } from 'lodash';
import User from '../models/user';

export default {
  validate: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
  handler: async ({ params }) => {
    try {
      const user = (await User.findOne({ _id: params.id })).toObject();

      if (user) {
        return {
          id: user._id,
          ...omit(user, ['_id', '__v', 'password']),
        };
      }
      return Boom.notFound();
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
