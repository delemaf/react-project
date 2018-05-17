import Boom from 'boom';
import { omit } from 'lodash';
import Joi from 'joi';
import Room from '../models/room';

export default {
  validate: {
    params: Joi.object({
      tag: Joi.string()
        .regex(/^[0-9a-zA-Z]{2,20}$/)
        .required(),
    }),
  },
  handler: async ({ params }) => {
    try {
      const rooms = await Room.find({
        tags: { $in: [RegExp(`.*${params.tag}.*`, 'i')] },
      });

      return rooms.map(room => ({
        id: room._id,
        ...omit(room.toObject(), [
          '_id',
          '__v',
          'anonymes',
          'kicked',
          'messages',
        ]),
      }));
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
