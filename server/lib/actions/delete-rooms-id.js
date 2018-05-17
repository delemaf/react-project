import Joi from 'joi';
import Boom from 'boom';

import { get, find } from 'lodash';
import User from '../models/user';
import Room from '../models/room';
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
      let found = false;

      if (!user) {
        return Boom.notFound('User not found');
      } else if (!room) {
        return Boom.notFound('Room not found');
      }

      found = !!find(
        room.anonymes.toObject(),
        anonyme =>
          anonyme.user._id.toString() === userId && anonyme.admin === true,
      );

      if (found) {
        room.anonymes.forEach((anonyme) => {
          anonyme.remove();
        });
        room.kicked.forEach((anonyme) => {
          anonyme.remove();
        });
        RoomsManager.deleteRoom(room._id);
        room.remove();
        return h.response({}).code(204);
      }
      return Boom.unauthorized(
        'You cannot delete this room if you are not admin',
      );
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
