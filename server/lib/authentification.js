import Joi from 'joi';

export const AUTH_SECRET = 'Jp9PTwyi9EhiZBupNhzSewtGDgef';

const JoiUUID = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required();

export const validate = ({ id }) => {
  Joi.validate(id, JoiUUID);

  if (!id) {
    return { isValid: false };
  }
  return { isValid: true };
};
