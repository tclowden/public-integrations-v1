import pgPromise from 'pg-promise';

const pgp = pgPromise();

const userName = process.env.POSTGRES2_USER;
const password = process.env.POSTGRES2_PASSWORD;
const database = process.env.POSTGRES2_DATABASE;
const host = process.env.POSTGRES2_HOST;

const dbConfig = {
  host: host,
  port: 5432,               // Default PostgreSQL port. Adjust if necessary.
  database: database,
  user: userName,
  password: password,
  ssl: {
    rejectUnauthorized: false
  }
};

const db = pgp(dbConfig);

async function query(sql, values) {
  return await db.any(sql, values);
}

export { query };