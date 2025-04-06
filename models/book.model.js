import { db } from "../database/pgsql.js";

const Book = {
  async findAll() {
    return await db.any('SELECT * FROM "Book"');
  },

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM "Book" WHERE id = $1', [id]);
  },

  async update(id, updateData) {
    const { tourId, name, surname, email, phone, peopleNum, paymentStatus } =
      updateData;
    return await db.one(
      `UPDATE "Book" SET 
      "tourId" = COALESCE($1, "tourId"), 
      name = COALESCE($2, name), 
      surname = COALESCE($3, surname), 
      email = COALESCE($4, email),
      phone = COALESCE($5, phone), 
      "peopleNum" = COALESCE($6, "peopleNum"), 
      "paymentStatus" = COALESCE($7, "paymentStatus"),
      "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $8 RETURNING *`,
      [tourId, name, surname, email, phone, peopleNum, paymentStatus, id]
    );
  },
};

export default Book;
