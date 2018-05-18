import Boom from 'boom';
import fs from 'fs';
import Joi from 'joi';
import User from '../models/user';

export default {
  validate: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
  handler: async ({ params }, h) => {
    try {
      const user = await User.findById(params.id);
      const filepath = `${process.cwd()}/pictures/${params.id}`;

      if (!user) {
        return Boom.notFound('User not found');
      }
      if (fs.existsSync(filepath)) {
        const stat = fs.statSync(filepath);
        const file = fs.readFileSync(filepath);

        return h.response(file).header('Content-Length', stat.length);
      }
      return h.response({}).code(204);
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
