"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    // Redirect for now, wala pang login
    router.push("/system/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
