import Link from "next/link";
import React from "react";
import { LayoutDashboard } from "lucide-react";


export default function RootLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-20 bg-blue-700 flex flex-col items-center py-5">
        <div className="w-14 h-14 bg-blue-900 mb-10"></div>

        <Link href="/dashboard">
          <div className="w-full h-14 flex justify-center items-center text-white text-2xl mb-2 cursor-pointer hover:bg-blue-600 bg-blue-500">
            <LayoutDashboard className="w-6 h-6" />
          </div>
        </Link>

        <Link href="/monitoring">
          <div className="w-full h-14 flex justify-center items-center text-white text-2xl mb-2 cursor-pointer hover:bg-blue-600">
            <i className="fas fa-heartbeat"></i>
          </div>
        </Link>
        <div className="w-full h-14 flex justify-center items-center text-white text-2xl mb-2 cursor-pointer hover:bg-blue-600">
          <i className="fas fa-clipboard-list"></i>
        </div>
        <div className="w-full h-14 flex justify-center items-center text-white text-2xl mb-2 cursor-pointer hover:bg-blue-600">
          <i className="fas fa-hand-holding-usd"></i>
        </div>
        <div className="w-full h-14 flex justify-center items-center text-white text-2xl mb-2 cursor-pointer hover:bg-blue-600">
          <i className="fas fa-chart-bar"></i>
        </div>

        <div className="w-full h-14 mt-auto flex justify-center items-center text-white text-2xl cursor-pointer hover:bg-blue-600">
          <i className="fas fa-cog"></i>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Growth Overview</h1>
          <div className="h-0.5 bg-gray-300 mt-1"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Lettuce Card */}
          <div className="bg-white rounded-lg shadow p-5 border-t-4 border-green-500">
            <div className="flex items-center mb-4 relative">
              <div className="w-12 h-12 flex justify-center items-center mr-4">
                <img src="lettuce-icon.svg" alt="Lettuce" className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Lettuce</h2>
              <button className="absolute right-0 text-blue-600 text-sm hover:underline">
                View Details
              </button>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <div className="flex flex-col gap-1">
                <span>Total Batches: <strong className="text-gray-800 font-medium">2</strong></span>
                <span>Avg Age: <strong className="text-green-500 font-medium">18 days</strong></span>
              </div>
              <div className="flex flex-col gap-1">
                <span>Total Plants: <strong className="text-gray-800 font-medium">10</strong></span>
                <span>Majority Stage: <strong className="text-green-500 font-medium">Vegetative</strong></span>
              </div>
            </div>
          </div>

          {/* Tilapia Card */}
          <div className="bg-white rounded-lg shadow p-5 border-t-4 border-blue-500">
            <div className="flex items-center mb-4 relative">
              <div className="w-12 h-12 flex justify-center items-center mr-4">
                <img src="tilapia-icon.svg" alt="Tilapia" className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Tilapia</h2>
              <button className="absolute right-0 text-blue-600 text-sm hover:underline">
                View Details
              </button>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <div className="flex flex-col gap-1">
                <span>Total Fish: <strong className="text-gray-800 font-medium">5</strong></span>
                <span>Avg Age: <strong className="text-blue-500 font-medium">25 days</strong></span>
              </div>
              <div className="flex flex-col gap-1">
                <span>&nbsp;</span>
                <span>Majority Stage: <strong className="text-blue-500 font-medium">Juvenile</strong></span>
              </div>
            </div>
          </div>

          {/* Alerts Card */}
          <div className="bg-white rounded-lg shadow p-5 col-span-1 lg:col-span-1 lg:row-span-2 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Alerts</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center border-b border-gray-100 pb-2">
                <span className="mr-2">⚠️</span>
                <span>Tilapia: <span className="text-red-500 font-medium">Ammonia = 1.2 ppm</span></span>
              </li>
              <li className="flex items-center border-b border-gray-100 pb-2">
                <span className="mr-2">⚠️</span>
                <span>Lettuce Batch 3: <span className="text-red-500 font-medium">pH too low (5.1)</span></span>
              </li>
              <li className="flex items-center border-b border-gray-100 pb-2">
                <span className="mr-2">⚠️</span>
                <span>Tilapia: <span className="text-red-500 font-medium">Ammonia = 1.2 ppm</span></span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span>Lettuce Batch 3: <span className="text-red-500 font-medium">pH too low (5.1)</span></span>
              </li>
            </ul>
          </div>

          {/* Lettuce Chart */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lettuce Stage Distribution</h2>
            <div className="h-56 relative">
              <canvas id="lettuceChart" className="w-full h-full"></canvas>
            </div>
            <div className="flex justify-center mt-4 text-sm">
              <div className="flex items-center mx-4">
                <span className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></span>
                Vegetative
              </div>
              <div className="flex items-center mx-4">
                <span className="w-4 h-4 rounded-full bg-green-600 mr-2"></span>
                Mature
              </div>
            </div>
          </div>

          {/* Tilapia Chart */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tilapia Stage Distribution</h2>
            <div className="h-56 relative">
              <canvas id="tilapiaChart" className="w-full h-full"></canvas>
            </div>
            <div className="flex justify-center mt-4 text-sm">
              <div className="flex items-center mx-4">
                <span className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></span>
                Juvenile
              </div>
              <div className="flex items-center mx-4">
                <span className="w-4 h-4 rounded-full bg-blue-600 mr-2"></span>
                Adult
              </div>
            </div>
          </div>

          {/* Tilapia Batch Highlight */}
          <div className="bg-white rounded-lg shadow p-5 col-span-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tilapia Batch Highlight</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="text-left p-3">Batch ID</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">T-01</td>
                  <td className="p-3 flex items-center text-green-600"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>Healthy & Growing</td>
                  <td className="p-3">5 heads fully mature</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">T-01</td>
                  <td className="p-3 flex items-center text-yellow-600"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>Ammonia High</td>
                  <td className="p-3">Sensor reading: 1.2 ppm</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Lettuce Batch Highlight */}
          <div className="bg-white rounded-lg shadow p-5 col-span-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lettuce Batch Highlight</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="text-left p-3">Batch ID</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">L-01</td>
                  <td className="p-3 flex items-center text-green-600"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>Healthy & Growing</td>
                  <td className="p-3">5 heads fully mature</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">L-01</td>
                  <td className="p-3 flex items-center text-yellow-600"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>pH Too Low</td>
                  <td className="p-3">Sensor reading: 5.1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
