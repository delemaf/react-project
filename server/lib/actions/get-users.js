import Boom from 'boom';
import { omit } from 'lodash';
import User from '../models/user';

export default {
  handler: async () => {
    try {
      const users = await User.find();

      return users.map(user => ({
        id: user._id,
        ...omit(user.toObject(), ['_id', '__v', 'password']),
      }));
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
