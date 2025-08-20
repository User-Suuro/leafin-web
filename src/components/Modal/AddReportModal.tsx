"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { useToast } from "@/shadcn/ui/toast-provider";

type ReportType = "revenue" | "sales" | "expenses";

export default function AddReportModal({
  open,
  onClose,
  type,
}: {
  open: boolean;
  onClose: () => void;
  type: ReportType;
}) {
  const { toast } = useToast();

  // Revenue
  const [revAmount, setRevAmount] = useState("");
  const [revStart, setRevStart] = useState("");
  const [revEnd, setRevEnd] = useState("");
  const [revNotes, setRevNotes] = useState("");

  // Sales
  const [salesProduct, setSalesProduct] = useState("");
  const [salesUnits, setSalesUnits] = useState("");
  const [salesUnitPrice, setSalesUnitPrice] = useState("");
  const [salesNotes, setSalesNotes] = useState("");

  // Expenses
  const [expCategory, setExpCategory] = useState("");
  const [expVendor, setExpVendor] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expNotes, setExpNotes] = useState("");

  // Change handlers (typed)
  const onChange = (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement>) =>
    setter(e.target.value);

  const handleSubmit = async () => {
    const payload =
      type === "revenue"
        ? {
            type,
            amount: parseFloat(revAmount) || 0,
            startDate: revStart || null,
            endDate: revEnd || null,
            notes: revNotes || null,
          }
        : type === "sales"
        ? {
            type,
            product: salesProduct,
            units: parseFloat(salesUnits) || 0,
            unitPrice: parseFloat(salesUnitPrice) || 0,
            notes: salesNotes || null,
          }
        : {
            type,
            category: expCategory,
            vendor: expVendor,
            amount: parseFloat(expAmount) || 0,
            notes: expNotes || null,
          };

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");

      toast({
        title: "✅ Saved",
        description: `${type} report saved.`,
      });

      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "❌ Error",
        description: "Unable to save report.",
        variant: "destructive",
      });
    }
  };

  const title =
    type === "revenue" ? "Revenue" : type === "sales" ? "Product Sales" : "Expenses";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>📄 {title} Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Revenue form */}
          {type === "revenue" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  type="number"
                  placeholder="Total Revenue"
                  value={revAmount}
                  onChange={onChange(setRevAmount)}
                />
                <Input
                  type="date"
                  placeholder="Start date"
                  value={revStart}
                  onChange={onChange(setRevStart)}
                />
                <Input
                  type="date"
                  placeholder="End date"
                  value={revEnd}
                  onChange={onChange(setRevEnd)}
                />
              </div>
              <Input
                placeholder="Notes (optional)"
                value={revNotes}
                onChange={onChange(setRevNotes)}
              />
            </>
          )}

          {/* Sales form */}
          {type === "sales" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Product Name"
                  value={salesProduct}
                  onChange={onChange(setSalesProduct)}
                />
                <Input
                  type="number"
                  placeholder="Units Sold"
                  value={salesUnits}
                  onChange={onChange(setSalesUnits)}
                />
                <Input
                  type="number"
                  placeholder="Unit Price"
                  value={salesUnitPrice}
                  onChange={onChange(setSalesUnitPrice)}
                />
              </div>
              <Input
                placeholder="Notes (optional)"
                value={salesNotes}
                onChange={onChange(setSalesNotes)}
              />
            </>
          )}

          {/* Expenses form */}
          {type === "expenses" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Category (e.g., Utilities)"
                  value={expCategory}
                  onChange={onChange(setExpCategory)}
                />
                <Input
                  placeholder="Vendor/Payee"
                  value={expVendor}
                  onChange={onChange(setExpVendor)}
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={expAmount}
                  onChange={onChange(setExpAmount)}
                />
              </div>
              <Input
                placeholder="Notes (optional)"
                value={expNotes}
                onChange={onChange(setExpNotes)}
              />
            </>
          )}

          {/* Word-like preview */}
          <div className="mt-6 border rounded-lg p-6 bg-white shadow-sm">
            <div className="text-center mb-4">
              <div className="text-xl font-semibold">Report Preview</div>
              <div className="text-sm opacity-70">{new Date().toLocaleDateString()}</div>
            </div>

            {type === "revenue" && (
              <div className="space-y-1">
                <div>
                  <strong>Total Revenue:</strong>{" "}
                  {revAmount ? `₱${Number(revAmount).toLocaleString()}` : "—"}
                </div>
                <div>
                  <strong>Period:</strong> {revStart || "—"} to {revEnd || "—"}
                </div>
                <div>
                  <strong>Notes:</strong> {revNotes || "—"}
                </div>
              </div>
            )}

            {type === "sales" && (
              <div className="space-y-1">
                <div>
                  <strong>Product:</strong> {salesProduct || "—"}
                </div>
                <div>
                  <strong>Units Sold:</strong> {salesUnits || "—"}
                </div>
                <div>
                  <strong>Unit Price:</strong>{" "}
                  {salesUnitPrice ? `₱${Number(salesUnitPrice).toLocaleString()}` : "—"}
                </div>
                <div>
                  <strong>Total Sales:</strong>{" "}
                  {salesUnits && salesUnitPrice
                    ? `₱${(Number(salesUnits) * Number(salesUnitPrice)).toLocaleString()}`
                    : "—"}
                </div>
                <div>
                  <strong>Notes:</strong> {salesNotes || "—"}
                </div>
              </div>
            )}

            {type === "expenses" && (
              <div className="space-y-1">
                <div>
                  <strong>Category:</strong> {expCategory || "—"}
                </div>
                <div>
                  <strong>Vendor:</strong> {expVendor || "—"}
                </div>
                <div>
                  <strong>Amount:</strong>{" "}
                  {expAmount ? `₱${Number(expAmount).toLocaleString()}` : "—"}
                </div>
                <div>
                  <strong>Notes:</strong> {expNotes || "—"}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
