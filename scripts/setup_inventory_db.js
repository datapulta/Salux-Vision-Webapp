const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Leer variables de entorno desde .env.local y quitar comillas
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        // Ignorar comentarios
        if(line.startsWith('#') || line.trim() === '') return;
        
        const [key, ...valueArr] = line.split('=');
        if (key && valueArr.length > 0) {
            let value = valueArr.join('=').trim();
            // Quitar las comillas dobles al inicio y fin si existen
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
            }
            process.env[key.trim()] = value;
        }
    });
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    try {
        console.log('⏳ Conectando a Dokploy Postgres...');
        
        const sqlPath = path.resolve(__dirname, '../src/lib/db/schemas/inventory_appointments.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('⏳ Ejecutando creacion de tablas...');
        await pool.query(sql);
        
        console.log('✅ Tablas Híbridas de Inventario (frames, lens_types) y Citas en Dokploy creadas exitosamente!');
    } catch (error) {
        console.error('❌ Error fatal:', error);
    } finally {
        await pool.end();
    }
}

runMigration();
