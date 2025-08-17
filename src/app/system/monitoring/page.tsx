"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import {
  Thermometer,
  FlaskConical,
  Droplets,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Separator } from "@/shadcn/ui/separator";
import { StageTimeline, TILAPIA_STAGES, LETTUCE_STAGES, TimelineEvent } from "@/components/monitoring/StageTimeline";
import { WaterQuality } from "@/components/monitoring/WaterQuality";
import { SensorCard } from "@/components/monitoring/SensorCard";
import FeederStatus from "@/components/monitoring/FeederStatus";


interface SensorData {
  time?: string;
  date?: string;
  ph?: string;
  turbid?: string;
  timestamp: number;
}


const DEFAULT_FISH_API = "/api/fish-batch/timeline";
const DEFAULT_LETTUCE_API = "/api/plant-batch/timeline"; 

// interface FishBatch {
//   fishBatchId?: number;
//   date?: string;
//   dateAdded?: string | Date;
//   fishDays?: number;
//   fishQuantity?: number;
//   condition?: string;
//   event?: string;
//   status?: string;
// }

// interface PlantBatch {
//   plantBatchId?: number;
//   date?: string;
//   dateAdded?: string | Date;
//   plantDays?: number;
//   plantQuantity?: number;
//   condition?: string;
//   event?: string;
//   status?: string;
// }


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

      // lettuce 
      if (lettuceRes && lettuceRes.status === "fulfilled" && lettuceRes.value) {
        try {
          const json = await lettuceRes.value.json();
          setLettuceBatches(Array.isArray(json.data) ? json.data : []);
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
          <WaterQuality sensorData={sensorData} />
        </TabsContent>

          {/* Feeder Tab */}
          <TabsContent value="feeder" className="space-y-6">
            <FeederStatus />
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

