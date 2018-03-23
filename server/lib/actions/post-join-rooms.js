import Joi from 'joi';
import Boom from 'boom';

import { omit, get } from 'lodash';
import User from '../models/user';
import Room from '../models/room';
import Anonyme from '../models/anonyme';

export default {
  validate: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
    // query: Joi.object({
    //   name: Joi.string().required(),
    //   tags: Joi.array()
    //     .items(Joi.string())
    //     .min(1)
    //     .max(10)
    //     .required(),
    //   max_users: Joi.number()
    //     .min(2)
    //     .max(8)
    //     .default(2)
    //     .optional(),
    //   description: Joi.string()
    //     .max(200)
    //     .optional(),
    // }),
  },
  handler: async ({ params, auth }, h) => {
    try {
      const userId = get(auth, 'credentials.id');
      const user = await User.findById(userId);
      const room = await Room.findById(params.id);

      if (user) {
        return Boom.notFound('User not found');
      } else if (room) {
        return Boom.notFound('Room not found');
      }

      const anonyme = new Anonyme({
        room: room._id,
        user: userId,
      });

      await anonyme.save();

      await room.save({
        anononymes: [...room.anononymes, anonyme],
      });

      return h
        .response({
          id: anonyme._id,
          ...omit(anonyme, ['user', '_id', '__v']),
        })
        .code(201);
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
