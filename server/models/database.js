import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const DB = new pg.Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

export default DB;