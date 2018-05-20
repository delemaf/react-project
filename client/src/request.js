import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:4000';

const responseBody = res => res.body;

let token = null;
const tokenPlugin = (req) => {
  if (token) {
    req.set('Authorization', `Token ${token}`);
  }
};

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .accept('application/json')
      .use(tokenPlugin)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .accept('application/json')
      .use(tokenPlugin)
      .then(responseBody),
  patch: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .accept('application/json')
      .use(tokenPlugin)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .accept('application/json')
      .use(tokenPlugin)
      .then(responseBody),
  image: (url, imagePath) =>
    superagent
      .post(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .attach('file', imagePath)
      .then(responseBody),
};

const Auth = {
  login: (email, password) =>
    requests.post('/login', {
      email,
      password,
    }),
  register: (email, password, name, age, description, image) =>
    requests.post('/users', {
      email,
      password,
      name,
      age,
      description,
      image,
    }),
};

const Users = {
  all: () => requests.get('/users'),
  byId: id => requests.get(`/users/${id}`),
  update: id => requests.get(`/users/${id}`),
  getPicture: id => requests.get(`/users/${id}/picture`),
  updatePicture: imagePath => requests.image(`/users/picture`, { imagePath }),
};

const Rooms = {
  messages: id => requests.get(`/rooms/${id}/messages`),
  byTag: tag => requests.get(`/rooms/tag/${tag}`),
  all: () => requests.get(`/rooms`),
  join: id => requests.post(`/rooms/${id}/join`, null),
  members: id => requests.get(`/rooms/${id}/members`),
  create: (name, tags, maxUsers, description) =>
    requests.post(`/rooms`, {
      name,
      tags,
      maxUsers,
      description,
    }),
  delete: id => requests.delete(`/rooms/${id}`),
  kickUser: (id, anonymeId) =>
    requests.post(`/rooms/${id}/kick`, {
      anonymeId,
    }),
  reveal: id => requests.post(`/rooms/${id}/reveal`),
};

export default {
  Auth,
  Users,
  Rooms,
  setToken: (_token) => {
    token = _token;
  },
};
