import Joi from 'joi';
import Boom from 'boom';

import { get, find } from 'lodash';
import User from '../models/user';
import Room from '../models/room';
import Anonyme from '../models/anonyme';

export default {
  validate: {
    params: Joi.object().keys({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    query: {
      anonymeId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    },
  },
  handler: async ({ params, query, auth }, h) => {
    try {
      const userId = get(auth, 'credentials.id');
      const user = await User.findById(userId);
      const anon = await Anonyme.findById(query.anonymeId);
      const room = await Room.findById(params.id);
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
            anonyme._id.toString() === query.anonymeId
            && anonyme.admin === false
          ) {
            room.kicked.push(anonyme);
            room.anonymes.pull(anonyme);
            room.save();
          }
        });
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
