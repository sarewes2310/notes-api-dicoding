const autoBind = require('auto-bind');

class NotesHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    autoBind(this);
  }

  async postNoteHandler(request, h) {
    this.validator.validateNotePayload(request.payload);
    const { title = 'untitled', body, tags } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const noteId = await this.service.addNote({
      title,
      body,
      tags,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    response.code(201);
    return response;
  }

  async getNotesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const notes = await this.service.getNotes(credentialId);
    return h.response({
      status: 'success',
      data: {
        notes,
      },
    });
  }

  async getNoteByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyNoteOwner(id, credentialId);
    const note = await this.service.getNoteById(id);

    return h.response({
      status: 'success',
      data: {
        note,
      },
    });
  }

  async putNoteByIdhandler(request, h) {
    this.validator.validateNotePayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyNoteOwner(id, credentialId);
    await this.service.editNoteById(id, request.payload);

    return h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
  }

  async deleteNoteByIdHandler(request, h) {
    const { id } = request.params;
    console.log(request.auth.credentials);
    const { id: credentialId } = request.auth.credentials;


    await this.service.verifyNoteOwner(id, credentialId);
    await this.service.deleteNoteById(id);
    return h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
  }
}

module.exports = NotesHandler;
