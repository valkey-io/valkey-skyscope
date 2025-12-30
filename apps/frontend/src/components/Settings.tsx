import { Cog, ToggleLeft, ToggleRight, Save } from "lucide-react"
import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import ThemeToggle from "./ui/theme-toggle"
import { selectConfig, updateConfig } from "@/state/valkey-features/config/configSlice"
import { useAppDispatch } from "@/hooks/hooks"

export default function Settings() {
  const { id, clusterId } = useParams()
  const config = useSelector(selectConfig(id!))
  console.log(config)
  const dispatch = useAppDispatch()

  const [monitorEnabled, setMonitorEnabled] = useState(config.monitoring.monitorEnabled)

  useEffect(() => {
    setMonitorEnabled(config.monitoring.monitorEnabled)
  }, [config.monitoring.monitorEnabled])

  const hasChanges = monitorEnabled !== config.monitoring.monitorEnabled

  const handleSave = () => {
    dispatch(updateConfig({ connectionId:id!, clusterId, config: { monitoring: { monitorEnabled }  } }))
  }
  return (
    <div className="p-4 relative min-h-screen flex flex-col">
      {/* top header */}
      <div className="flex items-center justify-between h-10">
        <h1 className="text-xl font-bold flex items-center gap-2 text-gray-700 dark:text-white">
          <Cog /> Settings
        </h1>
      </div>
      <div className="mt-10 pl-1">
        <h2 className="border-b-1 pb-1 dark:border-tw-dark-border font-medium text-tw-primary">Appearance</h2>
        <ThemeToggle />
      </div>
      {/* monitoring */}
      <div className="mt-10 pl-1">
        <h2 className="border-b pb-1 font-medium text-tw-primary">
          Monitoring
        </h2>

        <div className="flex items-center justify-between mt-4">
          <span>Enable Monitoring</span>

          <button
            aria-label="Toggle monitoring"
            className="flex items-center gap-2"
            onClick={() => setMonitorEnabled((prev) => !prev)}
            type="button"
          >
            {monitorEnabled ? (
              <ToggleRight className="text-green-500" />
            ) : (
              <ToggleLeft className="text-gray-400" />
            )}
            <span className="text-sm">
              {monitorEnabled ? "On" : "Off"}
            </span>
          </button>
        </div>
      </div>
      
      {/* save button */}
      <button
        className="
          fixed bottom-6 right-6
          flex items-center gap-2
          px-4 py-2 rounded-md
          bg-tw-primary text-white
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-lg
        "
        disabled={!hasChanges}
        onClick={handleSave}
        type="button"
      >
        <Save size={16} />
        Save
      </button>
    </div>
  )
}

