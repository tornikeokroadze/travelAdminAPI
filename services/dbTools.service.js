import { exec } from "child_process";
import { join, dirname } from "path";
import { unlinkSync } from "fs";
import { fileURLToPath } from "url";
import pkg from 'pg-connection-string';
import path from 'path';

import { DB_URI } from "../config/env.js";

const { parse } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = parse(DB_URI);

export const backup = () => {
  return new Promise((resolve, reject) => {
    const fileName = `backup-${Date.now()}.sql`;
    const backupPath = join(__dirname, "..", "backups", fileName);

    const cmd = `PGPASSWORD="${config.password}" pg_dump -U ${config.user} -h ${config.host} -p ${config.port} -F p -f "${backupPath}" ${config.database}`;

    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve(backupPath);
    });
  });
};

export const restore = (sqlFilePath) => {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(sqlFilePath);
    
    if (fileExtension !== '.sql') {
      return reject(new Error('Only .sql files are allowed'));
    }

    const cmd = `PGPASSWORD="${config.password}" psql -U ${config.user} -h ${config.host} -p ${config.port} -d ${config.database} -f "${sqlFilePath}"`;

    exec(cmd, (err) => {
      unlinkSync(sqlFilePath); // cleanup uploaded file
      if (err) return reject(err);
      resolve();
    });
  });
};
