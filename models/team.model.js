import { db } from "../database/pgsql.js";

const Team = {
  async findAll() {
    return await db.any('SELECT * FROM "Team"');
  },

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM "Team" WHERE id = $1', [id]);
  },

  async create({
    name,
    surname,
    position,
    image,
    facebook,
    instagram,
    twitter,
  }) {
    const now = new Date().toISOString();

    return await db.one(
      `INSERT INTO "Team" (name, surname, position, image, facebook, instagram, twitter, "updatedAt") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, surname, position, image, facebook, instagram, twitter, now]
    );
  },

  async update(id, updateData) {
    const { name, surname, position, image, facebook, instagram, twitter } =
      updateData;
    return await db.one(
      `UPDATE "Team" SET 
      name = COALESCE($1, name), 
      surname = COALESCE($2, surname), 
      position = COALESCE($3, position), 
      image = COALESCE($4, image),
      facebook = COALESCE($5, facebook), 
      instagram = COALESCE($6, instagram),
      twitter = COALESCE($7, twitter), 
      "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $8 RETURNING *`,
      [name, surname, position, image, facebook, instagram, twitter, id]
    );
  },

  async delete(id) {
    return await db.result('DELETE FROM "Team" WHERE id = $1', [id]);
  },
};

export default Team;
