"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Progress } from "@/shadcn/ui/progress";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;
    let trickle: NodeJS.Timeout;

    async function runLoader() {
      setVisible(true);
      setProgress(15);

      // Trickle forward smoothly while waiting
      trickle = setInterval(() => {
        setProgress((p) => {
          if (p < 90) return p + Math.random() * 5; // random step for natural feel
          return p;
        });
      }, 200);

      try {
        // Build target URL
        const url = `${window.location.origin}${pathname}?${searchParams.toString()}`;

        // HEAD request passes through middleware
        const res = await fetch(url, { method: "HEAD" });

        if (res.headers.get("x-middleware-processed")) {
          setProgress(100);
        } else {
          setProgress(95); // fallback if header missing
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
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-100">
      <Progress value={progress} className="h-1 rounded-none" />
    </div>
  );
}
