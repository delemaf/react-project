import Joi from 'joi';
import Boom from 'boom';

import { omit, get } from 'lodash';
import User from '../models/user';
import Room from '../models/room';
import Anonyme from '../models/anonyme';
import RoomsManager from '../rooms-manager';

export default {
  validate: {
    payload: Joi.object({
      name: Joi.string()
        .required()
        .error(() => 'name'),
      tags: Joi.array()
        .items(Joi.string().regex(/^[0-9a-zA-Z]{2,20}$/))
        .max(10)
        .default([])
        .optional()
        .error(() => 'tags'),
      maxUsers: Joi.number()
        .min(2)
        .max(8)
        .default(2)
        .optional()
        .error(() => 'users'),
      description: Joi.string()
        .max(200)
        .default('')
        .optional()
        .error(() => 'description'),
    }),
  },
  handler: async ({ payload, auth }, h) => {
    try {
      const userId = get(auth, 'credentials.id');
      const user = await User.findById(userId);

      if (!user) {
        return Boom.notFound('User not found');
      }

      const anonyme = new Anonyme({
        user,
        admin: true,
        spoiled: true,
      });

      await anonyme.save();

      const room = new Room({
        name: payload.name,
        tags: payload.tags,
        maxUsers: payload.maxUsers,
        description: payload.description,
        anonymes: [anonyme],
      });

      await room.save();

      RoomsManager.addRoom(room._id);
      RoomsManager.addAnonymeOnRoom(room._id, anonyme._id, userId);

      return h
        .response({
          id: room._id,
          ...omit(room.toObject(), [
            'messages',
            '_id',
            '__v',
            'anonymes',
            'kicked',
          ]),
        })
        .code(201);
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
