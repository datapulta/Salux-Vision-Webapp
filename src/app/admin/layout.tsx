import { auth } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
        redirect("/app");
    }

    return (
        <DashboardLayout userRole={session.user.role} userName={session.user.name || "Administrador"}>
            {children}
        </DashboardLayout>
    );
}
