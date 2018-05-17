import hapiAuthJWT2 from 'hapi-auth-jwt2';
import HAPIWebSocket from 'hapi-plugin-websocket';

const plugins = [hapiAuthJWT2, HAPIWebSocket];

export default plugins;
