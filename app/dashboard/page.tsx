// THIS IS A SERVER COMPONENT — MAKES REDIRECT BEFORE LAYOUT LOAD
import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function DashboardRoot() {
  redirect("/dashboard/inicio");
}
