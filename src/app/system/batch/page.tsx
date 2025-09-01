"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/shadcn/ui/separator";
import { Button } from "@/shadcn/ui/button";
import { Plus } from "lucide-react";
import BatchTable from "@/components/batch/batchTable";
import AddBatchModal from "@/components/modal/add-batch-modal";
import EditBatchModal from "@/components/modal/EditBatchModal";
import HarvestBatchModal from "@/components/modal/HarvestBatchModal";

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

type BatchType = "fish" | "plant";

type BatchUpdate<T extends BatchType> = T extends "fish"
  ? Partial<{ fishBatchId: number; fishQuantity: number; batchStatus: BatchStatus }>
  : Partial<{ plantBatchId: number; plantQuantity: number; batchStatus: BatchStatus }>;

export default function BatchPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<BatchType | "">("");
  const [fishBatches, setFishBatches] = useState<FishBatch[]>([]);
  const [plantBatches, setPlantBatches] = useState<PlantBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<FishBatch | PlantBatch | null>(null);
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  const [harvestBatchId, setHarvestBatchId] = useState<number | null>(null);

  // Fetch batches
  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/batches");
      if (!res.ok) throw new Error("Failed to fetch batches");

      const data = await res.json();
      setFishBatches(data.fish || []);
      setPlantBatches(data.plant || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

// Discard a batch
const handleDiscard = async (type: BatchType, batchId: number) => {
  if (!window.confirm("Are you sure you want to discard this batch?")) return;

  try {
    const res = await fetch("/api/batches/discard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, batchId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to discard batch");

    if (type === "fish") {
      setFishBatches((prev) =>
        prev.map((b) => (b.fishBatchId === batchId ? { ...b, batchStatus: "discarded" } : b))
      );
    } else {
      setPlantBatches((prev) =>
        prev.map((b) => (b.plantBatchId === batchId ? { ...b, batchStatus: "discarded" } : b))
      );
    }
  } catch (err: unknown) {
    console.error(err);
  }
};


  // New function to open harvest modal
const openHarvestModal = (batchId: number) => {
  setHarvestBatchId(batchId);
  setHarvestModalOpen(true);
};

// Update handleHarvest to actually call the API
const handleHarvestSubmit = async (data: { customerName: string; totalAmount: number; notes: string }) => {
  if (!harvestBatchId || !selectedType) return;

  try {
    const res = await fetch("/api/batches/harvest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: selectedType,
        batchId: harvestBatchId,
        customerName: data.customerName,
        totalAmount: Number(data.totalAmount.toFixed(2)), // convert to 2 decimal string if needed
        notes: data.notes,
      }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Failed to harvest batch");

    // Update batch status in state
    if (selectedType === "fish") {
      setFishBatches((prev) =>
        prev.map((b) => (b.fishBatchId === harvestBatchId ? { ...b, batchStatus: "harvested" } : b))
      );
    } else {
      setPlantBatches((prev) =>
        prev.map((b) => (b.plantBatchId === harvestBatchId ? { ...b, batchStatus: "harvested" } : b))
      );
    }

    setHarvestModalOpen(false);
    setHarvestBatchId(null);
  } catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
    alert(err.message || "Failed to harvest batch");
  } else {
    console.error(err);
    alert("An unknown error occurred while harvesting");
  }
}
};


  // Edit a batch (fully typed)
  const handleEdit = async <T extends BatchType>(
    type: T,
    batchId: number,
    updates: BatchUpdate<T>
  ) => {
    try {
      const res = await fetch("/api/batches/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, batchId, updates }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to edit batch");

      if (type === "fish") {
        setFishBatches((prev) =>
          prev.map((b) => (b.fishBatchId === batchId ? { ...b, ...updates } : b))
        );
      } else {
        setPlantBatches((prev) =>
          prev.map((b) => (b.plantBatchId === batchId ? { ...b, ...updates } : b))
        );
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

// Delete a batch
const handleDelete = async (type: BatchType, batchId: number) => {
  if (!window.confirm("Are you sure you want to delete this batch? This action cannot be undone.")) return;

  try {
    const res = await fetch("/api/batches/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, batchId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete batch");

    if (type === "fish") {
      setFishBatches((prev) => prev.filter((b) => b.fishBatchId !== batchId));
    } else {
      setPlantBatches((prev) => prev.filter((b) => b.plantBatchId !== batchId));
    }
  } catch (err: unknown) {
    console.error(err);
  }
};


  return (
    <div className="flex flex-col p-5 space-y-6 min-h-screen">
      <header>
        <h1 className="text-2xl font-bold">Batch Management</h1>
        <Separator className="mt-1" />
      </header>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            setSelectedType("fish");
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Add Fish Batch
        </Button>
        <Button
          onClick={() => {
            setSelectedType("plant");
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Add Plant Batch
        </Button>
      </div>

      {loading ? (
        <p>Loading batches...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BatchTable
            data={fishBatches}
            type="fish"
            onAction={(action, batchId) => {
              if (action === "discard") handleDiscard("fish", batchId);
              if (action === "harvest") {
                setSelectedType("fish");
                openHarvestModal(batchId);
              }
              if (action === "delete") handleDelete("fish", batchId);
              if (action === "edit") {
                const batch = fishBatches.find((b) => b.fishBatchId === batchId);
                if (batch) {
                  setEditingBatch(batch);
                  setSelectedType("fish");
                  setEditModalOpen(true);
                }
              }
            }}
          />

          <BatchTable
            data={plantBatches}
            type="plant"
            onAction={(action, batchId) => {
              if (action === "discard") handleDiscard("plant", batchId);
              if (action === "harvest") {
                setSelectedType("plant");
                openHarvestModal(batchId);
              }
              if (action === "delete") handleDelete("plant", batchId);
              if (action === "edit") {
                const batch = plantBatches.find((b) => b.plantBatchId === batchId);
                if (batch) {
                  setEditingBatch(batch);
                  setSelectedType("plant");
                  setEditModalOpen(true);
                }
              }
            }}
          />

          {editingBatch && selectedType && (
            <EditBatchModal
              open={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              type={selectedType}
              batch={editingBatch }
              onSave={(updates) => {
                if (!editingBatch) return;

                if (selectedType === "fish" && "fishBatchId" in editingBatch) {
                  handleEdit("fish", editingBatch.fishBatchId, {
                    fishQuantity: updates.batchQuantity ?? editingBatch.fishQuantity,
                  });
                } else if (selectedType === "plant" && "plantBatchId" in editingBatch) {
                  handleEdit("plant", editingBatch.plantBatchId, {
                    plantQuantity: updates.batchQuantity ?? editingBatch.plantQuantity,
                  });
                }

                setEditingBatch(null);
                setEditModalOpen(false);
              }}
            />
          )}

          {harvestBatchId && selectedType && (
            <HarvestBatchModal
              open={harvestModalOpen}
              onClose={() => setHarvestModalOpen(false)}
              type={selectedType}
              batchId={harvestBatchId}
              onSubmit={handleHarvestSubmit}
            />
          )}
          <AddBatchModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            type={selectedType}
          />
        </div>
      )}
    </div>
  );
}
