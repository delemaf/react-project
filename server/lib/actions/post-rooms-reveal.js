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
  },
  handler: async ({ params, auth }, h) => {
    try {
      const userId = get(auth, 'credentials.id');
      const user = await User.findById(userId);
      let room = await Room.findById(params.id);

      if (!user) {
        return Boom.notFound('User not found');
      } else if (!room) {
        return Boom.notFound('Room not found');
      }

      const ano = find(
        room.anonymes,
        anonyme => anonyme.user._id.toString() === userId,
      );

      if (ano) {
        const anonyme = await Anonyme.findById(ano._id);
        const anoModel = await RoomsManager.getMember(ano._id);

        anonyme.spoiled = true;
        ano.spoiled = true;
        anonyme.save();
        room.save();
        room = RoomsManager.findById(params.id);
        const data = {
          type: 'REVEAL',
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
      return Boom.notFound('Member not found');
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
