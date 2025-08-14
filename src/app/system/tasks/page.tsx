"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Separator } from "@/shadcn/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shadcn/ui/select";

type Task = {
  taskId: number;
  title: string;
  description: string | null;
  taskType: string;
  scheduledDate: string | null;
  status: string;
};

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: "",
    scheduledDate: "",
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/task-management");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit new task
  const handleAddTask = async () => {
    if (!formData.title || !formData.taskType) {
      alert("Title & category are required!");
      return;
    }

    try {
      await fetch("/api/task-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          taskType: formData.taskType,
          scheduledDate: formData.scheduledDate || null,
          scheduledTime: null,
          status: "pending",
          relatedFishBatchId: null,
          relatedPlantBatchId: null,
        }),
      });

      await fetchTasks(); // Refresh list after adding

      setFormData({
        title: "",
        description: "",
        taskType: "",
        scheduledDate: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-white">
        <h1 className="text-3xl font-bold mb-2">Task Management</h1>
        <Separator className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Add Task Form */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <CalendarCheck className="text-blue-500 w-6 h-6" />
              <h2 className="text-xl font-semibold">Add New Task</h2>
            </div>

            <div className="border rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Task Title:
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter Task Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description:
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter Description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category:
                </label>
                <Select
                  value={formData.taskType}
                  onValueChange={(value) => handleChange("taskType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="feeding">Feeding</SelectItem>
                    <SelectItem value="harvest">Harvest</SelectItem>
                    <SelectItem value="planting">Planting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Schedule Date:
                </label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    handleChange("scheduledDate", e.target.value)
                  }
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  onClick={() =>
                    setFormData({
                      title: "",
                      description: "",
                      taskType: "",
                      scheduledDate: "",
                    })
                  }
                >
                  Clear
                </Button>
                <Button onClick={handleAddTask}>Add</Button>
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
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div
                      key={task.taskId}
                      className="bg-white rounded-lg p-4 shadow text-black"
                    >
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm">{task.description}</p>
                      <p className="text-blue-600 font-medium text-sm mt-1">
                        {task.taskType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.scheduledDate || "No date"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/80">
                    No tasks available. Add one above.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
