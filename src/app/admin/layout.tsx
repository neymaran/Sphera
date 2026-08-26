import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebarClient } from "@/components/AdminSidebar";

async function handleSignOut() {
  "use server";
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AdminSidebarClient onSignOut={handleSignOut}>
      {children}
    </AdminSidebarClient>
  );
}
