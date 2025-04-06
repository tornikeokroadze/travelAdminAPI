import pgPromise from "pg-promise";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Please define the POSTGRE_URI environment variable inside .env<development/production>.local"
  );
}

const pgp = pgPromise();
const db = pgp(DB_URI);

const connectToDatabase = async () => {
  try {
    await db.connect();
  } catch (error) {
    console.error("Error connecting to databse: ", error);
    process.exit(1);
  }
};

export { connectToDatabase, db };
