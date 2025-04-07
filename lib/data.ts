import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export default sql;

import { Pool } from "pg";

let pool = createOriginalPool();

export const getPool = () => pool;

export const setPool = (newPool: Pool) => {
    pool = newPool;
};

function createOriginalPool() {
    return new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:{rejectUnauthorized: false},
    });
}