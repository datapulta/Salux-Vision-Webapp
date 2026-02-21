import { auth } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import ClientSettings from "./ClientSettings";

export default async function AdminSettingsPage() {
    const session = await auth();

    if (!session || session.user?.role !== "admin") {
        redirect("/app");
    }

    return (
        <ClientSettings />
    );
}
