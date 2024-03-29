import Joi from 'joi';
import Boom from 'boom';

import { get, find } from 'lodash';
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
    payload: {
      anonymeId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
  handler: async ({ params, payload, auth }, h) => {
    try {
      const userId = get(auth, 'credentials.id');
      const user = await User.findById(userId);
      const anon = await Anonyme.findById(payload.anonymeId);
      let room = await Room.findById(params.id);
      let found = false;

      if (!user) {
        return Boom.notFound('User not found');
      } else if (!room) {
        return Boom.notFound('Room not found');
      } else if (!anon) {
        return Boom.notFound('Anonyme not found');
      }

      found = !!find(
        room.anonymes.toObject(),
        anonyme =>
          anonyme.user._id.toString() === userId && anonyme.admin === true,
      );

      if (found) {
        room.anonymes.forEach((anonyme) => {
          if (
            anonyme._id.toString() === payload.anonymeId
            && anonyme.admin === false
          ) {
            room.kicked.push(anonyme);
            room.anonymes.pull(anonyme);
            RoomsManager.deleteAnonyme(room._id, anonyme._id);
            room.save();
          }
        });
        const anoModel = await RoomsManager.getMember(anon._id);
        room = RoomsManager.findById(params.id);
        const data = {
          type: 'KICK',
          data: {
            room: room.roomId,
            member: anoModel,
            message: '',
            date: Date.now,
          },
        };
        await RoomsManager.sendMessage(room, anoModel.anonymeId, data);
        return h.response({}).code(204);
      }
      return Boom.unauthorized(
        'You cannot kick an anonyme if you are not admin',
      );
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
