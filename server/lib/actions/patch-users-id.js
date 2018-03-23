import Joi from 'joi';
import Boom from 'boom';
import { omit, get } from 'lodash';
import User from '../models/user';

export default {
  validate: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    payload: Joi.object({
      email: Joi.string().email(),
      password: Joi.string().min(8),
      name: Joi.string().required(),
      age: Joi.number()
        .integer()
        .min(18),
      description: Joi.string(),
      image: Joi.string(),
    }),
  },
  handler: async ({ params, payload, auth }) => {
    try {
      if (get(auth, 'credentials.id') !== params.id) {
        return Boom.unauthorized();
      }

      const user = await User.findOne({ _id: params.id });

      if (!user) {
        return Boom.notFound();
      }
      const result = (await User.save(payload)).toObject();
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
