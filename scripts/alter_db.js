const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Leer variables de entorno desde .env.local y quitar comillas
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        // Ignorar comentarios
        if (line.startsWith('#') || line.trim() === '') return;

        const [key, ...valueArr] = line.split('=');
        if (key && valueArr.length > 0) {
            let value = valueArr.join('=').trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
            process.env[key.trim()] = value;
        }
    });
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function run() {
    try {
        console.log('Alterando tabla...');
        await pool.query(`
            ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_selected_frame_id_fkey;
            ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_selected_lens_type_id_fkey;
            ALTER TABLE appointments ALTER COLUMN selected_frame_id TYPE VARCHAR(255);
            ALTER TABLE appointments ALTER COLUMN selected_lens_type_id TYPE VARCHAR(255);
        `);
        console.log('Tabla alterada con exito');
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

run();
