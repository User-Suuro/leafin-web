import { Card, CardContent } from "@/components/shadcn/ui/card";
import React from "react";

const ALERTS = [
  "Tilapia: Ammonia = 1.2 ppm",
  "Lettuce Batch 3: pH too low (5.1)",
  "Tilapia Tank 2: Low Oxygen",
  "Lettuce Batch 5: Bolting detected",
];

export const Alerts: React.FC = () => {
  return (
    <Card className="border-t-4 border-red-500 flex flex-col">
      <CardContent className="p-5 flex flex-col flex-1">
        <h2 className="text-xl font-semibold mb-4">Alerts</h2>
        <ul className="space-y-3 text-sm overflow-y-auto max-h-60 pr-1">
          {ALERTS.map((msg, i) => (
            <li
              key={i}
              className="flex items-start border-b border-gray-100 pb-2"
            >
              <span className="mr-2">⚠️</span>
              <span className="font-medium">{msg}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
