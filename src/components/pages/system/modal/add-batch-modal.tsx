"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/shadcn/ui/dialog";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { useToast } from "@/components/shadcn/ui/toast-provider"; // ✅ fixed import

export default function AddBatchModal({
  open,
  onClose,
  type,
}: {
  open: boolean;
  onClose: () => void;
  type: string;
}) {
  const [quantity, setQuantity] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/${type}-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          type === "fish"
            ? { fishQuantity: Number(quantity), aquariumId: 1 } // ✅ match schema keys
            : { plantQuantity: Number(quantity), growbedId: 1 } // ✅ match plant schema
        ),
      });

      if (!res.ok) throw new Error("Failed to insert");

      toast({
        title: "✅ Success",
        description: `${
          type === "fish" ? "Fish" : "Plant"
        } batch added successfully.`,
      });

      setQuantity("");
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "❌ Error",
        description: "Something went wrong while adding the batch.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {type} Batch</DialogTitle>
        </DialogHeader>
        <Input
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
