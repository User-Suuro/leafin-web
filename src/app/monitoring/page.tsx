import React from "react";
import {
  Home,
  Thermometer,
  Droplet,
  Rss,
  Leaf,
  BarChart,
  CircleUserRound,
  LogOut,
  CalendarDays,
  Clock,
  Flame,
} from "lucide-react";

const MonitoringDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-700 text-white p-5 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold mb-8">🌿 Leafin Things</div>
          <nav className="space-y-4">
            <div className="flex items-center space-x-3 hover:text-gray-200 cursor-pointer">
              <Home size={20} />
              <span>Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 hover:text-gray-200 cursor-pointer">
              <BarChart size={20} />
              <span>Analytics</span>
            </div>
            <div className="flex items-center space-x-3 hover:text-gray-200 cursor-pointer">
              <Leaf size={20} />
              <span>Plants</span>
            </div>
            <div className="flex items-center space-x-3 hover:text-gray-200 cursor-pointer">
              <Droplet size={20} />
              <span>Water</span>
            </div>
            <div className="flex items-center space-x-3 hover:text-gray-200 cursor-pointer">
              <Rss size={20} />
              <span>Sensors</span>
            </div>
          </nav>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-200">
            <CircleUserRound size={20} />
            <span>Profile</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-200">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Monitoring Dashboard</h1>

        {/* Top cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Temperature</span>
              <Thermometer className="text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-2">27°C</div>
          </div>
          <div className="bg-white shadow rounded p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">pH Level</span>
              <Droplet className="text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-2">6.8</div>
          </div>
          <div className="bg-white shadow rounded p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Water Flow</span>
              <Rss className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-2">Normal</div>
          </div>
          <div className="bg-white shadow rounded p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Ammonia</span>
              <Flame className="text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-2">0.25 ppm</div>
          </div>
        </div>

        {/* Timeline + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Monitoring Timeline</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mt-1.5 w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="ml-4">
                  <p className="text-gray-700">Sensor readings updated</p>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <CalendarDays size={14} /> Aug 5
                    <Clock size={14} /> 10:30 AM
                  </div>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mt-1.5 w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="ml-4">
                  <p className="text-gray-700">Water temperature stabilized</p>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <CalendarDays size={14} /> Aug 4
                    <Clock size={14} /> 4:20 PM
                  </div>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mt-1.5 w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="ml-4">
                  <p className="text-gray-700">pH sensor calibrated</p>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <CalendarDays size={14} /> Aug 4
                    <Clock size={14} /> 9:15 AM
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Water Quality Trends</h2>
            <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              {/* Replace this with actual Chart.js component */}
              <p>Chart.js graph here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
