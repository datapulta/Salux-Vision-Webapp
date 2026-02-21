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
        console.log('Agregando min_stock a frames...');
        await pool.query(`
            ALTER TABLE frames ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 3;
        `);
        console.log('Update de DB listo.');
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
run();
