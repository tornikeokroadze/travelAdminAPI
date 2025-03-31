import { db } from "../database/pgsql.js";

const Admin = {
  async findAll() {
    // return await db.any("SELECT * FROM admin");
    return await db.any(
      "SELECT id, name, email, job_title, created_at, updated_at FROM admin"
    );
  },

  async findById(id) {
    // return await db.oneOrNone("SELECT * FROM admin WHERE id = $1", [id]);
    return await db.oneOrNone(
      "SELECT id, name, email, job_title, created_at, updated_at FROM admin WHERE id = $1",
      [id]
    );
  },

  async findByEmail(email) {
    return await db.oneOrNone(
      "SELECT * FROM admin WHERE email = $1",
      [email]
    );
  },

  async create({ name, email, password, job_title }) {
    return await db.one(
      `INSERT INTO admin (name, email, password, job_title) 
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, password, job_title]
    );
  },

  async update(id, updateData) {
    const { name, email, password, job_title } = updateData;
    return await db.one(
      `UPDATE admin SET 
      name = COALESCE($1, name), 
      email = COALESCE($2, email), 
      password = COALESCE($3, password), 
      job_title = COALESCE($4, job_title),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 RETURNING *`,
      [name, email, password, job_title, id]
    );
  },

  async delete(id) {
    return await db.result("DELETE FROM admin WHERE id = $1", [id]);
  },
};

export default Admin;
