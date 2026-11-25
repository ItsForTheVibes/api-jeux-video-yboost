import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const dbPath = process.env.DATABASE_PATH ?? path.join(projectRoot, 'src/database/game.db');
export const db = new Database(dbPath);