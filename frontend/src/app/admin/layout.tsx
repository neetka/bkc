"use client";

import { AuthProvider } from "@/lib/auth";
import AdminLayout from "./AdminLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}
