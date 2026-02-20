import { Pool } from 'pg';

// Variables para la conexión la base de datos PostgreSQL local
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Configuraciones adicionales si son necesarias para Dokploy o local
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};
