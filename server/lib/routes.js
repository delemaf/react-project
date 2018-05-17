import getUsers from './actions/get-users';
import postUsers from './actions/post-users';
import getUsersId from './actions/get-users-id';
import patchUsersId from './actions/patch-users-id';
import postLogin from './actions/post-login';
import getMessages from './actions/get-messages';
import postJoinRooms from './actions/post-join-rooms';
import getRooms from './actions/get-rooms';
import getMembers from './actions/get-members';
import postRooms from './actions/post-rooms';
import deleteRooms from './actions/delete-rooms-id';
import postRoomsKickId from './actions/post-rooms-kick-id';
import postSendMessages from './actions/post-send-messages';
import postRoomsReveal from './actions/post-rooms-reveal';

const routes = [
  {
    method: 'GET',
    path: '/rooms/{id}/messages',
    config: { ...getMessages, auth: 'jwt' },
  },
  {
    method: 'GET',
    path: '/rooms/{id}/members',
    config: { ...getMembers, auth: 'jwt' },
  },
  {
    method: 'POST',
    path: '/rooms/{id}/join',
    config: { ...postJoinRooms, auth: 'jwt' },
  },
  {
    method: 'GET',
    path: '/rooms',
    config: { ...getRooms, auth: 'jwt' },
  },
  {
    method: 'POST',
    path: '/rooms',
    config: { ...postRooms, auth: 'jwt' },
  },
  {
    method: 'DELETE',
    path: '/rooms/{id}',
    config: { ...deleteRooms, auth: 'jwt' },
  },
  {
    method: 'POST',
    path: '/rooms/{id}/kick',
    config: { ...postRoomsKickId, auth: 'jwt' },
  },
  {
    method: 'POST',
    path: '/users',
    config: { ...postUsers, auth: false },
  },
  {
    method: 'GET',
    path: '/users',
    config: { ...getUsers, auth: 'jwt' },
  },
  {
    method: 'GET',
    path: '/users/{id}',
    config: { ...getUsersId, auth: 'jwt' },
  },
  {
    method: 'PATCH',
    path: '/users/{id}',
    config: { ...patchUsersId, auth: 'jwt' },
  },
  {
    method: 'POST',
    path: '/login',
    config: { ...postLogin, auth: false },
  },
  {
    method: 'POST',
    path: '/rooms/{id}/reveal',
    config: { ...postRoomsReveal, auth: 'jwt' },
  },
  {
    method: 'POST',
    path: '/send_messages',
    config: {
      plugins: {
        websocket: true,
      },
      ...postSendMessages,
      auth: 'jwt',
    },
  },
];

export default routes;
