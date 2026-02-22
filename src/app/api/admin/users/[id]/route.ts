import { auth } from "@/lib/auth/authOptions";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();

        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }

        const { id } = await context.params;
        const body = await request.json();
        const { phone, is_active } = body;

        const updateResult = await query(
            `UPDATE users 
             SET phone = $1, is_active = $2 
             WHERE id = $3 AND role = 'user' RETURNING *`,
            [phone || null, is_active, id]
        );

        if (updateResult.rows.length === 0) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        return NextResponse.json(updateResult.rows[0]);
    } catch (error) {
        console.error("Error actualizando usuario:", error);
        return NextResponse.json({ error: "Error de Servidor" }, { status: 500 });
    }
}
