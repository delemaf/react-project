import Hapi from 'hapi';
import plugins from './plugins';

import { AUTH_SECRET, validate } from './authentification';

import routes from './routes';

async function start() {
  const server = Hapi.server({
    port: 4000,
    routes: { cors: { origin: ['*'] } },
  });

  try {
    await server.register(plugins);

    server.auth.strategy('jwt', 'jwt', {
      key: AUTH_SECRET,
      validate,
    });
    server.auth.default('jwt');

    server.route(routes);
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
}

start();
