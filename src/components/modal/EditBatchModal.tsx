"use client";

import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalBody } from "@/shadcn/ui/modal";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";

interface EditBatchModalProps {
  open: boolean;
  onClose: () => void;
  type: "fish" | "plant";
  batch: any; // FishBatch | PlantBatch
  onSave: (updates: { batchQuantity: number }) => void;
}

export default function EditBatchModal({ open, onClose, type, batch, onSave }: EditBatchModalProps) {
  // Use string to prevent React controlled input issues
  const [quantity, setQuantity] = useState<string>("");

  useEffect(() => {
    if (batch && open) {
      setQuantity(
        String(batch[type === "fish" ? "fishQuantity" : "plantQuantity"] ?? "")
      );
    }
  }, [batch, type, open]);

  const handleSave = () => {
    if (quantity !== "") {
      onSave({ batchQuantity: Number(quantity) });
      onClose();
    }
  };

  if (!batch) return null;

  return (
    <Modal open={open} onOpenChange={(val) => !val && onClose()}>
      <ModalContent>
        <ModalHeader>{type === "fish" ? "Fish" : "Plant"} Batch Info</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          {/* Display batch info */}
          <div>
            <label>Batch ID</label>
            <Input
              type="number"
              value={type === "fish" ? batch.fishBatchId : batch.plantBatchId}
              disabled
            />
          </div>

          <div>
            <label>Quantity</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div>
            <label>Status</label>
            <Input
              type="text"
              value={batch.batchStatus ?? ""}
              disabled
            />
          </div>

          <div>
            <label>Date Added</label>
            <Input
              type="text"
              value={batch.dateAdded ?? ""}
              disabled
            />
          </div>

          <div>
            <label>Expected Harvest Date</label>
            <Input
              type="text"
              value={batch.expectedHarvestDate ?? ""}
              disabled
            />
          </div>

          <div>
            <label>Condition</label>
            <Input
              type="text"
              value={batch.condition ?? ""}
              disabled
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
