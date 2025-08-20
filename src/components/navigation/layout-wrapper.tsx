"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname.startsWith("/system");

  return (
    <div className="grid grid-cols-[64px_1fr] h-[calc(100vh-64px)]">
      {showSidebar && (
        <aside className="sticky top-0 h-[calc(100vh-64px)] border-r border-border">
          <Sidebar />
        </aside>
      )}

      <main className="overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
