import { db } from "../database/pgsql.js";

const Faq = {
  async findAll() {
    return await db.any('SELECT * FROM "Faq"');
  },

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM "Faq" WHERE id = $1', [id]);
  },

  async create({ title, description }) {
    const now = new Date().toISOString();

    return await db.one(
      `INSERT INTO "Faq" (title, description, "updatedAt") 
      VALUES ($1, $2, $3) RETURNING *`,
      [title, description, now]
    );
  },

  async update(id, updateData) {
    const { title, description } = updateData;
    return await db.one(
      `UPDATE "Faq" SET 
      title = COALESCE($1, title), 
      description = COALESCE($2, description),
      "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *`,
      [title, description, id]
    );
  },

  async delete(id) {
    return await db.result('DELETE FROM "Faq" WHERE id = $1', [id]);
  },
};

export default Faq;
