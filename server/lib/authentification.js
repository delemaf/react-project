import Joi from 'joi';

export const AUTH_SECRET = 'Jp9PTwyi9EhiZBupNhzSewtGDgef';

const JoiUUID = Joi.string()
  .uuid()
  .required();

export const validate = ({ id }) => {
  console.log(id, Joi.validate(id, JoiUUID));
  if (!id) {
    return { isValid: false };
  }
  return { isValid: true };
};
