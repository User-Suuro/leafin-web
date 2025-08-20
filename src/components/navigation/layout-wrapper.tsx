"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname.startsWith("/system");

  return (
    <div className="flex min-h-screen">
      {showSidebar && (
        <aside className="w-16 bg-gray-100 flex flex-col">
          <Sidebar />
        </aside>
      )}

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
