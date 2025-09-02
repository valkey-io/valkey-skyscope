import { Cog } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-4 relative min-h-screen flex flex-col">
      {/* top header */}
      <div className="flex items-center justify-between h-10">
        <h1 className="text-xl font-bold flex items-center gap-2 text-gray-700">
           <Cog /> Settings
        </h1>
      </div>
    </div>
  );
}
