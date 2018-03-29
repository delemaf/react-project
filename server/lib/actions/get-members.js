import Joi from 'joi';
import Boom from 'boom';
import { omit } from 'lodash';
import Room from '../models/room';
import Anonyme from '../models/anonyme';

export default {
  validate: {
    params: Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
  },
  handler: async ({ payload }) => {
    try {
      const room = await Room.findById(payload.id);

      if (!room) {
        return Boom.notFound('Room not found');
      }

      const anonymes = (await Anonyme.find({ room: room._id })).toObject();

      anonymes.forEach((anonyme) => {
        anonyme.id = anonyme._id;
        omit(anonyme, ['_id', '__v']);
        if (anonyme.spoiled || anonyme.admin) {
          anonyme.user = {
            id: anonyme.user._id,
            ...omit(anonyme.user.toObject(), ['_id', '__v', 'password']),
          };
        } else {
          omit(anonyme, ['user']);
        }
      });

      return anonymes;
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
