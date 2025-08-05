import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Separator } from "@/shadcn/ui/separator";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Growth Overview</h1>
          <Separator className="mt-1 bg-gray-300" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Lettuce Card */}
          <Card className="border-t-4 border-green-500">
            <CardContent className="p-5">
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
                  <span>Total Batches: <strong className="text-gray-800">2</strong></span>
                  <span>Avg Age: <strong className="text-green-500">18 days</strong></span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>Total Plants: <strong className="text-gray-800">10</strong></span>
                  <span>Majority Stage: <strong className="text-green-500">Vegetative</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tilapia Card (Same structure) */}
          <Card className="border-t-4 border-blue-500">
            <CardContent className="p-5">
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
                  <span>Total Fish: <strong className="text-gray-800">5</strong></span>
                  <span>Avg Age: <strong className="text-blue-500">25 days</strong></span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>&nbsp;</span>
                  <span>Majority Stage: <strong className="text-blue-500">Juvenile</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Card */}
          <Card className="border-t-4 border-red-500 flex flex-col">
            <CardContent className="p-5 flex flex-col flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Alerts</h2>
              <ul className="space-y-3 text-sm overflow-y-auto max-h-40 pr-1">
                {[
                  "Tilapia: Ammonia = 1.2 ppm",
                  "Lettuce Batch 3: pH too low (5.1)",
                  "Tilapia: Ammonia = 1.2 ppm",
                  "Lettuce Batch 3: pH too low (5.1)",
                  "Tilapia: Ammonia = 1.2 ppm",
                  "Lettuce Batch 3: pH too low (5.1)",
                  "Tilapia: Ammonia = 1.2 ppm",
                  "Lettuce Batch 3: pH too low (5.1)",
                ].map((msg, i) => (
                  <li key={i} className="flex items-center border-b border-gray-100 pb-2">
                    <span className="mr-2">⚠️</span>
                    <span className="text-red-500 font-medium">{msg}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Lettuce Chart */}
        <Card>
          <CardContent className="p-5">
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
          </CardContent>
        </Card>

        {/* More Cards... (Tilapia Chart, Tilapia/Lettuce Batch Highlight) */}
        {/* Follow the same pattern using <Card> and <CardContent> */}
      </div>
    </div>
  );
}
