"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/shadcn/ui/separator";
import { Button } from "@/shadcn/ui/button";
import { Plus } from "lucide-react";
import BatchTable from "@/components/batch/batchTable";
import AddBatchModal from "@/components/modal/add-batch-modal";

type BatchStatus = "growing" | "ready" | "harvested" | "discarded";

type FishBatch = {
  fishBatchId: number;
  fishQuantity: number;
  dateAdded: string;
  expectedHarvestDate?: string;
  condition?: string;
  batchStatus: BatchStatus;
};

type PlantBatch = {
  plantBatchId: number;
  plantQuantity: number;
  dateAdded: string;
  expectedHarvestDate?: string;
  condition?: string;
  batchStatus: BatchStatus;
};

export default function BatchPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"fish" | "plant" | "">("");
  const [fishBatches, setFishBatches] = useState<FishBatch[]>([]);
  const [plantBatches, setPlantBatches] = useState<PlantBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/batches"); // one call only
        if (!res.ok) throw new Error("Failed to fetch batches");

        const data = await res.json();
        setFishBatches(data.fish || []);
        setPlantBatches(data.plant || []);
      } catch (err) {
        console.error("Failed to fetch batches:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col p-5 space-y-6 min-h-screen">
      <header>
        <h1 className="text-2xl font-bold">Batch Management</h1>
        <Separator className="mt-1" />
      </header>

      <div className="flex gap-2">
        <Button onClick={() => { setSelectedType("fish"); setModalOpen(true); }}>
          <Plus className="w-4 h-4" /> Add Fish Batch
        </Button>
        <Button onClick={() => { setSelectedType("plant"); setModalOpen(true); }}>
          <Plus className="w-4 h-4" /> Add Plant Batch
        </Button>
      </div>

      {loading ? (
        <p>Loading batches...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BatchTable data={fishBatches} type="fish" />
          <BatchTable data={plantBatches} type="plant" />
        </div>
      )}

      <AddBatchModal open={modalOpen} onClose={() => setModalOpen(false)} type={selectedType} />
    </div>
  );
}
