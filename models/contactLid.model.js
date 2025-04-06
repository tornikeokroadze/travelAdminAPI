import { db } from "../database/pgsql.js";

const ContactLid = {
  async findAll() {
    return await db.any('SELECT * FROM "ContactLid"');
  },

  async findById(id) {
    return await db.oneOrNone('SELECT * FROM "ContactLid" WHERE id = $1', [id]);
  },

  async delete(id) {
    return await db.result('DELETE FROM "ContactLid" WHERE id = $1', [id]);
  },
};

export default ContactLid;
