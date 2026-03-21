"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import "./admin.css";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "fas fa-tachometer-alt" },
  { href: "/admin/services", label: "Services", icon: "fas fa-concierge-bell" },
  { href: "/admin/updates", label: "Updates", icon: "fas fa-bullhorn" },
  { href: "/admin/gallery", label: "Gallery", icon: "fas fa-images" },
  { href: "/admin/submissions", label: "Submissions", icon: "fas fa-inbox" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, status, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, pathname, router]);

  // Login page — no sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading
  if (status === "loading") {
    return (
      <div className="admin-login-page">
        <div className="admin-spinner" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <h2>CSC Baghpur</h2>
          <span>Admin Panel</span>
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`admin-nav-link${pathname === item.href ? " admin-nav-link--active" : ""}`}
            >
              <i className={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <button onClick={() => { signOut(); router.push("/admin/login"); }} className="admin-logout-btn">
            <i className="fas fa-sign-out-alt" />
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
