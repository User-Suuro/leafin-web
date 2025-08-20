"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import {
  BarChart,
  Leaf,
  Fish,
  Package,
  DollarSign,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Separator } from "@/shadcn/ui/separator";
import { Button } from "@/shadcn/ui/button";
import AddReportModal from "@/components/Modal/AddReportModal";

export default function AnalyticsReports() {
  const [modalOpen, setModalOpen] = useState(false);
  const [reportType, setReportType] = useState<
    "revenue" | "sales" | "expenses" | null
  >(null);

  const openReportModal = (type: "revenue" | "sales" | "expenses") => {
    setReportType(type);
    setModalOpen(true);
  };
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        </div>

        <Separator className="mb-6" />

        {/* Growth Analytics */}
        <div className="space-y-4 mb-10">
          <h2 className="text-lg font-semibold">Growth Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lettuce */}
            <Card className="bg-green-600 text-white flex flex-col">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Lettuce
                    </CardTitle>
                    <CardDescription className="text-white/80">View Details</CardDescription>
                </CardHeader>
                <CardContent className="bg-white text-black rounded-b-xl py-6 min-h-[140px] flex-grow">
                    <div className="flex justify-between items-start text-sm">
                    <div>
                        <p>Total Batches: <span className="font-semibold text-blue-600">2</span></p>
                        <p>Total Plants: <span className="font-semibold text-blue-600">10</span></p>
                    </div>
                    <div>
                        <p>Avg Age: <span className="font-semibold text-green-600">18 days</span></p>
                        <p>Majority Stage: <span className="font-semibold text-green-600">Vegetative</span></p>
                    </div>
                    </div>
                </CardContent>
            </Card>


            {/* Tilapia */}
            <Card className="bg-blue-500 text-white flex flex-col">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                    <Fish className="w-5 h-5" />
                    Tilapia
                    </CardTitle>
                    <CardDescription className="text-white/80">View Details</CardDescription>
                </CardHeader>
                <CardContent className="bg-white text-black rounded-b-xl py-6 min-h-[140px] flex-grow">
                    <div className="flex justify-between items-start text-sm">
                    <div>
                        <p>Total Fish: <span className="font-semibold text-blue-600">5</span></p>
                    </div>
                    <div>
                        <p>Avg Age: <span className="font-semibold text-blue-600">25 days</span></p>
                        <p>Majority Stage: <span className="font-semibold text-blue-600">Juvenile</span></p>
                    </div>
                    </div>
                </CardContent>
            </Card>

          </div>
        </div>

        {/* Sales & Financial Reports */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sales and Financial</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReportCard
              icon={<BarChart className="w-12 h-12 text-blue-500" />}
              title="Revenue Report"
              onGenerate={() => openReportModal("revenue")}
            />
            <ReportCard
              icon={<Package className="w-12 h-12 text-blue-500" />}
              title="Product Sales Summary"
              onGenerate={() => openReportModal("sales")}
            />
            <ReportCard
              icon={<DollarSign className="w-12 h-12 text-blue-500" />}
              title="Expenses Report"
              onGenerate={() => openReportModal("expenses")}
            />
          </div>
        </div>
      </div>
      {/* ✅ Attach Modal */}
      {reportType && (
        <AddReportModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          type={reportType}
        />
      )}
    </div>
  );
}

function ReportCard({
  title,
  icon,
  onGenerate,
}: {
  title: string;
  icon: React.ReactNode;
  onGenerate: () => void;
}) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center">{icon}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex justify-center gap-2">
          <Button variant="secondary">View Details</Button>
          <Button onClick={onGenerate}>Generate Report</Button>
        </div>
      </CardContent>
    </Card>
  );
}
