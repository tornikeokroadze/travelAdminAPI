import { db } from "../database/pgsql.js";



const Contact = {

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM "Contact" WHERE id = $1', [id]);
  },

  async update(id, updateData) {
    const { phone, location, email, facebook, instagram, youtube, whatsapp } = updateData;
    return await db.one(
      `UPDATE "Contact" SET 
      phone = COALESCE($1, phone), 
      location = COALESCE($2, location), 
      email = COALESCE($3, email),
      facebook = COALESCE($4, facebook), 
      instagram = COALESCE($5, instagram), 
      youtube = COALESCE($6, youtube),
      whatsapp = COALESCE($7, whatsapp),
      "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $8 RETURNING *`,
      [phone, location, email, facebook, instagram, youtube, whatsapp, id]
    );
  },
};

export default Contact;
