import Boom from 'boom';
import fs from 'fs';
import Joi from 'joi';
import { get } from 'lodash';
import User from '../models/user';

export default {
  validate: {
    payload: Joi.object({
      file: Joi.object({
        filename: Joi.string().required(),
        path: Joi.string().required(),
        headers: Joi.object({
          'content-disposition': Joi.string().required(),
          'content-type': Joi.string()
            .valid(['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'])
            .required(),
        }).required(),
        bytes: Joi.number()
          .max(1000 * 1000 * 2)
          .required(),
      }),
    }),
  },
  handler: async ({ payload, auth }, h) => {
    try {
      const userId = get(auth, 'credentials.id');
      const user = await User.findById(userId);
      const pictureDir = `${process.cwd()}/pictures`;

      if (!user) {
        return Boom.notFound('User not found');
      }

      if (!fs.existsSync(pictureDir)) {
        fs.mkdirSync(pictureDir, 0o755);
      }

      fs.renameSync(payload.file.path, `${pictureDir}/${userId}`);

      return h.response({}).code(200);
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
