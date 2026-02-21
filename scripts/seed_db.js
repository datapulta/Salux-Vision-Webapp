const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
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

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function run() {
    try {
        console.log('Alterando y luego insertando...');
        await pool.query(`
            ALTER TABLE frames ADD COLUMN IF NOT EXISTS description TEXT;
            ALTER TABLE frames ALTER COLUMN id TYPE VARCHAR(255);
        `);
        await pool.query(`
            INSERT INTO frames (id, name, brand, price, stock, image_url, description)
            VALUES 
            ('f1', 'Wayfarer Classic', 'Génesis', 350.00, 10, 'https://images.unsplash.com/photo-1549643276-fbc2d8ce01df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'Estilo atemporal, perfecto para rostros ovalados o redondos.'),
            ('f2', 'Elegance Gold', 'Luminex', 480.00, 5, 'https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'Armazón de titanio ultra ligero con toques dorados.'),
            ('f3', 'Sport Flex', 'AeroVision', 250.00, 15, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'Diseño curvado y resistente, ideal para deportistas.')
            ON CONFLICT (id) DO NOTHING;
        `);
        console.log('Finalizado ok');
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

run();
