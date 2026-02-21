'use server';
import { query } from "@/lib/db";
import { auth } from "@/lib/auth/authOptions";

export async function updateAppointment(id: string, data: { date: string, time: string, status: string, notes: string }) {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
        throw new Error('No autorizado');
    }

    await query(`
        UPDATE appointments 
        SET appointment_date = $1, appointment_time = $2, status = $3, patient_notes = $4, updated_at = NOW()
        WHERE id = $5
    `, [data.date, data.time, data.status, data.notes, id]);

    return { success: true };
}
