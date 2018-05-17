import Joi from 'joi';
import Boom from 'boom';
import { get } from 'lodash';

import RoomsManager from '../rooms-manager';

export default {
  validate: {
    payload: Joi.object({
      type: Joi.string().required(),
      data: Joi.object({
        room: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(),
        message: Joi.string().default(''),
      }).required(),
    }),
  },
  handler: async ({ payload, websocket, auth }) => {
    try {
      const userId = get(auth, 'credentials.id');
      console.log('test');

      const { ws } = websocket();

      if (payload.type === 'CONNECT') {
        // CONNECT
        const room = RoomsManager.findById(payload.data.room);
        if (!room) {
          return Boom.notFound('Room not found');
        }
        const anonyme = room.anonymes.filter(
          ano => ano.userId.toString() === userId,
        )[0];

        if (anonyme) {
          const anoModel = await RoomsManager.getMember(anonyme.anonymeId);
          anonyme.ws = ws;
          const data = {
            type: 'CONNECT',
            data: {
              room: room.roomId,
              member: anoModel,
              message: '',
              date: Date.now,
            },
          };
          await RoomsManager.sendMessage(room, anonyme.anonymeId, data);
          return { result: 'CONNECTED' };
        }
        return Boom.unauthorized('Unauthorized');
      } else if (payload.type === 'MESSAGE') {
        // MESSAGE
        const room = RoomsManager.findById(payload.data.room);
        console.log(room);
        if (!room) {
          return Boom.notFound('Room not found');
        }

        const anonyme = room.anonymes.filter(
          ano => ano.userId.toString() === userId,
        )[0];

        if (anonyme) {
          const anoModel = await RoomsManager.getMember(anonyme.anonymeId);
          anonyme.ws = ws;
          const data = {
            type: 'MESSAGE',
            data: {
              room: room.roomId,
              member: anoModel,
              message: payload.data.message,
              date: Date.now,
            },
          };
          await RoomsManager.sendMessage(room, anonyme.anonymeId, data);
          return { result: 'MESSAGE SENT' };
        }
        return Boom.unauthorized('Unauthorized');
      }
      return { result: 'UNKNOWN COMMAND' };
    } catch (err) {
      console.error(err);
      return Boom.internal(err);
    }
  },
};
