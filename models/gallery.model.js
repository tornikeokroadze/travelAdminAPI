import { db } from "../database/pgsql.js";

const Gallery = {
  async findAll() {
    return await db.any('SELECT * FROM "Gallery"');
  },

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM "Gallery" WHERE id = $1', [id]);
  },

  async create({ tourId, image }) {
    const now = new Date().toISOString();

    return await db.one(
      `INSERT INTO "Gallery" ("tourId", image, "updatedAt") 
      VALUES ($1, $2, $3) RETURNING *`,
      [tourId, image, now]
    );
  },

  async update(id, updateData) {
    const { tourId, image } = updateData;
    return await db.one(
      `UPDATE "Gallery" SET 
      "tourId" = COALESCE($1, "tourId"), 
      image = COALESCE($2, image),
      "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $3 RETURNING *`,
      [tourId, image, id]
    );
  },

  async delete(id) {
    return await db.result('DELETE FROM "Gallery" WHERE id = $1', [id]);
  },
};

export default Gallery;
