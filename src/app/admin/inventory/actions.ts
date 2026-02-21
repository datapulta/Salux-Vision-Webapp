'use server';
import { query } from "@/lib/db";
import { auth } from "@/lib/auth/authOptions";

export async function createFrame(data: { name: string, brand: string, price: number, stock: number, image_url: string, category: string, wholesale_price?: number, min_stock?: number, sku?: string, description?: string, discount?: number, requires_stock?: boolean, sat_product_key?: string, sat_unit_key?: string }) {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
        throw new Error('No autorizado');
    }

    const res = await query(`
        INSERT INTO frames (id, name, brand, price, stock, image_url, category, wholesale_price, min_stock, sku, description, discount, requires_stock, sat_product_key, sat_unit_key)
        VALUES (substr(md5(random()::text), 0, 10), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
    `, [data.name, data.brand, data.price, data.stock, data.image_url, data.category || 'armazon', data.wholesale_price || 0, data.min_stock || 3, data.sku || '', data.description || '', data.discount || 0, data.requires_stock !== undefined ? data.requires_stock : true, data.sat_product_key || '', data.sat_unit_key || '']);

    return { success: true, id: res.rows[0].id };
}

export async function updateFrame(id: string, data: { name: string, brand: string, price: number, stock: number, image_url: string, category: string, wholesale_price?: number, min_stock?: number, sku?: string, description?: string, discount?: number, requires_stock?: boolean, sat_product_key?: string, sat_unit_key?: string }) {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
        throw new Error('No autorizado');
    }

    await query(`
        UPDATE frames 
        SET name = $1, brand = $2, price = $3, stock = $4, image_url = $5, category = $6, wholesale_price = $7, min_stock = $8, sku = $9, description = $10, discount = $11, requires_stock = $12, sat_product_key = $13, sat_unit_key = $14, updated_at = NOW()
        WHERE id = $15
    `, [data.name, data.brand, data.price, data.stock, data.image_url, data.category || 'armazon', data.wholesale_price || 0, data.min_stock || 3, data.sku || '', data.description || '', data.discount || 0, data.requires_stock !== undefined ? data.requires_stock : true, data.sat_product_key || '', data.sat_unit_key || '', id]);

    return { success: true };
}

export async function deleteFrame(id: string) {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
        throw new Error('No autorizado');
    }

    await query(`
        DELETE FROM frames WHERE id = $1
    `, [id]);

    return { success: true };
}
