"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSystem = pathname.startsWith("/system");

  if (!isSystem) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <aside className="fixed top-[64px] h-[calc(100vh-64px)] overflow-hidden">
        <Sidebar />
      </aside>
      <main className="ml-16 w-[calc(100vw-16px)]">{children}</main>
    </div>
  );
}
