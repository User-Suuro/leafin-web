///components/batch/BatchTable.tsx
"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/shadcn/ui/table";
import { Input } from "@/shadcn/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shadcn/ui/select";
import { ArrowUpDown } from "lucide-react";
import StatusBadge from "./StatusBadge";
import TableActions from "./TableActions";

type BatchStatus = "growing" | "ready" | "harvested" | "discarded";

export default function BatchTable<T extends { [key: string]: any }>({
  data,
  type,
}: {
  data: T[];
  type: "fish" | "plant";
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BatchStatus | "all">("all");
  const [sortKey, setSortKey] = useState<string>("dateAdded");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const filtered = data.filter((b) => {
    const matchesSearch = Object.values(b).join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || b.batchStatus === filter;
    return matchesSearch && matchesFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const start = (page - 1) * rowsPerPage;
  const paginated = sorted.slice(start, start + rowsPerPage);
  const totalPages = Math.ceil(sorted.length / rowsPerPage);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <section className="border rounded-xl p-4 shadow-sm bg-white flex flex-col">
      <h2 className="text-xl font-semibold mb-3">
        {type === "fish" ? "Fish Batches" : "Plant Batches"}
      </h2>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-3">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={filter} onValueChange={(val: BatchStatus | "all") => setFilter(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="growing">Growing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="harvested">Harvested</SelectItem>
            <SelectItem value="discarded">Discarded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-y-auto max-h-[400px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => toggleSort(type + "BatchId")}># <ArrowUpDown className="inline w-3 h-3 ml-1" /></TableHead>
              <TableHead onClick={() => toggleSort(type + "Quantity")}>Quantity <ArrowUpDown className="inline w-3 h-3 ml-1" /></TableHead>
              <TableHead onClick={() => toggleSort("dateAdded")}>Date Added <ArrowUpDown className="inline w-3 h-3 ml-1" /></TableHead>
              <TableHead>Condition</TableHead>
              <TableHead onClick={() => toggleSort("expectedHarvestDate")}>Expected Harvest <ArrowUpDown className="inline w-3 h-3 ml-1" /></TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((b) => (
              <TableRow key={b[type + "BatchId"]}>
                <TableCell>{b[type + "BatchId"]}</TableCell>
                <TableCell>{b[type + "Quantity"]}</TableCell>
                <TableCell>{b.dateAdded}</TableCell>
                <TableCell>{b.condition}</TableCell>
                <TableCell>{b.expectedHarvestDate || "-"}</TableCell>
                <TableCell><StatusBadge status={b.batchStatus} /></TableCell>
                <TableCell><TableActions onAction={(action) => console.log(action, b)} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-2">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages || 1}</span>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </section>
  );
}
