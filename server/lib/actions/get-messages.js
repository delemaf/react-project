import Joi from 'joi';
import Boom from 'boom';
import { omit } from 'lodash';
import Room from '../models/room';

export default {
  validate: {
    params: Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
  handler: async ({ params }) => {
    try {
      const room = (await Room.findById(params.id)).toObject();

      if (!room) {
        return Boom.notFound('Room not found');
      }

      return room.messages.map(message => ({
        id: message._id,
        name:
          message.anonyme.admin || message.anonyme.spoiled
            ? message.anonyme.name
            : message.anonyme.user.name,
        spoiled: message.anonyme.admin || message.anonyme.spoiled,
        ...omit(message.toObject(), ['_id', '__v', 'anonyme']),
      }));
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
