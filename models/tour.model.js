import { db } from "../database/pgsql.js";

const Tour = {
  async findAll() {
    return await db.any('SELECT * FROM "Tour"');
  },

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM "Tour" WHERE id = $1', [id]);
  },

  async create({
    title,
    description,
    location,
    price,
    duration,
    startDate,
    endDate,
    image,
    typeId,
    bestOffer,
    adventures,
    experience,
  }) {
    const now = new Date().toISOString();

    return await db.one(
      `INSERT INTO "Tour" (title, description, location, price, duration, "startDate", "endDate", image, "typeId", "bestOffer", adventures, experience, "updatedAt") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        title,
        description,
        location,
        price,
        duration,
        startDate,
        endDate,
        image,
        typeId,
        bestOffer,
        adventures,
        experience,
        now,
      ]
    );
  },

  async update(id, updateData) {
    const {
      title,
      description,
      location,
      price,
      duration,
      startDate,
      endDate,
      image,
      typeId,
      bestOffer,
      adventures,
      experience,
    } = updateData;
    return await db.one(
      `UPDATE "Tour" SET 
      title = COALESCE($1, title), 
      description = COALESCE($2, description), 
      location = COALESCE($3, location), 
      price = COALESCE($4, price),
      duration = COALESCE($5, duration), 
      "startDate" = COALESCE($6, "startDate"), 
      "endDate" = COALESCE($7, "endDate"), 
      image = COALESCE($8, image),
      "typeId" = COALESCE($9, "typeId"), 
      "bestOffer" = COALESCE($10, "bestOffer"),
      adventures = COALESCE($11, adventures), 
      experience = COALESCE($12, experience),
      "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $13 RETURNING *`,
      [
        title,
        description,
        location,
        price,
        duration,
        startDate,
        endDate,
        image,
        typeId,
        bestOffer,
        adventures,
        experience,
        id,
      ]
    );
  },

  async delete(id) {
    return await db.result('DELETE FROM "Tour" WHERE id = $1', [id]);
  },

  async search(filters) {
    const { location, type, start_date, end_date, query } = filters;

    let sql = `SELECT * FROM "Tour" WHERE 1=1`;
    const params = [];

    if (location) {
      params.push(`%${location}%`);
      sql += ` AND location ILIKE $${params.length}`;
    }

    if (type) {
      params.push(type);
      sql += ` AND "typeId" = $${params.length}`;
    }

    if (start_date) {
      params.push(start_date);
      sql += ` AND "startDate" >= $${params.length}`;
    }

    if (end_date) {
      params.push(end_date);
      sql += ` AND "endDate" <= $${params.length}`;
    }

    if (query) {
      params.push(`%${query}%`);
      sql += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    return await db.any(sql, params);
  },
};

export default Tour;
