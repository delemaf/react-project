import Boom from 'boom';
import { omit } from 'lodash';
import Room from '../models/room';

export default {
  handler: async () => {
    try {
      const rooms = await Room.find();

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
