"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Thermometer,
  FlaskConical,
  Droplets,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Separator } from "@/shadcn/ui/separator";
import { StageTimeline, TILAPIA_STAGES, LETTUCE_STAGES, TimelineEvent } from "@/components/system/monitoring/stage-timeline";
import { SensorCard } from "@/components/system/monitoring/sensor-card";
import FeederStatus from "@/components/system/monitoring/feeder-status";
import { SensorData } from "@/types/sensor-values";


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


  // initial load
  useEffect(() => {

    fetchTimelines();
  }, [fetchTimelines]);

  return (
    <div className="flex min-h-screen">
     
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
              
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

