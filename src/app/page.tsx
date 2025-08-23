"use client";
import Image from "next/image";
import homeImage from "@/assets/home.jpg";

export default function Home() {

  return (
    <main className="flex flex-row items-start justify-center min-h-screen px-16 mt-0 text-left">
      <div className="flex flex-col items-start justify-center min-h-screen pr-15" >
      <h1
        className="text-[83px] font-semibold [font-family:var(--font-cormorant)] leading-tight"
        style={{ color: "#1C4E25" }}
      >
        LeaFin Things
      </h1>

      <p
        className="text-[40px] font-medium mt-4 mb-6 [font-family:var(--font-cormorant)]"
        style={{ color: "#1C4E25" }}
      >
        An Innovative Sustainable Aquaponics
      </p>

      <button
        className="px-8 py-3 rounded-lg text-lg font-medium text-white shadow-md hover:opacity-90 transition cursor-pointer"
        style={{ backgroundColor: "#199C63" }}>
        Explore
      </button>
      </div>
      <div className="flex items-start justify-center min-h-screen pl-15 pt-8">
        <Image 
          src={homeImage} 
          alt="Home"
          className="rounded-lg "
          style={{ boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }}
          width={450}   // you can adjust this
          height={200}  // or remove and use layout="responsive"
        />
      </div>
    </main>

 
  );
  
}
