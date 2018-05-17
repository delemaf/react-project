import { omit } from 'lodash';
import Anonyme from './models/anonyme';
import Message from './models/message';
import Room from './models/room';

class RoomsManager {
  constructor() {
    this.rooms = [];
    this.users = [];

    Room.find({}, (err, rooms) => {
      if (rooms != null)
        rooms.forEach((room) => {
          this.addRoom(room._id);
          room.anonymes.forEach((anonyme) => {
            this.addAnonymeOnRoom(room._id, anonyme._id, anonyme.user._id);
          });
        });
    });
  }

  setUserWithWs(userId, ws) {
    let user = this.users.find(u => u.userId === userId);
    if (user) {
      user.ws = ws;
    } else {
      user = {
        userId,
        ws,
      };
      this.users.push(user);
    }
  }

  findById(roomId) {
    return this.rooms.find(r => r.roomId.toString() === roomId.toString());
  }

  deleteAnonyme(roomId, anonymeId) {
    const room = this.findById(roomId);
    if (!room) return false;
    const index = room.anonymes.findIndex(
      anonyme => anonyme.anonymeId === anonymeId,
    );
    if (index !== -1) {
      room.anonymes.splice(index, 1);
      return true;
    }
    return false;
  }

  deleteRoom(roomId) {
    const index = this.rooms.findIndex(room => room.roomId === roomId);

    if (index !== -1) {
      this.rooms.splice(index, 1);
      return true;
    }
    return false;
  }

  addRoom(roomId) {
    const room = {
      roomId,
      anonymes: [],
    };
    this.rooms.push(room);
    return room;
  }

  async getMember(anonymeId) {
    const anonyme = await Anonyme.findById(anonymeId);
    let anoModel = anonyme.toObject();
    anoModel.id = anoModel._id;
    anoModel = omit(anoModel, ['_id', '__v']);
    if (anoModel.spoiled || anoModel.admin) {
      anoModel.user = {
        id: anoModel.user._id,
        ...omit(anoModel.user, ['_id', '__v', 'password']),
      };
    } else {
      anoModel = omit(anoModel, ['user']);
    }
    return anoModel;
  }

  async getMembers(roomId) {
    const room = await Room.findById(roomId);

    const anonymes = [...room.anonymes];
    let newAno = [];
    anonymes.forEach((ano) => {
      let anonyme = ano.toObject();
      anonyme.id = anonyme._id;
      anonyme = omit(anonyme, ['_id', '__v']);
      if (anonyme.spoiled || anonyme.admin) {
        anonyme.user = {
          id: anonyme.user._id,
          ...omit(anonyme.user, ['_id', '__v', 'password']),
        };
      } else {
        anonyme = omit(anonyme, ['user']);
      }
      newAno = [...newAno, anonyme];
    });
    return newAno;
  }

  async sendMessage(room, anonymeId, payload) {
    const ano = await Anonyme.findById(anonymeId);
    if (payload.data.message.length > 0 && payload.data.type === 'MESSAGE') {
      const message = new Message({
        text: payload.data.message,
        anonyme: ano,
      });
      message.save();
    }
    room.anonymes.forEach((anom) => {
      if (anom.ws != null) {
        anom.ws.send(JSON.stringify({ payload }));
      }
    });
  }

  addAnonymeOnRoom(roomId, anonymeId, userId, ws = null) {
    const room = this.findById(roomId);
    if (!room) return false;
    let anonyme = room.anonymes.find(r => r.anonymeId === anonymeId);
    if (anonyme) {
      anonyme.ws = ws;
      return true;
    }
    anonyme = {
      anonymeId,
      userId,
      ws,
    };
    room.anonymes.push(anonyme);
    return true;
  }
}

const roomsManager = new RoomsManager();

export default roomsManager;
