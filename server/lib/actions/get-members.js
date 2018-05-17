import Joi from 'joi';
import Boom from 'boom';
import Room from '../models/room';
import RoomsManager from '../rooms-manager';

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
      const room = await Room.findById(params.id);

      if (!room) {
        return Boom.notFound('Room not found');
      }

      const anonymes = await RoomsManager.getMembers(room._id);
      console.log(anonymes);

      return anonymes;
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
