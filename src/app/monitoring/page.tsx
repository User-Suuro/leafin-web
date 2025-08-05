"use client";

import { Sidebar } from "@/components/sidebar";
import {
  HeartPulse,
  LayoutDashboard,
  ClipboardList,
  HandCoins,
  BarChart,
  Settings,
  Thermometer,
  FlaskConical,
  Droplets,
  Lightbulb,
  Clock,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Progress } from "@/shadcn/ui/progress";
import { Separator } from "@/shadcn/ui/separator";

export default function Monitoring() {
  const tabs = [
    { id: "timeline", label: "Timeline" },
    { id: "water-quality", label: "Water Quality" },
    { id: "fertilizer", label: "Fertilizer" },
    { id: "feeder", label: "Feeder" },
    { id: "sensors", label: "Sensors" },
  ];

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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-green-500" />
                      Lettuce Timeline
                    </CardTitle>
                    <CardDescription>Growth progress and milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Timeline content will be displayed here</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-blue-500" />
                      Tilapia Timeline
                    </CardTitle>
                    <CardDescription>Fish health and feeding schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Timeline content will be displayed here</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Water Quality Tab */}
          <TabsContent value="water-quality" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Water Quality Parameters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ParameterCard name="pH Level" value="5.1" status="Low" icon={<Droplets />} />
                <ParameterCard name="Ammonia" value="1.2 ppm" status="High" icon={<FlaskConical />} />
                <ParameterCard name="Dissolved Oxygen" value="6.8 mg/L" status="Normal" icon={<Droplets />} />
                <ParameterCard name="Temperature" value="24.5°C" status="Normal" icon={<Thermometer />} />
              </div>
            </div>
          </TabsContent>

          {/* Fertilizer Tab */}
          <TabsContent value="fertilizer" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Fertilizer Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <NutrientCard name="Nitrogen" value={75} color="blue" />
                <NutrientCard name="Phosphorus" value={60} color="green" />
                <NutrientCard name="Potassium" value={45} color="yellow" />
                <NutrientCard name="Calcium" value={88} color="purple" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SensorCard name="Temperature" value="24.5°C" icon={<Thermometer />} />
                <SensorCard name="pH Level" value="5.1" icon={<Droplets />} />
                <SensorCard name="Dissolved Oxygen" value="6.8 mg/L" icon={<Droplets />} />
                <SensorCard name="Ammonia" value="1.2 ppm" icon={<FlaskConical />} />
                <SensorCard name="Light Intensity" value="18500 lux" icon={<Lightbulb />} />
                <SensorCard name="Water Level" value="92%" icon={<Droplets />} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Reusable UI components using shadcn

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

function NutrientCard({ name, value, color }: {
  name: string;
  value: number;
  color: string;
}) {
  const getColorClass = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-600";
      case "green": return "text-green-600";
      case "yellow": return "text-yellow-600";
      case "purple": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${getColorClass(color)}`}>
              {value}%
            </span>
          </div>
          <Progress value={value} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function SensorCard({ name, value, icon }: {
  name: string;
  value: string;
  icon?: React.ReactNode;
}) {
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
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          Online
        </Badge>
      </CardContent>
    </Card>
  );
}