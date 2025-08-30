"use client";

import React, { useState } from "react";
import { Separator } from "@/shadcn/ui/separator";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { Trash, Plus } from "lucide-react";

type Expense = {
  id: number;
  category: "feed" | "maintenance" | "labor" | "utilities" | "other";
  description: string;
  amount: number;
  date: string;
  relatedFishBatchId?: number | null;
  relatedPlantBatchId?: number | null;
};

export default function MyExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState<Expense["category"]>("feed");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [fishBatch, setFishBatch] = useState<number | "">("");
  const [plantBatch, setPlantBatch] = useState<number | "">("");

  // Fake data for dropdowns (in real app → from DB)
  const fishBatches = [
    { id: 1, name: "Tilapia Batch 1" },
    { id: 2, name: "Catfish Batch 2" },
  ];
  const plantBatches = [
    { id: 1, name: "Lettuce Batch A" },
    { id: 2, name: "Kangkong Batch B" },
  ];

  const handleAddExpense = () => {
    if (!category || !description || !amount) return;

    const newExpense: Expense = {
      id: expenses.length + 1,
      category,
      description,
      amount: Number(amount),
      date: new Date().toISOString().split("T")[0],
      relatedFishBatchId: fishBatch ? Number(fishBatch) : null,
      relatedPlantBatchId: plantBatch ? Number(plantBatch) : null,
    };

    setExpenses([...expenses, newExpense]);
    setCategory("feed");
    setDescription("");
    setAmount("");
    setFishBatch("");
    setPlantBatch("");
  };

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
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

        {/* Show Fish Batch if expense applies to fish */}
        {(category === "feed") && (
          <div className="flex flex-col">
            <Label>Fish Batch</Label>
            <Select
              value={fishBatch ? String(fishBatch) : ""}
              onValueChange={(val) => setFishBatch(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fish batch" />
              </SelectTrigger>
              <SelectContent>
                {fishBatches.map((batch) => (
                  <SelectItem key={batch.id} value={String(batch.id)}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Show Plant Batch if expense applies to plants */}
        {category === "other" && (
          <div className="flex flex-col">
            <Label>Plant Batch</Label>
            <Select
              value={plantBatch ? String(plantBatch) : ""}
              onValueChange={(val) => setPlantBatch(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select plant batch" />
              </SelectTrigger>
              <SelectContent>
                {plantBatches.map((batch) => (
                  <SelectItem key={batch.id} value={String(batch.id)}>
                    {batch.name}
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

        <Button
          className="h-10 w-full flex items-center justify-center gap-2"
          onClick={handleAddExpense}
        >
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
              <TableRow key={exp.id}>
                <TableCell>{exp.id}</TableCell>
                <TableCell>{exp.date}</TableCell>
                <TableCell>{exp.category}</TableCell>
                <TableCell>{exp.description}</TableCell>
                <TableCell>
                  {exp.relatedFishBatchId
                    ? `#${exp.relatedFishBatchId}`
                    : "-"}
                </TableCell>
                <TableCell>
                  {exp.relatedPlantBatchId
                    ? `#${exp.relatedPlantBatchId}`
                    : "-"}
                </TableCell>
                <TableCell>₱ {exp.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(exp.id)}
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
    </div>
  );
}
