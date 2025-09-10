"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/shadcn/ui/separator";
import { Button } from "@/components/shadcn/ui/button";
import { Plus } from "lucide-react";
import BatchTable from "@/components/pages/system/batch/batchTable";
import AddBatchModal from "@/components/pages/system/modal/add-batch-modal";
import EditBatchModal from "@/components/pages/system/modal/EditBatchModal";
import HarvestBatchModal from "@/components/pages/system/modal/HarvestBatchModal";
import ConfirmModal from "@/components/pages/system/modal/ConfirmModal";

import { useBatches } from "@/components/pages/system/batch/hooks/useBatches";
import { useBatchActions } from "@/components/pages/system/batch/hooks/useBatchActions";
import { BatchType } from "@/components/pages/system/batch/types/batchTypes";

export default function BatchPage() {
  const { fishBatches, plantBatches, setFishBatches, setPlantBatches, loading } = useBatches();

  const {
    handleEdit,
    openHarvestModal,
    harvestModalOpen,
    setHarvestModalOpen,
    harvestBatchId,
    selectedType,
    setSelectedType,
  } = useBatchActions(fishBatches, plantBatches, setFishBatches, setPlantBatches);

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");
  const [confirmVariant, setConfirmVariant] = useState<"default" | "destructive">("default");

  const openConfirm = (
    title: string,
    description: string,
    onConfirm: () => void,
    variant: "default" | "destructive" = "default"
  ) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setConfirmAction(() => onConfirm);
    setConfirmVariant(variant);
    setConfirmOpen(true);
  };

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
          <BatchTable
            data={fishBatches}
            type="fish"
            onAction={(action, batchId) => {
              if (action === "harvest") openHarvestModal(batchId, "fish");
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
              if (action === "harvest") openHarvestModal(batchId, "plant");
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
              batch={editingBatch}
              onSave={(updates) => {
                if (!editingBatch) return;
                if (selectedType === "fish" && "fishBatchId" in editingBatch) {
                  handleEdit("fish", editingBatch.fishBatchId, { fishQuantity: updates.batchQuantity ?? editingBatch.fishQuantity });
                } else if (selectedType === "plant" && "plantBatchId" in editingBatch) {
                  handleEdit("plant", editingBatch.plantBatchId, { plantQuantity: updates.batchQuantity ?? editingBatch.plantQuantity });
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
              onSubmit={() => {}}
            />
          )}

          <AddBatchModal open={modalOpen} onClose={() => setModalOpen(false)} type={selectedType} />

          <ConfirmModal
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={confirmAction || (() => {})}
            title={confirmTitle}
            description={confirmDescription}
            variant={confirmVariant}
          />
        </div>
      )}
    </div>
  );
}