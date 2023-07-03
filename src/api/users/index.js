const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async(server, { service, validator }) => {
    const usersHandler = new UsersHandler(service, validator);
    // console.log(usersHandler);
    // console.log(routes(usersHandler));
    server.route(routes(usersHandler));
  },
};