"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Droplets, HeartPulse } from "lucide-react";

interface TimelineEvent {
  date?: string;
  event?: string;
  status?: "Completed" | "Upcoming" | string;
  fishBatchId?: number;
  fishQuantity?: number;
  fishDays?: number;
  condition?: string;
}

type TimelineBar = {
  id?: string | number;
  label: string;
  startDay: number;
  endDay: number;
  type: string;
  stageIndex: number;
  raw?: any;
};

export function StageTimeline({
  title,
  stageDef,
  apiUrl,
  typeKey,
  batchesProp,
}: {
  title: string;
  stageDef: { name: string; maxDays: number }[];
  apiUrl?: string;
  typeKey: string;
  batchesProp?: TimelineEvent[];
}) {
  const [month, setMonth] = useState<Date>(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [bars, setBars] = useState<TimelineBar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const daysInMonth = useMemo(() => new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(), [month]);
  const monthLabel = useMemo(
    () => month.toLocaleString("en-US", { month: "long", year: "numeric" }).toUpperCase(),
    [month]
  );

  const colorMap: Record<string, string> = {
    tilapia: "#60A5FA",
    lettuce: "#34D399",
    default: "#9CA3AF",
  };

  const loadForMonth = useCallback(
    async (currentMonth: Date) => {
      setLoading(true);
      setError(null);
      try {
        let rawBatches: any[] = [];

        if (batchesProp && batchesProp.length > 0) {
          rawBatches = batchesProp;
        } else if (apiUrl) {
          const res = await fetch(
            apiUrl + `?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`,
            { cache: "no-store" }
          );
          rawBatches = await res.json();
        }

        const mappedBars: TimelineBar[] = rawBatches.map((b: any, idx: number) => {
          const startDay = 1;
          const duration = b.fishDays ?? b.days ?? 20;
          const endDay = Math.min(startDay + Math.floor(duration) - 1, daysInMonth);
          const stageIndex = determineStageIndex(duration, stageDef);

          return {
            id: b.fishBatchId ?? idx,
            label: b.event ?? `B${idx + 1}`,
            startDay,
            endDay,
            type: typeKey,
            stageIndex,
            raw: b,
          };
        });

        setBars(mappedBars);
      } catch (err: any) {
        setError(String(err?.message ?? err ?? "Unknown error"));
        setBars([]);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, batchesProp, daysInMonth, stageDef, typeKey]
  );

  useEffect(() => {
    loadForMonth(month);
  }, [loadForMonth, month]);

  const changeMonth = (offset: number) => {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + offset, 1));
  };

  const leftPercent = (day: number) => ((day - 1) / daysInMonth) * 100;
  const widthPercent = (start: number, end: number) => ((end - start + 1) / daysInMonth) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {typeKey === "tilapia" ? (
              <HeartPulse className="w-5 h-5 text-blue-500" />
            ) : (
              <Droplets className="w-5 h-5 text-green-500" />
            )}
            <span>{title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => changeMonth(-1)} className="px-2 py-1 border rounded hover:bg-gray-100">
              ◀
            </button>
            <div className="font-medium">{monthLabel}</div>
            <button onClick={() => changeMonth(1)} className="px-2 py-1 border rounded hover:bg-gray-100">
              ▶
            </button>
          </div>
        </CardTitle>
        <CardDescription>Click arrows to navigate months. Timeline updates from API.</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <div className="grid grid-cols-[160px_1fr] min-w-[700px]">
          {/* Stage labels */}
          <div className="pr-4 border-r">
            <div className="font-semibold mb-2">Stages</div>
            {stageDef.map((s, idx) => (
              <div key={idx} className="py-3 border-b text-sm">
                {s.name}
              </div>
            ))}
          </div>

          {/* Timeline grid */}
          <div className="pl-4">
            <div className="flex items-center gap-1 mb-3" style={{ minWidth: daysInMonth * 28 }}>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <div key={i} className="text-xs text-center w-[28px]">
                  {i + 1}
                </div>
              ))}
            </div>

            {stageDef.map((_, stageIdx) => (
              <div key={stageIdx} className="relative mb-3" style={{ minWidth: daysInMonth * 28, height: 44 }}>
                <div className="absolute inset-0 flex">
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <div key={i} className="h-full border-r border-dotted border-gray-100 w-[28px]" />
                  ))}
                </div>

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                )}
                {!loading && bars.filter((b) => b.stageIndex === stageIdx).length === 0 && (
                  <div className="absolute left-2 top-2 text-xs text-muted-foreground">—</div>
                )}

                {bars
                  .filter((b) => b.stageIndex === stageIdx)
                  .map((b) => {
                    const left = leftPercent(b.startDay);
                    const width = widthPercent(b.startDay, b.endDay);
                    const bg = colorMap[typeKey] ?? colorMap.default;
                    return (
                      <div
                        key={String(b.id)}
                        className="absolute top-2 h-[32px] rounded-md text-white flex items-center justify-center text-xs"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          background: bg,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        }}
                      >
                        <span className="px-2 truncate max-w-full">{b.label}</span>
                      </div>
                    );
                  })}
              </div>
            ))}
            {error && <div className="text-sm text-red-600 mt-2">Error loading timeline: {error}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function determineStageIndex(days: number, stageDef: { name: string; maxDays: number }[]) {
  for (let i = 0; i < stageDef.length; i++) {
    if (days <= stageDef[i].maxDays) return i;
  }
  return stageDef.length - 1;
}
