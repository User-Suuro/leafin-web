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
import { Alerts } from "@/components/Dashboard/Alert";

type FishBatch = {
  fishBatchId?: number;
  fishQuantity?: number;
  fish_quantity?: number;
  fishDays?: number;
  ageDays?: number;
  condition?: string;
};

type PlantBatch = {
  plantBatchId?: number;
  plantQuantity?: number;
  plant_quantity?: number;
  plantDays?: number;
  condition?: string;
};

type ApiResponse<T> = {
  batches?: T[];
  totalFish?: number;
};

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

export default function RootLayout() {
  const [lettuceData, setLettuceData] = useState<PlantBatch[]>([]);
  const [tilapiaData, setTilapiaData] = useState<FishBatch[]>([]);
  const [fishStageData, setFishStageData] = useState<Record<string, number>>({});
  const [plantStageData, setPlantStageData] = useState<Record<string, number>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType] = useState<"plant" | "fish" | "">("");

  /** Fetch helper */
  const fetchData = async <T,>(
    url: string,
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setter(data);
    } catch {
      setter({} as T);
    }
  };

  useEffect(() => {
    fetchData("/api/fish-batch/fish-batch-stages", setFishStageData);
    fetchData("/api/plant-batch/plant-batch-stages", setPlantStageData);

    fetch("/api/plant-batch")
      .then((res) => res.json())
      .then((data) => {
        const batches = Array.isArray(data) ? data : data?.batches ?? [];
        setLettuceData(batches);
      })
      .catch(() => setLettuceData([]));

    fetch("/api/fish-batch")
      .then((res) => res.json() as Promise<ApiResponse<FishBatch>>)
      .then((data) => setTilapiaData(data?.batches ?? []))
      .catch(() => setTilapiaData([]));
  }, []);

  /** Chart data */
  const fishChartData = TILAPIA_STAGE_ORDER.map(
    (stage) => fishStageData[stage] || 0
  );
  const plantChartData = LETTUCE_STAGE_ORDER.map(
    (stage) => plantStageData[stage] || 0
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Growth Overview</h1>
          <Separator className="mt-1" />
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Lettuce Overview */}
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
              id: b.plantBatchId ?? idx + 1,
              quantity: b.plantQuantity ?? b.plant_quantity ?? 0,
              days: b.plantDays ?? 0,
              condition: b.condition ?? "Unknown",
            }))}
          />

          {/* Tilapia Overview */}
          <OverviewCard
            type="fish"
            title={
              <span className="flex items-center gap-2">
                <Fish className="w-5 h-5 text-blue-500" />
                Tilapia
              </span>
            }
            borderColor="border-blue-500"
            batches={tilapiaData.map((b, idx) => ({
              id: b.fishBatchId ?? idx + 1,
              quantity: b.fishQuantity ?? b.fish_quantity ?? 0,
              days: b.fishDays ?? b.ageDays ?? 0,
              condition: b.condition ?? "Unknown",
            }))}
          />

          {/* Alerts */}
            <Alerts />
          </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LettuceStageChart labels={LETTUCE_STAGE_ORDER} data={plantChartData} />
          <TilapiaAgeChart labels={TILAPIA_STAGE_ORDER} data={fishChartData} />
        </section>

        <AddBatchModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          type={selectedType}
        />
      </div>
    </div>
  );
}
