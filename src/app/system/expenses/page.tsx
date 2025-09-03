"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "@/shadcn/ui/separator";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Trash, Plus } from "lucide-react";
import ConfirmModal from "@/components/modal/ConfirmModal";

type Expense = {
  expenseId: number;
  expenseDate: string;
  category: "feed" | "maintenance" | "labor" | "utilities" | "other";
  description: string | null;
  amount: number;
  relatedFishBatchId?: number | null;
  relatedPlantBatchId?: number | null;
};

type Batch = {
  id: number;
  name: string;
};

export default function MyExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState<Expense["category"]>("feed");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [fishBatch, setFishBatch] = useState<number | "">("");
  const [batches, setBatches] = useState<Batch[]>([]);

  // 🔹 State for modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

  // ✅ load from API
  useEffect(() => {
    async function loadExpenses() {
      try {
        const res = await fetch("/api/expenses");
        if (res.ok) {
          const data = await res.json();
          setExpenses(data);
        }
      } catch (err) {
        console.error("Failed to load expenses:", err);
      }
    }
    loadExpenses();
  }, []);

  useEffect(() => {
    async function fetchBatches() {
      if (category === "feed") {
        try {
          const res = await fetch("/api/fish-batch/batches-fish");
          if (!res.ok) throw new Error("Failed to fetch fish batches");
          const data = await res.json();
          setBatches(data || []);
        } catch (error) {
          console.error("Error fetching fish batches:", error);
        }
      } else {
        setBatches([]);
        setFishBatch("");
      }
    }
    fetchBatches();
  }, [category]);

  const handleAddExpense = async () => {
    if (!category || !description || !amount) return;

    if (category === "feed" && !fishBatch) {
      alert("Please select a Fish Batch for Feed expenses.");
      return;
    }

    const body = {
      category,
      description,
      amount: Number(amount),
      relatedFishBatchId: category === "feed" ? Number(fishBatch) : null,
      relatedPlantBatchId: null,
    };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const newList = await fetch("/api/expenses").then((r) => r.json());
        setExpenses(newList);
        setCategory("feed");
        setDescription("");
        setAmount("");
        setFishBatch("");
      }
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  // 🔹 Show modal instead of deleting directly
  const confirmDelete = (id: number) => {
    setExpenseToDelete(id);
    setConfirmOpen(true);
  };

  // 🔹 Execute actual delete after confirm
  const handleDelete = async () => {
    if (!expenseToDelete) return;
    try {
      const res = await fetch(`/api/expenses/${expenseToDelete}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses(expenses.filter((exp) => exp.expenseId !== expenseToDelete));
      }
    } catch (err) {
      console.error("Failed to delete expense:", err);
    } finally {
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="flex flex-col p-5 space-y-6 min-h-screen">
      <header>
        <h1 className="text-2xl font-bold">My Expenses</h1>
        <Separator className="mt-1" />
      </header>

      {/* Add Expense Form */}
      <section className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
        <div className="flex flex-col">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(val) => setCategory(val as Expense["category"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feed">Feed</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {category === "feed" && (
          <div className="flex flex-col">
            <Label>Fish Batch</Label>
            <Select
              value={fishBatch ? String(fishBatch) : ""}
              onValueChange={(val) => setFishBatch(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Fish Batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-col">
          <Label>Description</Label>
          <Input
            placeholder="e.g. Purchased tilapia feed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <Label>Amount</Label>
          <Input
            type="number"
            placeholder="e.g. 500"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <Button className="h-10 w-full flex items-center justify-center gap-2" onClick={handleAddExpense}>
          <Plus className="w-4 h-4" /> Add
        </Button>
      </section>

      {/* Expense Table */}
      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Fish Batch</TableHead>
              <TableHead>Plant Batch</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((exp) => (
              <TableRow key={exp.expenseId}>
                <TableCell>{exp.expenseId}</TableCell>
                <TableCell>{exp.expenseDate}</TableCell>
                <TableCell>{exp.category}</TableCell>
                <TableCell>{exp.description}</TableCell>
                <TableCell>{exp.relatedFishBatchId ? `#${exp.relatedFishBatchId}` : "-"}</TableCell>
                <TableCell>{exp.relatedPlantBatchId ? `#${exp.relatedPlantBatchId}` : "-"}</TableCell>
                <TableCell>₱ {Number(exp.amount).toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => confirmDelete(exp.expenseId)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No expenses added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {/* 🔹 Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
