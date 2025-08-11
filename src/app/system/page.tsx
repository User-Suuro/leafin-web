"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Separator } from "@/shadcn/ui/separator";
import AddBatchModal from "@/components/Modal/AddBatchModal";

type FishBatch = {
  fishQuantity?: number;
  fish_quantity?: number;
  fishDays?: number;
  ageDays?: number;
  condition?: string;
};

type PlantBatch = {
  plantQuantity?: number;
  plant_quantity?: number;
  condition?: string;
};

type ApiResponse = {
  batches?: FishBatch[];
  totalFish?: number;
};

export default function RootLayout() {
  const [lettuceData, setLettuceData] = useState<PlantBatch[]>([]);
  const [tilapiaData, setTilapiaData] = useState<FishBatch[]>([]);
  const [tilapiaTotal, setTilapiaTotal] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"plant" | "fish" | "">("");
  const [tilapiaCondition, setTilapiaCondition] = useState<string>("");
  const [maxDays, setMaxDays] = useState<number>(0);
  const [lettuceMaxDays, setLettuceMaxDays] = useState<number>(0);


  useEffect(() => {

    
    // plants (keep safe fallback if your plant endpoint returns object vs array)
    fetch("/api/plant-batch")
      .then((res) => res.json())
      .then((data) => {
        // handle either array or { batches: [...] }
        const batches = Array.isArray(data) ? data : data?.batches ?? [];
        setLettuceData(batches);
      })
      .catch((err) => {
        console.error("Failed to fetch plant-batch", err);
        setLettuceData([]);
      });


    

    // fish batches: endpoint returns { batches, totalFish } per our API
    fetch("/api/fish-batch")
    .then((res) => res.json() as Promise<ApiResponse>)
    .then((data) => {
      console.log("Fish batch data from API:", data.batches);  // dito i-check
      const batches: FishBatch[] = data?.batches ?? [];
      setTilapiaData(batches);

      if (typeof data?.totalFish === "number") {
        setTilapiaTotal(data.totalFish);
      } else {
        const total = batches.reduce(
          (sum, b) =>
            sum + (b.fishQuantity ?? b.fish_quantity ?? 0),
          0
        );
        setTilapiaTotal(total);
      }

      // ✅ Get majority condition
      if (batches.length > 0) {
        const conditionCounts = batches.reduce((acc: Record<string, number>, b) => {
          const condition = b.condition || "Unknown";
          acc[condition] = (acc[condition] || 0) + 1;
          return acc;
        }, {});
        const majorityCondition = Object.entries(conditionCounts).sort(
          (a, b) => b[1] - a[1]
        )[0][0];
        setTilapiaCondition(majorityCondition);
      } else {
        setTilapiaCondition("N/A");
      }
    })
    .catch((err) => {
      console.error("Failed to fetch fish-batch", err);
      setTilapiaData([]);
      setTilapiaTotal(0);
      setTilapiaCondition("N/A");
    });
  // Fetch maxDays separately
    fetch("/api/fish-batch-maxdays")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.maxDays === "number") {
          setMaxDays(data.maxDays);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch max fish days", err);
        setMaxDays(0);
      });

    fetch("/api/plant-batch-maxdays")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.maxDays === "number") {
          setLettuceMaxDays(data.maxDays);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch max plant days", err);
        setLettuceMaxDays(0);
      });
}, []);


    

  // // compute max age (days) from batch data (supports fishDays or ageDays)
  // const maxAgeDays =
  //   tilapiaData.length > 0
  //     ? tilapiaData.reduce((max, b) => {
  //         const age = b.fishDays ?? b.ageDays ?? 0;
  //         return age > max ? age : max;
  //       }, 0)
  //     : 0;

  // total plants fallback: try camelCase then snake_case
  const totalPlants = lettuceData.reduce(
    (sum, b) => sum + (b.plantQuantity ?? b.plant_quantity ?? 0),
    0
  );

  

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Growth Overview</h1>
          <Separator className="mt-1 bg-gray-300" />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Lettuce Card */}
  <Card
    className="border-t-4 border-green-500 cursor-pointer hover:shadow-lg transition"
    onClick={() => {
      setSelectedType("plant");
      setModalOpen(true);
    }}
  >
    <CardContent className="p-5">
      <div className="flex items-center mb-4 relative">
        <div className="w-12 h-12 flex justify-center items-center mr-4" />
        <h2 className="text-xl font-semibold text-gray-800">Lettuce</h2>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <div className="flex flex-col gap-1">
          <span>
            Total Batches: <strong>{lettuceData.length}</strong>
          </span>
          <span>
            Avg Age:{" "}
            <strong className="text-green-500">
              {lettuceMaxDays} days
            </strong>
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span>
            Total Plants:{" "}
            <strong>
              {totalPlants}
            </strong>
          </span>
          <span>
            Condition:{" "}
            <strong className="text-green-500">
              {lettuceData.length > 0
                ? Object.entries(
                    lettuceData.reduce((acc: Record<string, number>, b) => {
                      const cond = b.condition || "Unknown";
                      acc[cond] = (acc[cond] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1])[0][0]
                : "N/A"}
            </strong>
          </span>
        </div>
      </div>
    </CardContent>
  </Card>


          {/* Tilapia Card */}
          <Card
            className="border-t-4 border-blue-500 cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              setSelectedType("fish");
              setModalOpen(true);
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-center mb-4 relative">
                <div className="w-12 h-12 flex justify-center items-center mr-4" />
                <h2 className="text-xl font-semibold text-gray-800">Tilapia</h2>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <div className="flex flex-col gap-1">
                  <span>
                    Total Batches: <strong>{tilapiaData.length}</strong>
                  </span>
                  <span>
                    Avg Age:{" "}
                    <strong className="text-blue-500">
                      {maxDays} days
                    </strong>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>
                    Total Fish: <strong>{tilapiaTotal}</strong>
                  </span>
                  <span>
                    Condition:{" "}
                    <strong className="text-blue-500">
                      {tilapiaCondition || "N/A"}
                    </strong>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Card */}
          <Card className="border-t-4 border-red-500 flex flex-col">
            <CardContent className="p-5 flex flex-col flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Alerts</h2>
              <ul className="space-y-3 text-sm overflow-y-auto max-h-40 pr-1">
                {[
                  "Tilapia: Ammonia = 1.2 ppm",
                  "Lettuce Batch 3: pH too low (5.1)",
                  "Tilapia: Ammonia = 1.2 ppm",
                  "Lettuce Batch 3: pH too low (5.1)",
                ].map((msg, i) => (
                  <li key={i} className="flex items-center border-b border-gray-100 pb-2">
                    <span className="mr-2">⚠️</span>
                    <span className="text-red-500 font-medium">{msg}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Lettuce Chart */}
        <Card>
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lettuce Stage Distribution</h2>
            <div className="h-56 relative">
              <canvas id="lettuceChart" className="w-full h-full"></canvas>
            </div>
            <div className="flex justify-center mt-4 text-sm">
              <div className="flex items-center mx-4">
                <span className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></span>
                Vegetative
              </div>
              <div className="flex items-center mx-4">
                <span className="w-4 h-4 rounded-full bg-green-600 mr-2"></span>
                Mature
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AddBatchModal */}
        <AddBatchModal open={modalOpen} onClose={() => setModalOpen(false)} type={selectedType} />
      </div>
    </div>
  );
}
