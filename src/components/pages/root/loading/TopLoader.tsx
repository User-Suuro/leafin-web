"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/shadcn/ui/progress";

export default function TopLoader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;
    let trickle: NodeJS.Timeout;

    async function runLoader() {
      setVisible(true);
      setProgress(15);

      // Trickle forward smoothly
      trickle = setInterval(() => {
        setProgress((p) => (p < 90 ? p + Math.random() * 5 : p));
      }, 200);

      try {
        const url = `${window.location.origin}${pathname}`;
        const res = await fetch(url, { method: "HEAD" });

        if (res.headers.get("x-middleware-processed")) {
          setProgress(100);
        } else {
          setProgress(95);
        }
      } catch {
        setProgress(95);
      } finally {
        clearInterval(trickle);
        if (!active) return;

        setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 300);
      }
    }

    runLoader();

    return () => {
      active = false;
      clearInterval(trickle);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-100 transition-opacity duration-500">
      <Progress value={progress} className="h-1 rounded-none" />
    </div>
  );
}
