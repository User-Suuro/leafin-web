"use client";

import React from "react";
import { Card, CardContent } from "@/shadcn/ui/card";

interface OverviewCardProps {
  title: string;
  borderColor: string;
  totalBatches: number;
  avgAge: number;
  totalCount: number;
  condition: string;
  textColor: string;
  onClick: () => void;
  leftLabel: string; // e.g. "Total Plants" or "Total Fish"
}

export function OverviewCard({
  title,
  borderColor,
  totalBatches,
  avgAge,
  totalCount,
  condition,
  textColor,
  onClick,
  leftLabel
}: OverviewCardProps) {
  return (
    <Card
      className={`border-t-4 ${borderColor} cursor-pointer hover:shadow-lg transition`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-center mb-4 relative">
          <div className="w-12 h-12 flex justify-center items-center mr-4" />
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex flex-col gap-1">
            <span>
              Total Batches: <strong>{totalBatches}</strong>
            </span>
            <span>
              Avg Age:{" "}
              <strong className={textColor}>
                {avgAge} days
              </strong>
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span>
              {leftLabel}: <strong>{totalCount}</strong>
            </span>
            <span>
              Condition:{" "}
              <strong className={textColor}>
                {condition || "N/A"}
              </strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
