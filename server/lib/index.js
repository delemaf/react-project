import Hapi from 'hapi';
import hapiAuthJWT2 from 'hapi-auth-jwt2';

import { AUTH_SECRET, validate } from './authentification';

import postUsers from './actions/post-users';
import getUsers from './actions/get-users';
import getUsersId from './actions/get-users-id';
import patchUsersId from './actions/patch-users-id';
import postLogin from './actions/post-login';

async function start() {
  const server = Hapi.server({
    port: 3000,
  });

  try {
    await server.register([hapiAuthJWT2]);

    server.auth.strategy('jwt', 'jwt', {
      key: AUTH_SECRET,
      validate,
    });
    server.auth.default('jwt');

    server.route([
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
    ]);

    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
}

start();
