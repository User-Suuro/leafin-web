"use client";
import Image from "next/image";
import Tilapia from "@/assets/Tilapia.png";
import Lettuce from "@/assets/Lettuce.png";
import Leaf from "@/assets/leaf.png";
import Fish from "@/assets/jam_fish.png";
import System from "@/assets/system.png";
import One from "@/assets/one.png";
import Two from "@/assets/two.png";
import Three from "@/assets/three.png";
import Person1 from "@/assets/Gab.png";
import Person2 from "@/assets/Master.png";
import Person3 from "@/assets/JUB.png";
import Person4 from "@/assets/LevnicolayevichAdlawan.png";
import Person5 from "@/assets/Joshie.png";
import Person6 from "@/assets/Ajan.png";
import Person7 from "@/assets/Mikay.png";
import Person8 from "@/assets/Divine.png";
import Person9 from "@/assets/Doms.png";
import Person10 from "@/assets/Johann.png";

export default function About() {
  return (
    <main
      className="w-full px-8 py-12 space-y-32 min-h-screen overflow-y-auto"
    >
      {/* LETTUCE */}
      <div className="flex flex-row items-start justify-between w-full max-w-6xl mx-auto gap-10 ">
        {/* Image Left */}
        <div className="w-1/3 flex justify-center">
          <Image
            src={Lettuce}
            alt="Lettuce"
            className="object-contain"
            width={350}
            height={300}
          />
        </div>

        {/* Text Right */}
        <div className="w-2/3 flex flex-col mx-auto" >
          <h1 className="[font-family:var(--font-luckiest)] text-5xl text-green-700 mb-4 text-left">
            LETTUCE
          </h1>
          <p className="mb-4">
            Lettuce is one of the most popular and successful crops for aquaponics
            systems due to its fast growth rate, low maintenance requirements, and
            adaptability to hydroponic environments. It is a cool-season leafy
            vegetable that thrives in water-based systems like deep water culture
            (DWC) or nutrient film technique (NFT), where its roots have constant
            access to oxygenated, nutrient-rich water.
          </p>
          <p>
            In an aquaponics setup, lettuce benefits from the natural nutrients
            provided by fish waste, eliminating the need for chemical fertilizers.
            It typically reaches harvest size in 30 to 45 days, depending on the
            variety and environmental conditions. Lettuce also helps maintain water
            balance and offers a visual indicator of system health due to its
            sensitivity to changes in pH and nutrient levels.
          </p>
        </div>
      </div>

      {/* TILAPIA */}
      <div className="flex flex-row items-start justify-between w-full max-w-6xl mx-auto gap-10">
        {/* Text Left */}
        <div className="w-2/3 flex flex-col">
          <h1 className="[font-family:var(--font-luckiest)] text-5xl text-green-700 mb-4">
            TILAPIA
          </h1>
          <p className="mb-4">
            Tilapia is one of the most widely used fish species in aquaponics due
            to its resilience, fast growth rate, and ability to thrive in controlled
            environments. Native to Africa, tilapia are freshwater fish that can
            tolerate a wide range of water conditions, including fluctuations in
            temperature, pH, and dissolved oxygen levels. This hardiness makes them
            an excellent choice for beginners and experienced aquaponics
            practitioners alike.
          </p>
          <p>
            In an aquaponics system, tilapia serve as the primary nutrient source
            for the plants. As the fish are fed, they produce waste that is
            converted by beneficial bacteria into nitrates—an essential nutrient
            for plant growth. This natural nutrient cycle supports both the health
            of the fish and the productivity of the plants, creating a balanced,
            symbiotic environment.
          </p>
        </div>

        {/* Image Right */}
        <div className="w-1/3 flex justify-center">
          <Image
            src={Tilapia}
            alt="Tilapia"
            className="object-contain"
            width={350}
            height={300}
          />
        </div>
      </div>

  <div className="flex flex-col w-full max-w-6xl mx-auto gap-12">
  {/* Row 1 */}
  <div className="flex flex-row items-start gap-6">
    {/* Icon */}
    <div className="w-1/6 flex justify-center">
      <Image
        src={Leaf}
        alt="Leaf"
        className="object-contain"
        width={80}
        height={80}
      />
    </div>

    {/* Number + Text */}
    <div className="flex flex-row items-start gap-4 w-5/6">
      <Image
        src={One}
        alt="One"
        className="object-contain"
        width={40}
        height={40}
      />
      <p>
        Tilapia (Oreochromis niloticus) is a fast-growing freshwater fish ideal
        for aquaponics. It is hardy, easy to maintain, and thrives in varied water
        conditions. In the system, tilapia will be kept in tanks with sensors for
        pH, temperature, and oxygen, and fed using an automated feeder.
      </p>
    </div>
  </div>

  {/* Row 2 */}
  <div className="flex flex-row items-start gap-6">
    <div className="w-1/6 flex justify-center">
      <Image
        src={Fish}
        alt="Fish"
        className="object-contain"
        width={80}
        height={80}
      />
    </div>
    <div className="flex flex-row items-start gap-4 w-5/6">
      <Image
        src={Two}
        alt="Two"
        className="object-contain"
        width={40}
        height={40}
      />
      <p>
        Lettuce (Lactuca sativa) grows well in aquaponic setups due to its low
        nutrient needs and quick growth. It will be planted in rafts or channels
        where roots absorb nutrients from fish waste. Sensors will help maintain
        water quality for optimal plant health.
      </p>
    </div>
  </div>

  {/* Row 3 */}
  <div className="flex flex-row items-start gap-6">
    <div className="w-1/6 flex justify-center">
      <Image
        src={System}
        alt="System"
        className="object-contain"
        width={80}
        height={80}
      />
    </div>
    <div className="flex flex-row items-start gap-4 w-5/6">
      <Image
        src={Three}
        alt="Three"
        className="object-contain"
        width={40}
        height={40}
      />
      <p>
        The Aquaponics System connects fish and plant production in a sustainable
        cycle. Fish provide nutrients for the plants, while plants help filter
        the water. With automated monitoring and feeding, the system ensures
        balanced growth with less manual work.
      </p>
    </div>
  </div>
  </div>

  <div className="flex flex-col w-full max-w-6xl mx-auto mb-15 gap-3 text-center">
  <h1 className="text-2xl mb-4">
    Meet the <span className="text-green-700">TEAM</span>
  </h1>
  <h3>Hardware Support & System Programmer</h3>

  {/* First row */}
  <div
    className="flex flex-row justify-center p-4 rounded-2xl gap-12 shadow-lg"
    style={{ backgroundColor: "#DCFFEA" }}
  >
    <div className="flex flex-col items-center">
      <Image src={Person1} alt="Person1" className="object-contain" width={90} height={90} />
      <h1 className="mt-2 text-sm font-semibold">GABRIELLE DE LA CRUZ</h1>
    </div>

    <div className="flex flex-col items-center">
      <Image src={Person2} alt="Person2" className="object-contain" width={90} height={90} />
      <h1 className="mt-2 text-sm font-semibold">GODWIN GALVEZ</h1>
    </div>

    <div className="flex flex-col items-center">
      <Image src={Person3} alt="Person3" className="object-contain" width={90} height={90} />
      <h1 className="mt-2 text-sm font-semibold">JOHN MARK PARDO</h1>
    </div>

    <div className="flex flex-col items-center">
      <Image src={Person4} alt="Person4" className="object-contain" width={90} height={90} />
      <h1 className="mt-2 text-sm font-semibold">LEVNICOLAYEVICH ADLAWAN</h1>
    </div>

    <div className="flex flex-col items-center">
      <Image src={Person5} alt="Person5" className="object-contain" width={90} height={90} />
      <h1 className="mt-2 text-sm font-semibold">JOSHUA GUEVARRA</h1>
    </div>
  </div>

  {/* Second row */}
  <div
    className="flex flex-row justify-center p-4 rounded-2xl gap-18 shadow-lg"
    style={{ backgroundColor: "#DCFFEA" }}
  >
    <div className="flex flex-col items-center">
      <Image src={Person6} alt="Person6" className="object-contain" width={90} height={90} />
      <h1 className="mt-2 text-sm font-semibold">AJANIEL TEJARES</h1>
    </div>

    <div className="flex flex-col items-center">
      <Image src={Person7} alt="Person7" className="object-contain" width={90} height={90} />
      <h1 className="mt-2 text-sm font-semibold">MIKYLLA NANEZ</h1>
    </div>

    <div className="flex flex-col items-center">
      <Image src={Person8} alt="Person8" className="object-contain" width={90} height={90} />
      <h1 className="mt-2 text-sm font-semibold">DIVINE PONCIANO</h1>
    </div>

    <div className="flex flex-col items-center">
      <Image src={Person9} alt="Person9" className="object-contain" width={90} height={90} />
      <h1 className="mt-2 text-sm font-semibold">RENZ DOMINIC AZUL</h1>
    </div>

    <div className="flex flex-col items-center">
      <Image src={Person10} alt="Person10" className="object-contain" width={90} height={90} />
      <h1 className="mt-2 text-sm font-semibold">JOHANN CHAVEZ</h1>
    </div>
  </div>
</div>

    </main>
  );
}
