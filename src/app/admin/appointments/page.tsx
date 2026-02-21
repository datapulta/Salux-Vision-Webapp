import { auth } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import ClientAppointmentsTable from "./ClientAppointmentsTable";

export default async function AdminAppointmentsPage() {
    const session = await auth();

    // Verificación de seguridad extra
    if (!session || session.user?.role !== "admin") {
        redirect("/app");
    }

    const res = await query(`
        SELECT 
            a.id, 
            u.name as patient_name, 
            a.appointment_date, 
            a.appointment_time, 
            a.status, 
            a.selected_frame_id, 
            a.patient_notes
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        ORDER BY a.appointment_date ASC, a.appointment_time ASC
    `);

    // Dar formato a los valores devueltos
    const realAppointments = res.rows.map((row: any) => ({
        id: row.id,
        patientName: row.patient_name || 'Desconocido',
        date: new Date(row.appointment_date).toISOString().split('T')[0],
        time: row.appointment_time.slice(0, 5), // 'HH:MM:SS' -> 'HH:MM'
        status: row.status,
        frame: row.selected_frame_id === 'no-frame' ? 'Ninguno (Solo consulta)' : ('Armazón ' + row.selected_frame_id),
        lensType: row.selected_frame_id === 'no-frame' ? 'Ninguno' : 'Pendiente o Desconocido',
        notes: row.patient_notes || ''
    }));

    return (
        <ClientAppointmentsTable initialData={realAppointments} />
    );
}
