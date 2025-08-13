"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Separator } from "@/shadcn/ui/separator";
import AddBatchModal from "@/components/Modal/AddBatchModal";
import { OverviewCard } from "@/components/Dashboard/OverviewCard";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [fishStageData, setFishStageData] = useState<Record<string, number>>({});
  const [plantStageData, setPlantStageData] = useState<Record<string, number>>({});

  const TILAPIA_STAGE_ORDER = [
    "Larval Stage",
    "Juvenile Stage",
    "Grow-Out Stage",
    "Harvest",
  ];

  const LETTUCE_STAGE_ORDER = [
    "Seedling Stage",
    "Vegetative Growth",
    "Harvest Ready",
    "Bolting & Seeding",
  ];

  useEffect(() => {
    // Fetch stage data for charts
    fetch("/api/fish-batch/fish-batch-stages")
      .then((res) => res.json())
      .then((data) => setFishStageData(data))
      .catch(() => setFishStageData({}));

    fetch("/api/plant-batch/plant-batch-stages")
      .then((res) => res.json())
      .then((data) => setPlantStageData(data))
      .catch(() => setPlantStageData({}));

    // Fetch lettuce data
    fetch("/api/plant-batch")
      .then((res) => res.json())
      .then((data) => {
        const batches = Array.isArray(data) ? data : data?.batches ?? [];
        setLettuceData(batches);
      })
      .catch(() => setLettuceData([]));

    // Fetch tilapia data
    fetch("/api/fish-batch")
      .then((res) => res.json() as Promise<ApiResponse>)
      .then((data) => {
        const batches: FishBatch[] = data?.batches ?? [];
        setTilapiaData(batches);

        if (typeof data?.totalFish === "number") {
          setTilapiaTotal(data.totalFish);
        } else {
          const total = batches.reduce(
            (sum, b) => sum + (b.fishQuantity ?? b.fish_quantity ?? 0),
            0
          );
          setTilapiaTotal(total);
        }

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
      .catch(() => {
        setTilapiaData([]);
        setTilapiaTotal(0);
        setTilapiaCondition("N/A");
      });

    // Fetch max days
    fetch("/api/fish-batch-maxdays")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.maxDays === "number") setMaxDays(data.maxDays);
      })
      .catch(() => setMaxDays(0));

    fetch("/api/plant-batch-maxdays")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.maxDays === "number") setLettuceMaxDays(data.maxDays);
      })
      .catch(() => setLettuceMaxDays(0));
  }, []);

  const totalPlants = lettuceData.reduce(
    (sum, b) => sum + (b.plantQuantity ?? b.plant_quantity ?? 0),
    0
  );

  const lettuceCondition =
    lettuceData.length > 0
      ? Object.entries(
          lettuceData.reduce((acc: Record<string, number>, b) => {
            const cond = b.condition || "Unknown";
            acc[cond] = (acc[cond] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  // Prepare chart data in correct stage order
  const fishChartLabels = TILAPIA_STAGE_ORDER;
  const fishChartData = TILAPIA_STAGE_ORDER.map(stage => fishStageData[stage] || 0);

  const plantChartLabels = LETTUCE_STAGE_ORDER;
  const plantChartData = LETTUCE_STAGE_ORDER.map(stage => plantStageData[stage] || 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Growth Overview</h1>
          <Separator className="mt-1 bg-gray-300" />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <OverviewCard
            title="Lettuce"
            borderColor="border-green-500"
            totalBatches={lettuceData.length}
            avgAge={lettuceMaxDays}
            totalCount={totalPlants}
            condition={lettuceCondition}
            textColor="text-green-500"
            leftLabel="Total Plants"
            onClick={() => {
              setSelectedType("plant");
              setModalOpen(true);
            }}
          />

          <OverviewCard
            title="Tilapia"
            borderColor="border-blue-500"
            totalBatches={tilapiaData.length}
            avgAge={maxDays}
            totalCount={tilapiaTotal}
            condition={tilapiaCondition}
            textColor="text-blue-500"
            leftLabel="Total Fish"
            onClick={() => {
              setSelectedType("fish");
              setModalOpen(true);
            }}
          />

          <Card className="border-t-4 border-red-500 flex flex-col">
            <CardContent className="p-5 flex flex-col flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Alerts</h2>
              <ul className="space-y-3 text-sm overflow-y-auto max-h-60 pr-1">
                {[
                  "Tilapia: Ammonia = 1.2 ppm",
                  "Lettuce Batch 3: pH too low (5.1)",
                  "Tilapia Tank 2: Low Oxygen",
                  "Lettuce Batch 5: Bolting detected",
                ].map((msg, i) => (
                  <li key={i} className="flex items-start border-b border-gray-100 pb-2">
                    <span className="mr-2">⚠️</span>
                    <span className="text-red-500 font-medium">{msg}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="h-80">
            <CardContent className="p-5 h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Lettuce Stage Distribution
              </h2>
              <div className="h-full">
                <Pie
                  data={{
                    labels: plantChartLabels,
                    datasets: [
                      {
                        data: plantChartData,
                        backgroundColor: ["#FACC15", "#16A34A", "#4ADE80", "#A7F3D0"],
                      },
                    ],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="h-80">
            <CardContent className="p-5 h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Tilapia Age Distribution
              </h2>
              <div className="h-full">
                <Pie
                  data={{
                    labels: fishChartLabels,
                    datasets: [
                      {
                        data: fishChartData,
                        backgroundColor: ["#93C5FD", "#60A5FA", "#1D4ED8", "#1E40AF"],
                      },
                    ],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal */}
        <AddBatchModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          type={selectedType}
        />
      </div>
    </div>
  );
}
