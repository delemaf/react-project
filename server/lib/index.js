import Hapi from 'hapi';

import postUsers from './actions/post-users';

const server = Hapi.server({
  port: 3000,
});

server.route([
  {
    method: 'POST',
    path: '/users',
    config: postUsers,
  },
]);

async function start() {
  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
}

start();
