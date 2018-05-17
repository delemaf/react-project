import Joi from 'joi';
import Boom from 'boom';
import { get, omit } from 'lodash';
import Room from '../models/room';
import RoomsManager from '../rooms-manager';

export default {
  validate: {
    params: Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    payload: Joi.object({
      date: Joi.date()
        .default(Date.now, 'time of creation')
        .optional(),
    }),
  },
  handler: async ({ params, payload, auth }) => {
    try {
      const userId = get(auth, 'credentials.id');

      let room = RoomsManager.findById(params.id);
      if (!room) {
        return Boom.notFound('Room not found');
      }
      const anonyme = room.anonymes.filter(
        ano => ano.userId.toString() === userId,
      )[0];

      if (!anonyme) {
        return Boom.unauthorized('Unauthorized to get these messages');
      }

      room = await Room.findById(params.id);

      if (!room) {
        return Boom.notFound('Room not found');
      }

      const messages = room.messages
        .filter(message => message.date < payload.date)
        .sort()
        .slice(0, 30);

      console.log(messages);

      return messages.map(message => ({
        id: message._id,
        name:
          message.anonyme.admin || message.anonyme.spoiled
            ? message.anonyme.user.name
            : message.anonyme.name,
        spoiled: message.anonyme.admin || message.anonyme.spoiled,
        ...omit(message.toObject(), ['_id', '__v', 'anonyme']),
      }));
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
