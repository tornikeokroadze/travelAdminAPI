import { db } from "../database/pgsql.js";

const Type = {
  async findAll() {
    return await db.any('SELECT * FROM "Type"');
  },

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM "Type" WHERE id = $1', [id]);
  },

  async findByEmail(email) {
    return await db.oneOrNone(
      'SELECT * FROM "Type" WHERE email = $1',
      [email]
    );
  },

  async create(name) {
    return await db.one(
      `INSERT INTO "Type" (name) 
      VALUES ($1) RETURNING *`,
      [name]
    );
  },

  async update(id, updateData) {
    const { name } = updateData;
    return await db.one(
      `UPDATE "Type" SET 
      name = COALESCE($1, name)
      WHERE id = $2 RETURNING *`,
      [name, id]
    );
  },

  async delete(id) {
    return await db.result('DELETE FROM "Type" WHERE id = $1', [id]);
  },
};

export default Type;
