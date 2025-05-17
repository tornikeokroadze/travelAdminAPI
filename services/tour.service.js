import { db } from "../database/pgsql.js";

const checkExpiredTours = async () => {
  try {
    const query = `UPDATE "Tour" SET status = 'expire' WHERE "startDate" < NOW() AND status != 'expire'`;

    const result = await db.result(query);

    console.log(`Updated ${result.rowCount} tours to expired status.`);
  } catch (error) {
    console.error("Error updating expired tours:", error);
  }
};

export default checkExpiredTours;
