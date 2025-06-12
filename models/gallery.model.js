import { db } from "../database/pgsql.js";

const Gallery = {
  async findAll() {
    return await db.any('SELECT * FROM "Gallery"');
  },

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM "Gallery" WHERE id = $1', [id]);
  },

  async findByTourId(tourId) {
    return await db.any('SELECT * FROM "Gallery" WHERE "tourId" = $1', [
      tourId,
    ]);
  },

  async findManyByTourIds(ids) {
    return db.any(`SELECT * FROM "Gallery" WHERE "tourId" IN ($1:csv)`, [ids]);
  },

  async create({ tourId, image }) {
    const now = new Date().toISOString();

    return await db.one(
      `INSERT INTO "Gallery" ("tourId", image, "updatedAt") 
      VALUES ($1, $2, $3) RETURNING *`,
      [tourId, image, now]
    );
  },

  async insertMany(galleryImages) {
    if (!Array.isArray(galleryImages) || galleryImages.length === 0) {
      throw new Error("galleryImages must be a non-empty array");
    }

    const now = new Date().toISOString();

    const query = `
      INSERT INTO "Gallery" ("tourId", image, "updatedAt")
      VALUES 
        ${galleryImages
          .map(
            (_, index) =>
              `($1, $${index + 2}, $${index + 2 + galleryImages.length})`
          )
          .join(", ")}
    `;

    const values = [
      galleryImages[0].tourId,
      ...galleryImages.map((img) => img.image),
      ...Array(galleryImages.length).fill(now),
    ];

    await db.none(query, values);
    return true;
  },

  async delete(id) {
    return await db.result('DELETE FROM "Gallery" WHERE id = $1', [id]);
  },

  async deleteByTourId(tourId) {
    return await db.none('DELETE FROM "Gallery" WHERE "tourId" = $1', [tourId]);
  },

  async deleteByFilename(fileName) {
    return await db.none('DELETE FROM "Gallery" WHERE image = $1', [fileName]);
  },
};

export default Gallery;
