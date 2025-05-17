import { db } from "../database/pgsql.js";

const Event = {
  async findAll() {
    return await db.any("SELECT * FROM events");
  },

  async findById(id) {
    return await db.oneOrNone("SELECT * FROM events WHERE id = $1", [id]);
  },

  async create({ title, start_date, end_date, event_level }) {
    const endDateSafe = end_date === '' ? null : end_date;
    return await db.one(
      `INSERT INTO events (title, start_date, end_date, event_level) 
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, start_date, endDateSafe, event_level]
    );
  },

  async update(id, updateData) {
    const { title, start_date, end_date, event_level } = updateData;
    const endDateSafe = end_date === '' ? null : end_date;
    return await db.one(
      `UPDATE events SET 
      title = COALESCE($1, title), 
      start_date = COALESCE($2, start_date), 
      end_date = COALESCE($3, end_date), 
      event_level = COALESCE($4, event_level)
      WHERE id = $5 RETURNING *`,
      [title, start_date, endDateSafe, event_level, id]
    );
  },

  async delete(id) {
    return await db.result("DELETE FROM events WHERE id = $1", [id]);
  },
};

export default Event;
