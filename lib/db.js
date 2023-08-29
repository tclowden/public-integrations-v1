import mysql from 'mysql2/promise';

const userName = process.env.MYSQL_USER
const passwordName = process.env.MYSQL_PASSWORD
const databaseName = process.env.MYSQL_DATABASE
const hostName = process.env.MYSQL_SOCKETPATH
const hostNameProd = process.env.MYSQL_SOCKETPATHPROD

const dbConfig = {
  //host: '/cloudsql/adams-website-backend:us-west2:luminary-us-west2',
  host: hostNameProd,
  user: userName,
  password: passwordName,
  database: databaseName
};

async function query(sql, values) {
  const connection = await mysql.createConnection(dbConfig);
  const [results] = await connection.execute(sql, values);
  await connection.end();
  return results;
}

export { query };

