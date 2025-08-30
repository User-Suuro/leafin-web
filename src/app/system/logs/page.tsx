"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/shadcn/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { History, ClipboardList, DollarSign, Activity } from "lucide-react";

// Types
type Log = {
  log_id: number;
  event_time: string;
  notes: string;
  type: "task" | "fish_sale" | "plant_sale" | "sensor";
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  // Dummy fetch – replace with API later
  useEffect(() => {
    setLogs([
      {
        log_id: 1,
        event_time: "2025-08-30 10:15:00",
        notes: "Feeding task completed",
        type: "task",
      },
      {
        log_id: 2,
        event_time: "2025-08-29 15:42:00",
        notes: "Sold 20 Tilapia from Batch #3",
        type: "fish_sale",
      },
      {
        log_id: 3,
        event_time: "2025-08-28 09:00:00",
        notes: "pH sensor detected abnormal reading",
        type: "sensor",
      },
    ]);
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="w-6 h-6" />
            System Logs
          </h1>
          <Separator className="mt-1" />
        </header>

        {/* Quick Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {logs.filter((l) => l.type === "task").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {logs.filter((l) => l.type.includes("sale")).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" />
                Sensors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {logs.filter((l) => l.type === "sensor").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{logs.length}</p>
            </CardContent>
          </Card>
        </section>

        {/* Logs List */}
        <section>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="task">Tasks</TabsTrigger>
              <TabsTrigger value="sale">Sales</TabsTrigger>
              <TabsTrigger value="sensor">Sensors</TabsTrigger>
            </TabsList>

            {/* All logs */}
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.log_id}>
                          <TableCell>{log.event_time}</TableCell>
                          <TableCell>{log.type}</TableCell>
                          <TableCell>{log.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Example for tasks only */}
            <TabsContent value="task">
              <Card>
                <CardHeader>
                  <CardTitle>Task Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {logs
                      .filter((log) => log.type === "task")
                      .map((log) => (
                        <li
                          key={log.log_id}
                          className="p-3 rounded border bg-muted/30"
                        >
                          <p className="text-sm">{log.notes}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.event_time}
                          </p>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Example for sensors only */}
            <TabsContent value="sensor">
              <Card>
                <CardHeader>
                  <CardTitle>Sensor Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {logs
                      .filter((log) => log.type === "sensor")
                      .map((log) => (
                        <li
                          key={log.log_id}
                          className="p-3 rounded border bg-muted/30"
                        >
                          <p className="text-sm">{log.notes}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.event_time}
                          </p>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
