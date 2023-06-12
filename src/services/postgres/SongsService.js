const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const mapDBToModel = require('../../utils/songs');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration = null, albumId = null }) {
    const id = nanoid(15);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    let queryString = '$1, $2, $3, $4';
    let queryValue = [id, title, year, genre, performer];
    let queryColumn = '';
    
    if (duration !== null) {
      queryString += ', $5';
      queryValue.push(duration);
    }
    if (albumId !== null) {
      queryString += ', $6';
      queryValue.push(albumId);
    }

    queryValue.push(createdAt);
    queryValue.push(updatedAt);
    const query = {
      text: 'INSERT INTO songs('+queryColumn+') VALUES('+queryString+') RETURNING id',
      values: queryValue,
    }

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditanmbahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows.map(mapDBToModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editSongById(id, { title, year, genre, performer, duration = null, albumId = null }) {
    const updatedAt = new Date().toISOString();
    let queryString = 'name = $1, year = $2, genre = $3, performer = $4';
    let queryValue = [id, title, year, genre, performer];
    
    if (duration !== null) {
      queryString += ', duration = $5';
      queryValue.push(duration);
    }
    if (albumId !== null) {
      queryString += ', albumId = $6';
      queryValue.push(albumId);
    }

    const query = {
      text: 'UPDATE songs SET '+queryString+', updated_at = $3 WHERE id = $4 RETURNING id',
      values: [title, body, tags, updatedAt, id]
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Song. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;