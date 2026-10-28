import fs from 'node:fs';
import path from 'node:path';

// Minimal .env loader so setup does not require an additional runtime package.
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const splitAt = line.indexOf('=');
    if (splitAt < 1) continue;
    const key = line.slice(0, splitAt).trim();
    let value = line.slice(splitAt + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}

export const config = Object.freeze({
  port: Number(process.env.PORT || 4173),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  adminName: process.env.ADMIN_NAME || 'Business Owner',
  adminEmail: (process.env.ADMIN_EMAIL || 'owner@example.com').trim().toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || '',
  businessName: process.env.BUSINESS_NAME || 'Northstar Growth Studio',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  sessionTtlHours: Math.max(1, Math.min(72, Number(process.env.SESSION_TTL_HOURS || 8))),
});
