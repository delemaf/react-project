import Joi from 'joi';
import Boom from 'boom';
import { omit } from 'lodash';
import Room from '../models/room';

export default {
  validate: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  handler: async ({ params }) => {
    try {
      const room = (await Room.findById(params.id)).toObject();

      if (room) {
        return Boom.notFound('Room not found');
      }

      return room.messages.map(message => ({
        id: message._id,
        ...omit(message, ['_id', '__v']),
      }));
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
