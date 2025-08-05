"use client";

import { useState } from "react";
import {
  HeartPulse,
  LayoutDashboard,
  ClipboardList,
  HandCoins,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Thermometer,
  FlaskConical,
  Droplets,
  Lightbulb,
} from "lucide-react";

export default function Monitoring() {
  const [activeTab, setActiveTab] = useState("timeline");

  const tabs = [
    { id: "timeline", label: "Timeline" },
    { id: "water-quality", label: "Water Quality" },
    { id: "fertilizer", label: "Fertilizer" },
    { id: "feeder", label: "Feeder" },
    { id: "sensors", label: "Sensors" },
  ];

  const isActive = (tabId: string) => activeTab === tabId;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-16 bg-blue-600 text-white flex flex-col items-center py-4 space-y-4">
        <LayoutDashboard className="w-6 h-6 cursor-pointer" />
        <HeartPulse className="w-6 h-6 cursor-pointer" />
        <ClipboardList className="w-6 h-6 cursor-pointer" />
        <HandCoins className="w-6 h-6 cursor-pointer" />
        <BarChart className="w-6 h-6 cursor-pointer" />
        <Settings className="w-6 h-6 mt-auto cursor-pointer" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-2">Monitoring</h1>
        <div className="h-1 bg-gray-300 mb-4" />

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded ${
                isActive(tab.id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "timeline" && (
            <div>
              {/* Example Timeline Content */}
              <h2 className="text-xl font-semibold mb-4">Timeline (Lettuce & Tilapia)</h2>
              {/* Replace with real components later */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded shadow">Lettuce Timeline</div>
                <div className="p-4 border rounded shadow">Tilapia Timeline</div>
              </div>
            </div>
          )}

          {activeTab === "water-quality" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Water Quality Parameters</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ParameterCard name="pH Level" value="5.1" status="Low"  />
                <ParameterCard name="Ammonia" value="1.2 ppm" status="High" icon={<FlaskConical />} />
                <ParameterCard name="Dissolved Oxygen" value="6.8 mg/L" status="Normal" icon={<Droplets />} />
                <ParameterCard name="Temperature" value="24.5°C" status="Normal" icon={<Thermometer />} />
              </div>
            </div>
          )}

          {activeTab === "fertilizer" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Fertilizer Management</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Gauge name="Nitrogen" value="75%" color="bg-blue-500" />
                <Gauge name="Phosphorus" value="60%" color="bg-green-500" />
                <Gauge name="Potassium" value="45%" color="bg-yellow-500" />
                <Gauge name="Calcium" value="88%" color="bg-purple-500" />
              </div>
            </div>
          )}

          {activeTab === "feeder" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Automatic Feeder Status</h2>
              <table className="w-full table-auto border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Next Feed</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center border-t">
                    <td className="px-4 py-2">07:00 AM</td>
                    <td className="px-4 py-2">250g</td>
                    <td className="px-4 py-2">Completed</td>
                    <td className="px-4 py-2">-</td>
                  </tr>
                  <tr className="text-center border-t">
                    <td className="px-4 py-2">12:00 PM</td>
                    <td className="px-4 py-2">200g</td>
                    <td className="px-4 py-2">Completed</td>
                    <td className="px-4 py-2">-</td>
                  </tr>
                  <tr className="text-center border-t">
                    <td className="px-4 py-2">05:00 PM</td>
                    <td className="px-4 py-2">250g</td>
                    <td className="px-4 py-2">Scheduled</td>
                    <td className="px-4 py-2">1h 23m</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "sensors" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">System Sensors</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <SensorCard name="Temperature" value="24.5°C" icon={<Thermometer />} />
                <SensorCard name="pH Level" value="5.1" icon={<Droplets />} />
                <SensorCard name="Dissolved Oxygen" value="6.8 mg/L" icon={<Droplets />} />
                <SensorCard name="Ammonia" value="1.2 ppm" icon={<FlaskConical />} />
                <SensorCard name="Light Intensity" value="18500 lux" icon={<Lightbulb />} />
                <SensorCard name="Water Level" value="92%" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable UI components

function ParameterCard({ name, value, status, icon }: any) {
  const statusColor =
    status === "Normal"
      ? "bg-green-500"
      : status === "Low"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="border p-4 rounded shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{name}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center mt-2 text-sm">
        <span className={`w-3 h-3 rounded-full mr-2 ${statusColor}`} />
        {status}
      </div>
    </div>
  );
}

function Gauge({ name, value, color }: any) {
  return (
    <div className="text-center">
      <div className={`w-24 h-24 rounded-full border-8 ${color} mx-auto mb-2`} />
      <div className="text-lg font-bold">{value}</div>
      <div className="text-sm text-gray-600">{name}</div>
    </div>
  );
}

function SensorCard({ name, value, icon }: any) {
  return (
    <div className="border p-4 rounded shadow text-center">
      <div className="mb-2 flex justify-center">{icon}</div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm">{`Last Reading: ${value}`}</p>
      <span className="text-green-600 font-medium">Online</span>
    </div>
  );
}
