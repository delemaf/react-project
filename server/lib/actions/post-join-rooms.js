import Joi from 'joi';
import Boom from 'boom';

import { omit, get, find } from 'lodash';
import User from '../models/user';
import Room from '../models/room';
import Anonyme from '../models/anonyme';

export default {
  validate: {
    params: Joi.object().keys({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
  handler: async ({ params, auth }, h) => {
    try {
      const userId = get(auth, 'credentials.id');
      const user = await User.findById(userId);
      const room = await Room.findById(params.id);
      let alreadyExists = false;

      if (!user) {
        return Boom.notFound('User not found');
      } else if (!room) {
        return Boom.notFound('Room not found');
      }

      alreadyExists = !!find(room.anonymes.toObject(), { _id: userId });

      if (alreadyExists) {
        return Boom.conflict('User already exists on the room');
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
