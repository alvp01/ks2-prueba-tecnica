import dotenv from 'dotenv';
import pg from 'pg';

const { Client } = pg;

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_ADMIN_NAME = 'postgres'
} = process.env;

if (!DB_USER || !DB_NAME) {
  console.error('Missing required database environment variables: DB_USER and DB_NAME.');
  process.exit(1);
}

if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(DB_NAME)) {
  console.error(`Invalid database name: ${DB_NAME}`);
  process.exit(1);
}

const client = new Client({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_ADMIN_NAME
});

try {
  await client.connect();

  const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);

  if (result.rowCount > 0) {
    console.log(`Database "${DB_NAME}" already exists.`);
    process.exit(0);
  }

  await client.query(`CREATE DATABASE "${DB_NAME}"`);
  console.log(`Database "${DB_NAME}" created successfully.`);
} catch (error) {
  console.error(`Failed to ensure database: ${error.message}`);
  process.exit(1);
} finally {
  await client.end().catch(() => { });
}
