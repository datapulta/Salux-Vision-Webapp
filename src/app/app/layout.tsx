import { auth } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <DashboardLayout userRole={session.user.role} userName={session.user.name || "Usuario"}>
            {children}
        </DashboardLayout>
    );
}
