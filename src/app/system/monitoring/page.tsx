"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import {
  HeartPulse,
  Thermometer,
  FlaskConical,
  Droplets,
  Clock,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Separator } from "@/shadcn/ui/separator";

interface SensorData {
  time?: string;
  date?: string;
  ph?: string;
  turbid?: string;
  timestamp: number;
}

type TimelineEvent = {
  // Support both the simple route result and richer batch objects
  date?: string; // ISO date
  event?: string; // "Batch #..."
  status?: "Completed" | "Upcoming" | string;
  // optional richer fields if available
  fishBatchId?: number;
  fishQuantity?: number;
  fishDays?: number;
  condition?: string;
};

const DEFAULT_FISH_API = "/api/fish-batch/timeline";
const DEFAULT_LETTUCE_API = "/api/plant-batch/timeline"; 

// Stage thresholds (days) - tweak to suit your domain
const TILAPIA_STAGES = [
  { name: "Larval Stage", maxDays: 14 },
  { name: "Juvenile Stage", maxDays: 60 },
  { name: "Grow-Out Stage", maxDays: 120 },
  { name: "Harvest", maxDays: Infinity },
];

const LETTUCE_STAGES = [
  { name: "Seedling Stage", maxDays: 14 },
  { name: "Vegetative Growth", maxDays: 35 },
  { name: "Harvest Ready", maxDays: 50 },
  { name: "Bolting & Seeding", maxDays: Infinity },
];

interface FishBatch {
  fishBatchId?: number;
  date?: string;
  dateAdded?: string | Date;
  fishDays?: number;
  fishQuantity?: number;
  condition?: string;
  event?: string;
  status?: string;
}

interface PlantBatch {
  plantBatchId?: number;
  date?: string;
  dateAdded?: string | Date;
  plantDays?: number;
  plantQuantity?: number;
  condition?: string;
  event?: string;
  status?: string;
}

type RawBatch = (FishBatch | PlantBatch) & Record<string, unknown>;

function normalizeBatch(input: RawBatch): {
  id?: number;
  dateISO?: string;
  days?: number;
  qty?: number;
  condition?: string;
  rawEvent?: string;
} {
  if (!input) return {};

  const hasFishDays = input.fishDays !== undefined && input.fishDays !== null;

  // Helper to safely extract numeric property from unknown object
  function getNumberProp(obj: unknown, prop: string): number | undefined {
    if (obj && typeof obj === "object" && prop in obj) {
      const val = (obj as Record<string, unknown>)[prop];
      if (typeof val === "number") return val;
      if (typeof val === "string" && !isNaN(Number(val))) return Number(val);
    }
    return undefined;
  }

  // Helper to safely extract string property from unknown object
  function getStringProp(obj: unknown, prop: string): string | undefined {
    if (obj && typeof obj === "object" && prop in obj) {
      const val = (obj as Record<string, unknown>)[prop];
      if (typeof val === "string") return val;
      if (val != null) return String(val);
    }
    return undefined;
  }

  if (input.date && hasFishDays) {
    return {
      id: (input as FishBatch).fishBatchId ?? getNumberProp(input, "id"),
      dateISO: input.date ?? getStringProp(input, "dateAdded"),
      days: (input as FishBatch).fishDays ?? getNumberProp(input, "days"),
      qty: (input as FishBatch).fishQuantity ?? getNumberProp(input, "qty"),
      condition: input.condition ?? undefined,
      rawEvent: input.event ?? undefined,
    };
  }

  const maybeDate = input.date
    ? input.date
    : typeof input.event === "string" && /\d{4}-\d{2}-\d{2}/.test(input.event)
    ? input.event.match(/\d{4}-\d{2}-\d{2}/)?.[0]
    : undefined;

  return {
    id: (input as FishBatch).fishBatchId ?? undefined,
    dateISO: maybeDate,
    days: (input as FishBatch).fishDays ?? getNumberProp(input, "days"),
    qty: undefined,
    condition: input.condition ?? undefined,
    rawEvent: input.event ?? undefined,
  };
}


// Determine stage index given age in days and stage definition
function determineStageIndex(days: number | undefined, stageDef: { name: string; maxDays: number }[]) {
  if (days === undefined || days === null || isNaN(days)) return 0;
  for (let i = 0; i < stageDef.length; i++) {
    if (days <= stageDef[i].maxDays) return i;
  }
  return stageDef.length - 1;
}

// // Utility: format date to YYYY-MM-DD
// function toISODateString(d: Date) {
//   return d.toISOString().split("T")[0];
// }

// Timeline bar type
type TimelineBar = {
  id?: string | number;
  label: string;
  startDay: number; // 1-based
  endDay: number; // inclusive
  type: string; // 'tilapia' | 'lettuce' | etc
  stageIndex: number;
  raw?: unknown;
};

