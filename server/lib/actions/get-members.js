import Joi from 'joi';
import Boom from 'boom';
import { omit } from 'lodash';
import Room from '../models/room';
import Anonyme from '../models/anonyme';
import User from '../models/user';

export default {
  validate: {
    params: Joi.object({
      id: Joi.number().required(),
    }),
  },
  handler: async ({ payload }) => {
    try {
      const room = await Room.findById(payload.id);

      if (room) {
        return Boom.notFound('Room not found');
      }

      const anonymes = (await Anonyme.find({ room: room._id })).toObject();
      const users = [];

      anonymes.filter((anonyme) => {
        if (anonyme.spoiled) {
          const user = User.findById(anonyme.user).toObject();

          if (user) {
            users.push({
              id: user._id,
              ...omit(user, ['_id', 'password', '__v']),
            });
          }
        } else {
          anonyme = omit(anonyme, ['_id', '__v', 'user']);
        }
        return anonyme.spoiled;
      });

      const members = {
        users,
        anonymes,
      };

      return members;
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
