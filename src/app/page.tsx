"use client";


export default function Home() {

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6">
  <h1 className="text-[83px] font-semibold [font-family:var(--font-cormorant)]"
      style={{ color: "#1C4E25" }}>
        LeaFin Things</h1>
  <p className="text-[45px] font-semibold mb-2 [font-family:var(--font-cormorant)]"
  style={{ color: "#1C4E25" }}>
  An Innovative Sustainable Aquaponics
  </p>
  
  <button className="px-6 py-2 rounded text-white hover:opacity-90 transition"
  style={{ backgroundColor: "#199C63" }}>
    Explore
  </button>
</main>
 
  );
  
}
