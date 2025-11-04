import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const RAIZ = process.env.RAIZ || `http://localhost:${PORT}`;

export default {
  development: {
    username: "root",
    password: "root",
    database: "sharumi",
    host: "127.0.0.1",
    port: 3306,
    dialect: "mysql",
  },
  /* test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_test',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_prod',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
  },*/
}; 
