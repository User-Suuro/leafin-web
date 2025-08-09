"use client";

import { Sidebar } from "@/components/navigation/sidebar";
import {
  LayoutDashboard,
  Wallet,
  BarChart,
  RefreshCcw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Separator } from "@/shadcn/ui/separator";

export default function SalesROI() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Sales & ROI</h1>
        <Separator className="mb-6" />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard icon={<LayoutDashboard className="w-6 h-6 text-blue-500" />} label="Total Revenue" value="50%" />
          <MetricCard icon={<Wallet className="w-6 h-6 text-blue-500" />} label="Total Expenses" value="50%" />
          <MetricCard icon={<BarChart className="w-6 h-6 text-blue-500" />} label="Net Profit" value="50%" />
          <MetricCard icon={<RefreshCcw className="w-6 h-6 text-blue-500" />} label="ROI" value="50%" />
        </div>

        {/* Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Monthly Revenue vs. Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Replace this with actual chart component */}
            <div className="h-64 w-full border border-dashed flex items-center justify-center text-muted-foreground">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transaction</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price per Unit</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Feb 09, 2025</TableCell>
                  <TableCell>Lettuce</TableCell>
                  <TableCell>5 pcs.</TableCell>
                  <TableCell>₱ 40.00</TableCell>
                  <TableCell>₱ 200.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Feb 09, 2025</TableCell>
                  <TableCell>Tilapia</TableCell>
                  <TableCell>2 pcs.</TableCell>
                  <TableCell>₱ 80.00</TableCell>
                  <TableCell>₱ 160.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Reusable Metric Card
function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="text-sm font-medium">{label}</div>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
