import Joi from 'joi';
import Boom from 'boom';

import { omit, get, find } from 'lodash';
import User from '../models/user';
import Room from '../models/room';
import Anonyme from '../models/anonyme';
import RoomsManager from '../rooms-manager';

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
      let isKicked = false;

      if (!user) {
        return Boom.notFound('User not found');
      } else if (!room) {
        return Boom.notFound('Room not found');
      }

      if (room.anonymes.length === room.maxUsers) {
        return Boom.forbidden('cannot join this room');
      }

      alreadyExists = !!find(
        room.anonymes.toObject(),
        anonyme => anonyme.user._id.toString() === userId,
      );
      isKicked = !!find(
        room.kicked.toObject(),
        anonyme => anonyme.user._id.toString() === userId,
      );

      if (alreadyExists) {
        return Boom.conflict('User already exists on the room');
      } else if (isKicked) {
        return Boom.unauthorized('You have been kicked from this room');
      }

      const anonyme = new Anonyme({
        user,
      });

      await anonyme.save();

      room.anonymes = [...room.anonymes, anonyme];

      await room.save();

      RoomsManager.addAnonymeOnRoom(anonyme._id, room._id, userId);

      return h
        .response({
          id: room._id,
          ...omit(room.toObject(), [
            'messages',
            '_id',
            '__v',
            'anonymes',
            'kicked',
          ]),
        })
        .code(201);
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