/* -----------------------
   StageTimeline component
   -----------------------
   Renders a timeline card for a single species (tilapia/lettuce)
   Props:
     - title
     - stageDef (array)
     - apiUrl (to fetch batches for this species)
     - typeKey (used for color mapping)
*/
function StageTimeline({
  title,
  stageDef,
  apiUrl,
  typeKey,
  batchesProp,
}: {
  title: string;
  stageDef: { name: string; maxDays: number }[];
  apiUrl?: string; // optional: if provided, component fetches its own data when month changes
  typeKey: string; // used to pick color
  batchesProp?: TimelineEvent[]; // optional external batches (already fetched)
}) {
  const [month, setMonth] = useState<Date>(() => {
    // default to current month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [bars, setBars] = useState<TimelineBar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const daysInMonth = useMemo(
    () => new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(),
    [month]
  );
  const monthLabel = useMemo(
    () =>
      month.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }).toUpperCase(),
    [month]
  );

  // color map per type
  const colorMap: Record<string, string> = {
    tilapia: "#60A5FA",
    lettuce: "#34D399",
    seedling: "#4ADE80",
    vegetative: "#22D3EE",
    harvest: "#FBBF24",
    bolting: "#F87171",
    default: "#9CA3AF",
  };

  // fetch and map function (memoized)
  const loadForMonth = useCallback(
    async (currentMonth: Date) => {
      setLoading(true);
      setError(null);
      try {
        // allow using external prop batchesProp (already fetched in parent)
        let rawBatches: RawBatch[] = [];

        if (batchesProp && batchesProp.length > 0) {
          rawBatches = batchesProp;
        } else if (apiUrl) {
          const res = await fetch(apiUrl + `?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`, {
            cache: "no-store",
          });
          rawBatches = await res.json();
        } else {
          rawBatches = [];
        }

        // Map and filter batches that fall into this month (or overlap)
        const mappedBars: TimelineBar[] = (Array.isArray(rawBatches) ? rawBatches : []).map((b: RawBatch, idx: number) => {
          const normalized = normalizeBatch(b);
          const rawDate = normalized.dateISO ?? normalized.rawEvent ?? b.date ?? b.dateAdded;
          let batchDate: Date | null = null;
          if (!rawDate) {
            // fallback: if API provided `createdAt` or similar
            if (b.dateAdded) batchDate = new Date(b.dateAdded);
          } else {
            batchDate = new Date(rawDate);
            if (isNaN(batchDate.getTime())) {
              // try parse when rawEvent contains date inside
              const matched = String(rawDate).match(/\d{4}-\d{2}-\d{2}/);
              if (matched) batchDate = new Date(matched[0]);
            }
          }

          // fallback startDay to 1 if date invalid
          const startDay = batchDate && !isNaN(batchDate.getTime()) && batchDate.getMonth() === currentMonth.getMonth() && batchDate.getFullYear() === currentMonth.getFullYear()
            ? batchDate.getDate()
            : // if batch started before this month, place at day 1
            batchDate && !isNaN(batchDate.getTime()) && (batchDate < new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1))
            ? 1
            : 1;

          // duration: prefer fishDays, else try to estimate from status or default
          const duration = (b.fishDays ?? b.days ?? normalized.days ?? (b.status === "Upcoming" ? 5 : 20)) as number;
          const endDay = Math.min(startDay + Math.max(1, Math.floor(duration)) - 1, daysInMonth);

          // stage index computed by days (fishDays) if available, else fallback 0
          const stageIndex = determineStageIndex(Number(duration ?? 0), stageDef);

          const label = normalized.id ? `#${normalized.id}` : normalized.rawEvent ?? b.event ?? `B${idx + 1}`;

          return {
            id: normalized.id ?? label,
            label: label,
            startDay,
            endDay,
            type: typeKey,
            stageIndex,
            raw: b,
          } as TimelineBar;
        });

        setBars(mappedBars);
      } catch (err: unknown) {
        console.error("Timeline load error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
        setBars([]);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, batchesProp, daysInMonth, stageDef, typeKey]
  );

  // load when month or batchesProp change
  useEffect(() => {
    loadForMonth(month);
  }, [loadForMonth, month]);

  const changeMonth = (offset: number) => {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + offset, 1));
  };

  // helper to compute left/width percentages
  const leftPercent = (day: number) => ((day - 1) / daysInMonth) * 100;
  const widthPercent = (start: number, end: number) => ((end - start + 1) / daysInMonth) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {typeKey === "tilapia" ? <HeartPulse className="w-5 h-5 text-blue-500" /> : <Droplets className="w-5 h-5 text-green-500" />}
            <span>{title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              ◀
            </button>
            <div className="font-medium">{monthLabel}</div>
            <button
              onClick={() => changeMonth(1)}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              ▶
            </button>
          </div>
        </CardTitle>
        <CardDescription>Click arrows to navigate months. Timeline updates from API.</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <div className="grid grid-cols-[160px_1fr] min-w-[700px]">
          {/* Stage labels column */}
          <div className="pr-4 border-r">
            <div className="font-semibold mb-2">Stages</div>
            {stageDef.map((s, idx) => (
              <div key={idx} className="py-3 border-b text-sm">
                {s.name}
              </div>
            ))}
          </div>

          {/* Timeline grid column */}
          <div className="pl-4">
            {/* Days row */}
            <div className="flex items-center gap-1 mb-3" style={{ minWidth: daysInMonth * 28 }}>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <div key={i} className="text-xs text-center w-[28px]">{i + 1}</div>
              ))}
            </div>

            {/* Stage rows with relative container for bars */}
            {stageDef.map((_, stageIdx) => (
              <div key={stageIdx} className="relative mb-3" style={{ minWidth: daysInMonth * 28, height: 44 }}>
                {/* horizontal subtle grid background */}
                <div className="absolute inset-0 flex">
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <div key={i} className="h-full border-r border-dotted border-gray-100 w-[28px]" />
                  ))}
                </div>

                {/* Bars for this stage */}
                {loading && <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">Loading...</div>}
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
                        key={String(b.id) + "-" + b.label}
                        className="absolute top-2 h-[32px] rounded-md text-white flex items-center justify-center text-xs"
                        title={`${b.label} (${b.startDay}—${b.endDay})`}
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

/* ---------------------------
   Monitoring main component
   --------------------------- */
export default function Monitoring() {
  // Sensor data state
  const [tilapiaBatches, setTilapiaBatches] = useState<TimelineEvent[]>([]);
  const [lettuceBatches, setLettuceBatches] = useState<TimelineEvent[]>([]);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"Connected" | "Disconnected">("Disconnected");

  const [loadingTilapia, setLoadingTilapia] = useState(false);
  const [loadingLettuce, setLoadingLettuce] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);

  // UseMemo for tabs
  const tabs = useMemo(
    () => [
      { id: "timeline", label: "Timeline" },
      { id: "water-quality", label: "Water Quality" },
      { id: "feeder", label: "Feeder" },
      { id: "sensors", label: "Sensors" },
    ],
    []
  );

  // Fetch timelines (tilapia + optional lettuce) -- useCallback so reference stable
  const fetchTimelines = useCallback(async () => {
    setLoadingTilapia(true);
    setLoadingLettuce(true);
    setTimelineError(null);

    try {
      const [tilapiaRes, lettuceRes] = await Promise.allSettled([
        fetch(DEFAULT_FISH_API, { cache: "no-store" }),
        fetch(DEFAULT_LETTUCE_API, { cache: "no-store" }).catch(() => null), // lettuce may not exist
      ]);

      // tilapia
      if (tilapiaRes.status === "fulfilled") {
        try {
          const data = await tilapiaRes.value.json();
          // ensure array
          setTilapiaBatches(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Tilapia parse error:", err);
          setTimelineError("Failed to parse tilapia timeline data");
          setTilapiaBatches([]);
        }
      } else {
        console.error("Tilapia fetch failed:", tilapiaRes.reason);
        setTimelineError((prev) => prev ?? "Failed to fetch tilapia timeline");
        setTilapiaBatches([]);
      }

      // lettuce (optional)
      if (lettuceRes && lettuceRes.status === "fulfilled" && lettuceRes.value) {
        try {
          const data = await lettuceRes.value.json();
          setLettuceBatches(Array.isArray(data) ? data : []);
        } catch (err) {
          console.warn("Lettuce parse error:", err);
          setLettuceBatches([]);
        }
      } else {
        // no lettuce endpoint - fallback to static or empty
        setLettuceBatches([]);
      }
    } finally {
      setLoadingTilapia(false);
      setLoadingLettuce(false);
    }
  }, []);

  // Sensor fetcher (every 6 seconds)
  const fetchSensorData = useCallback(async () => {
    try {
      const res = await fetch("/api/arduino/send-data", { cache: "no-store" });
      if (!res.ok) throw new Error("Sensor endpoint error");
      const json: SensorData = await res.json();

      const now = Date.now();
      const elapsed = now - (json.timestamp ?? 0);

      setConnectionStatus(elapsed < 20000 ? "Connected" : "Disconnected");
      setSensorData(json);
    } catch (err) {
      console.error("Error fetching sensor data:", err);
      setConnectionStatus("Disconnected");
      setSensorData(null);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchTimelines();
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 6000);
    return () => clearInterval(interval);
  }, [fetchTimelines, fetchSensorData]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
          <p className="text-muted-foreground">Monitor your aquaponics system in real-time</p>
        </div>

        <Separator className="mb-6" />

        {/* Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Timeline (Lettuce & Tilapia)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lettuce Timeline (uses lettuceBatches if API available, otherwise static example) */}
                <StageTimeline
                  title="Lettuce"
                  stageDef={LETTUCE_STAGES}
                  apiUrl={DEFAULT_LETTUCE_API}
                  typeKey="lettuce"
                  batchesProp={lettuceBatches.length ? lettuceBatches : undefined}
                />

                {/* Tilapia Timeline */}
                <StageTimeline
                  title="Tilapia"
                  stageDef={TILAPIA_STAGES}
                  apiUrl={DEFAULT_FISH_API}
                  typeKey="tilapia"
                  batchesProp={tilapiaBatches.length ? tilapiaBatches : undefined}
                />
              </div>
              {/* quick load/error indicators */}
              <div className="mt-2 text-sm text-muted-foreground">
                {loadingTilapia || loadingLettuce ? <span>Loading timelines…</span> : null}
                {timelineError ? <span className="text-red-600 ml-2">{timelineError}</span> : null}
              </div>
            </div>
          </TabsContent>

          {/* Water Quality Tab */}
          <TabsContent value="water-quality" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Water Quality Parameters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ParameterCard
                  name="pH Level"
                  value={sensorData?.ph ?? "Loading..."}
                  status={determinePHStatus(sensorData?.ph)}
                  icon={<Droplets />}
                />
                <ParameterCard
                  name="Turbidity"
                  value={sensorData?.turbid ?? "Loading..."}
                  status={determineTurbidityStatus(sensorData?.turbid)}
                  icon={<FlaskConical />}
                />
                {/* Example placeholder for Temperature, replace if you have temp sensor */}
                <ParameterCard
                  name="Temperature"
                  value="24.5°C"
                  status="Normal"
                  icon={<Thermometer />}
                />
              </div>
            </div>
          </TabsContent>

          {/* Feeder Tab */}
          <TabsContent value="feeder" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Automatic Feeder Status</h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Next Feed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">07:00 AM</TableCell>
                        <TableCell>250g</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">12:00 PM</TableCell>
                        <TableCell>200g</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">05:00 PM</TableCell>
                        <TableCell>250g</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-blue-700 border-blue-300">
                            <Clock className="w-3 h-3 mr-1" />
                            Scheduled
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-blue-600">1h 23m</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sensors Tab */}
          <TabsContent value="sensors" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">System Sensors</h2>
              <div className="mb-4 font-medium">
                Device Status:{" "}
                {connectionStatus === "Connected" ? (
                  <span className="text-green-600">✅ Connected</span>
                ) : (
                  <span className="text-red-600">❌ Disconnected</span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SensorCard
                  name="pH Level"
                  value={sensorData?.ph ?? "Loading..."}
                  icon={<Droplets />}
                />
                <SensorCard
                  name="Turbidity"
                  value={sensorData?.turbid ?? "Loading..."}
                  icon={<FlaskConical />}
                />
                {/* Example: Temperature sensor (replace with real if available) */}
                <SensorCard
                  name="Temperature"
                  value="24.5°C"
                  icon={<Thermometer />}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* -----------------------
   Smaller UI components
   ----------------------- */

function ParameterCard({ name, value, status, icon }: {
  name: string;
  value: string;
  status: string;
  icon: React.ReactNode;
}) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "Low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {name}
          <div className="text-muted-foreground">{icon}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{value}</div>
        <Badge variant="outline" className={getStatusVariant(status)}>
          {status}
        </Badge>
      </CardContent>
    </Card>
  );
}

function SensorCard({ name, value, icon }: { name: string; value: string; icon?: React.ReactNode }) {
  // Consider "N/A", "Loading...", "", or null/undefined as offline
  const isOnline = value !== undefined && value !== null && value !== "N/A" && value !== "Loading..." && value !== "";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-center gap-2">
          {icon}
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-lg font-semibold mb-1">Last Reading: {value}</div>
        {isOnline ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800 inline-flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
            Online
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-red-100 text-red-800 inline-flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
            Offline
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function determinePHStatus(ph?: string): string {
  if (!ph) return "Unknown";
  const pHNum = parseFloat(ph);
  if (isNaN(pHNum)) return "Unknown";
  if (pHNum < 6.5) return "Low";
  if (pHNum > 7.5) return "High";
  return "Normal";
}

function determineTurbidityStatus(turbid?: string): string {
  if (!turbid) return "Unknown";
  const turbidNum = parseFloat(turbid);
  if (isNaN(turbidNum)) return "Unknown";
  if (turbidNum > 5) return "High";      // example threshold
  if (turbidNum < 1) return "Low";       // example threshold
  return "Normal";
}
