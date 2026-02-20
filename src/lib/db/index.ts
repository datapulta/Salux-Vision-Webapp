import { Pool } from 'pg';

// Variables para la conexión la base de datos PostgreSQL local
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};
