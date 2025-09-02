"use client";
import Image from "next/image";
import Icon1 from "@/assets/about_us.png";
import Icon2 from "@/assets/contact_us.png";
import Icon3 from "@/assets/location.png";

export default function Contact() {
    return (
        <main className="w-full px-8 py-12 space-y-32 min-h-screen overflow-y-auto text-center shadow-md">
            <h1 className="text-2xl font-semibold mb-8">Contact Us</h1>
            <form className="flex flex-col p-6 border rounded-2xl gap-4 px-15 pt-15 pb-15 ml-85 mr-85 mb-8" style={{ backgroundColor: "#DCFFEA" }}>
                {/* Full Name */}
                <input
                    type="text"
                    placeholder="Enter your Full name"
                    className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {/* Email */}
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {/* Message */}
                <textarea
                    placeholder="Type your message..."
                    rows={4}
                    className="w-full p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700"
                >
                    Submit
                </button>
                </form>
            <div 
                className="flex flex-row p-6 border rounded-2xl gap-38 justify-center mx-15"
                style={{ backgroundColor: "#DCFFEA" }}
                >
                <div className="flex flex-col items-center justify-center">
                    <Image src={Icon1} alt="Icon1" className="object-contain" width={90} height={90} />
                    <h1>ABOUT US</h1>
                    <p>Leafin Things Aquaponics</p>
                    <p>.</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Image src={Icon2} alt="Icon2" className="object-contain" width={90} height={90} />
                    <h1>Contact</h1>
                    <p>+09094778786</p>
                    <p>+09667364801</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Image src={Icon3} alt="Icon3" className="object-contain" width={90} height={90} />
                    <h1>LOCATION</h1>
                    <p>Brgy. Cobangbang</p>
                    <p>Daet Camarines Norte</p>
                </div>
            </div>     
        </main>
    );
}