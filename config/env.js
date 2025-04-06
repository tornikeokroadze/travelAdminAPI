import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, NODE_ENV, BASE_URL, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, SENDING_EMAIL_ADDRESS, SENDING_EMAIL_PASSWORD } =
  process.env;
