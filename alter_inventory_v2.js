const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, './.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        if (line.startsWith('#') || line.trim() === '') return;
        const [key, ...valueArr] = line.split('=');
        if (key && valueArr.length > 0) {
            let value = valueArr.join('=').trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
            process.env[key.trim()] = value;
        }
    });
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
    try {
        console.log('Agregando nuevas columnas a frames...');
        await pool.query(`
            ALTER TABLE frames 
            ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
            ADD COLUMN IF NOT EXISTS description TEXT,
            ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0,
            ADD COLUMN IF NOT EXISTS requires_stock BOOLEAN DEFAULT true,
            ADD COLUMN IF NOT EXISTS sat_product_key VARCHAR(100),
            ADD COLUMN IF NOT EXISTS sat_unit_key VARCHAR(100);
        `);
        console.log('Update de DB listo.');
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
run();
