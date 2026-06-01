"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession, SessionProvider } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/Mainl7/dashboard", icon: "📊", label: "لوحة التحكم" },
  { href: "/Mainl7/cards", icon: "🎴", label: "إدارة البطاقات" },
  { href: "/Mainl7/occasions", icon: "🌙", label: "المناسبات" },
  { href: "/", icon: "🌐", label: "عرض الموقع", external: true },
];

function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`admin-sidebar ${isOpen ? "open" : ""} flex flex-col z-50`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-yellow-400/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{background:'linear-gradient(135deg, #0F6B3F, #1a8f55)'}}>
              <span className="text-white font-black">ت</span>
            </div>
            <div>
              <div className="text-white font-bold text-sm">لوحة التحكم</div>
              <div className="text-yellow-400/60 text-xs">جمعية تآزر</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "text-white shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                style={isActive ? {background:'linear-gradient(135deg, #0F6B3F, #1a8f55)'} : {}}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {item.external && (
                  <span className="mr-auto text-xs opacity-50">↗</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-yellow-400/10">
          {session?.user && (
            <div className="flex items-center gap-3 mb-4">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ""}
                  width={36}
                  height={36}
                  className="rounded-full border border-yellow-400/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                     style={{background:'#0F6B3F'}}>
                  {session.user.name?.[0] || "م"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{session.user.name}</div>
                <div className="text-yellow-400/60 text-xs truncate">{session.user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-red-500/20 transition-all border border-red-500/20"
          >
            <span>🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div dir="rtl">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile header */}
      <div className="fixed top-0 right-0 left-0 z-30 lg:hidden bg-white shadow-sm"
           style={{right: 0}}>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">☰</span>
          </button>
          <span className="font-bold text-gray-800">لوحة التحكم</span>
          <div className="w-9" />
        </div>
      </div>

      {/* Main content */}
      <div className="admin-content pt-14 lg:pt-0">
        {children}
      </div>
      </div>
    </SessionProvider>
  );
}
