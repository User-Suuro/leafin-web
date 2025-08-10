// File: src/app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { Home, LayoutDashboard, Info, FileText, Mail } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-gray-100 border-b border-gray-300 px-8 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-black">🌿 Leafin Things</div>
      <ul className="flex space-x-6">
        <li>
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
            <Home size={18} /> Home
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
        </li>
        <li>
          <Link href="/about" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
            <Info size={18} /> About
          </Link>
        </li>
        <li>
          <Link href="/docs" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
            <FileText size={18} /> Docs
          </Link>
        </li>
        <li>
          <Link href="/contact" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition">
            <Mail size={18} /> Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
