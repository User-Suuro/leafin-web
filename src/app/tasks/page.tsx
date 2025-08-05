"use client";

import { Sidebar } from "@/components/sidebar";
import { CalendarCheck, ClipboardList } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Card } from "@/shadcn/ui/card";
import { Separator } from "@/shadcn/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shadcn/ui/select";

export default function TaskManagement() {
  const tasks = [
    {
      title: "Clean Tank",
      description: "Team 1 will clean the tank especially those algae that's growing",
      category: "Cleaning",
      date: "April 11, 2004",
    },
    {
      title: "Clean Tank",
      description: "Team 1 will clean the tank especially those algae that's growing",
      category: "Cleaning",
      date: "April 11, 2004",
    },
    {
      title: "Clean Tank",
      description: "Team 1 will clean the tank especially those algae that's growing",
      category: "Cleaning",
      date: "April 11, 2004",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white">
        <h1 className="text-3xl font-bold mb-2">Task Management</h1>
        <Separator className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Add New Task Form */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <CalendarCheck className="text-blue-500 w-6 h-6" />
              <h2 className="text-xl font-semibold">Add New Task</h2>
            </div>

            <div className="border rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Title:</label>
                  <Input placeholder="Enter Task Title" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description:</label>
                  <Textarea placeholder="Enter Description" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category:</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="feeding">Feeding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="block text-sm font-medium">Schedule:</label>
                  <CalendarCheck className="w-5 h-5 text-blue-500" />
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="secondary">Clear</Button>
                  <Button>Add</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Tasks */}
          <div className="flex-1">
            <div className="bg-blue-400 rounded-xl p-4 text-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">On going</h2>
                <span className="text-sm">▼</span>
              </div>

              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow text-black">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm">{task.description}</p>
                    <p className="text-blue-600 font-medium text-sm mt-1">{task.category}</p>
                    <p className="text-xs text-gray-500">{task.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
