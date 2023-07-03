const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this.validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const noteId = await this.service.addUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    response.code(201);
    return response;
  }

  async getUsersHandler(request, h) {
    const notes = await this.service.getUsers();
    return h.response({
      status: 'success',
      data: {
        notes,
      },
    });
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;
    const note = await this.service.getUserById(id);
    return h.response({
      status: 'success',
      data: {
        note,
      },
    });
  }

  async putUserByIdhandler(request, h) {
    this.validator.validateUserPayload(request.payload);
    const { id } = request.params;

    await this.service.editUserById(id, request.payload);

    return h.response({
      status: 'success',
      message: 'User berhasil diperbarui',
    });
  }

  async deleteUserByIdHandler(request, h) {
    const { id } = request.params;
    await this.service.deleteUserById(id);
    return h.response({
      status: 'success',
      message: 'User berhasil dihapus',
    });
  }
}

module.exports = UsersHandler;
