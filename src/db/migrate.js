import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPool, closePool } from './pool.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.resolve(here, '../../migrations/001_init.sql');
try {
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await getPool().query(sql);
  console.log('✓ PostgreSQL schema migrated (001_init.sql).');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
} finally { await closePool(); }
