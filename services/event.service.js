import { db } from "../database/pgsql.js";

const checkExpiredEvents = async () => {
  try {
    const query = `DELETE FROM events WHERE end_date < NOW()`;

    const result = await db.result(query);

    console.log(`Updated ${result.rowCount} events to expired status.`);
  } catch (error) {
    console.error("Error updating expired events:", error);
  }
};

export default checkExpiredEvents;
