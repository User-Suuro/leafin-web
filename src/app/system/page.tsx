"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Separator } from "@/shadcn/ui/separator";
import AddBatchModal from "@/components/Modal/AddBatchModal";
import { OverviewCard } from "@/components/Dashboard/OverviewCard";
import LettuceStageChart from "@/components/Dashboard/Charts/LettuceStageChart";
import TilapiaAgeChart from "@/components/Dashboard/Charts/TilapiaAgeChart";
import { Leaf, Fish } from "lucide-react";

type FishBatch = {
  fishBatchId?: number;
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
  const [fishStageData, setFishStageData] = useState<Record<string, number>>({});
  const [plantStageData, setPlantStageData] = useState<Record<string, number>>({});
  const [selectedId, setSelectedId] = useState<string>("");

  const TILAPIA_STAGE_ORDER = [
    "Larval Stage",
    "Juvenile Stage",
    "Grow-Out Stage",
    "Harvest Ready",
  ];

  const LETTUCE_STAGE_ORDER = [
    "Seedling Stage",
    "Vegetative Growth",
    "Harvest Ready",
    "Bolting & Seeding",
  ];

  useEffect(() => {
    fetch("/api/fish-batch/fish-batch-stages")
      .then((res) => res.json())
      .then((data) => setFishStageData(data))
      .catch(() => setFishStageData({}));

    fetch("/api/plant-batch/plant-batch-stages")
      .then((res) => res.json())
      .then((data) => setPlantStageData(data))
      .catch(() => setPlantStageData({}));

    fetch("/api/plant-batch")
      .then((res) => res.json())
      .then((data) => {
        const batches = Array.isArray(data) ? data : data?.batches ?? [];
        setLettuceData(batches);
      })
      .catch(() => setLettuceData([]));

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

  const fishChartLabels = TILAPIA_STAGE_ORDER;
  const fishChartData = TILAPIA_STAGE_ORDER.map(stage => fishStageData[stage] || 0);

  const plantChartLabels = LETTUCE_STAGE_ORDER;
  const plantChartData = LETTUCE_STAGE_ORDER.map(stage => plantStageData[stage] || 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Growth Overview</h1>
          <Separator className="mt-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <OverviewCard
            type="plant"
            title={
              <span className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                Lettuce
              </span>
            }
            borderColor="border-green-500"
            batches={lettuceData.map((b, idx) => ({
              id: (b as any).plantBatchId ?? idx + 1, // use real id if returned
              quantity: b.plantQuantity ?? b.plant_quantity ?? 0,
              days: (b as any).plantDays ?? 0,
              condition: b.condition ?? "Unknown"
            }))}
          />


          <OverviewCard
          type="fish"
          title={
            <span className="flex items-center gap-2">
              <Fish className="w-5 h-5 text-blue-500" />
              Tilapia
            </span>
          }
          borderColor="border-blue-500"
          batches={tilapiaData.map(b => ({
            id: b.fishBatchId ?? 0, // convert fishBatchId → id
            quantity: b.fishQuantity ?? b.fish_quantity ?? 0,
            days: b.fishDays ?? b.ageDays ?? 0,
            condition: b.condition ?? "Unknown"
          }))}
        />


          <Card className="border-t-4 border-red-500 flex flex-col">
            <CardContent className="p-5 flex flex-col flex-1">
              <h2 className="text-xl font-semibold mb-4">Alerts</h2>
              <ul className="space-y-3 text-sm overflow-y-auto max-h-60 pr-1">
                {[
                  "Tilapia: Ammonia = 1.2 ppm",
                  "Lettuce Batch 3: pH too low (5.1)",
                  "Tilapia Tank 2: Low Oxygen",
                  "Lettuce Batch 5: Bolting detected",
                ].map((msg, i) => (
                  <li key={i} className="flex items-start border-b border-gray-100 pb-2">
                    <span className="mr-2">⚠️</span>
                    <span className="font-medium">{msg}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LettuceStageChart labels={plantChartLabels} data={plantChartData} />
          <TilapiaAgeChart labels={fishChartLabels} data={fishChartData} />
        </div>

        <AddBatchModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          type={selectedType}
        />
      </div>
    </div>
  );
}
