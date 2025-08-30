"use client";

import { useState } from "react";
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

  const fishBatches: FishBatch[] = [
    { fishBatchId: 1, fishQuantity: 50, dateAdded: "2025-08-01", condition: "Larval Stage", batchStatus: "growing", expectedHarvestDate: "2025-09-01" },
    { fishBatchId: 2, fishQuantity: 30, dateAdded: "2025-08-05", condition: "Juvenile Stage", batchStatus: "ready", expectedHarvestDate: "2025-09-05" },
  ];

  const plantBatches: PlantBatch[] = [
    { plantBatchId: 1, plantQuantity: 100, dateAdded: "2025-08-01", condition: "Seedling Stage", batchStatus: "growing", expectedHarvestDate: "2025-09-01" },
    { plantBatchId: 2, plantQuantity: 80, dateAdded: "2025-08-05", condition: "Vegetative Growth", batchStatus: "ready", expectedHarvestDate: "2025-09-05" },
  ];

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BatchTable data={fishBatches} type="fish" />
        <BatchTable data={plantBatches} type="plant" />
      </div>

      <AddBatchModal open={modalOpen} onClose={() => setModalOpen(false)} type={selectedType} />
    </div>
  );
}
