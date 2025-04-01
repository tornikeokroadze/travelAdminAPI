import { db } from "../database/pgsql.js";

const Admin = {
  async findAll() {
    // return await db.any("SELECT * FROM admin");
    return await db.any(
      "SELECT id, name, email, job_title, role, block, created_at, updated_at FROM admin"
    );
  },

  async findById(id) {
    // return await db.oneOrNone("SELECT * FROM admin WHERE id = $1", [id]);
    return await db.oneOrNone(
      "SELECT id, name, email, job_title, role, block, created_at, updated_at FROM admin WHERE id = $1",
      [id]
    );
  },

  async findByEmail(email) {
    return await db.oneOrNone(
      "SELECT * FROM admin WHERE email = $1",
      [email]
    );
  },

  async create({ name, email, password, job_title, role }) {
    return await db.one(
      `INSERT INTO admin (name, email, password, job_title, role) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, password, job_title, role]
    );
  },

  async update(id, updateData) {
    const { name, email, password, job_title, role, block } = updateData;
    return await db.one(
      `UPDATE admin SET 
      name = COALESCE($1, name), 
      email = COALESCE($2, email), 
      password = COALESCE($3, password), 
      job_title = COALESCE($4, job_title),
      role = COALESCE($5, role),
      block = COALESCE($6, block),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 RETURNING *`,
      [name, email, password, job_title, role, block, id]
    );
  },

  async delete(id) {
    return await db.result("DELETE FROM admin WHERE id = $1", [id]);
  },
};

export default Admin;
