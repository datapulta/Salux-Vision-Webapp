import { auth } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";
import ClientInventory, { FrameData } from "./ClientInventory";

export default async function AdminInventoryPage() {
    const session = await auth();

    // Verificación de seguridad extra
    if (!session || session.user?.role !== "admin") {
        redirect("/app");
    }

    const res = await query(`
        SELECT 
            id, 
            name, 
            brand, 
            price, 
            stock, 
            category,
            wholesale_price,
            min_stock,
            sku,
            description,
            discount,
            requires_stock,
            sat_product_key,
            sat_unit_key,
            image_url 
        FROM frames
        ORDER BY created_at DESC
    `);

    // Parse numeric prices correctly since node-postgres returns numerics as strings
    const frames: FrameData[] = res.rows.map((row: any) => ({
        ...row,
        price: parseFloat(row.price || 0),
        wholesale_price: parseFloat(row.wholesale_price || 0),
        discount: parseFloat(row.discount || 0),
        stock: parseInt(row.stock || 0, 10),
        min_stock: parseInt(row.min_stock || 0, 10),
        requires_stock: row.requires_stock === null ? true : row.requires_stock,
    }));

    return (
        <ClientInventory initialFrames={frames} />
    );
}
