import { db } from "../database/pgsql.js";

const About = {

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM "About" WHERE id = $1', [id]);
  },


  async update(id, updateData) {
    const { title, description, image } = updateData;
    return await db.one(
      `UPDATE "About" SET 
      title = COALESCE($1, title), 
      description = COALESCE($2, description), 
      image = COALESCE($3, image),
      "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $4 RETURNING *`,
      [title, description, image, id]
    );
  },
};

export default About;
