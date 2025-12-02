import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Activity, RefreshCcw } from "lucide-react"
import { useParams } from "react-router"
import { AppHeader } from "./ui/app-header"
import { HotKeys } from "./ui/hot-keys"
import { SlowLogs } from "./ui/slow-logs"
import type { RootState } from "@/store"
import { slowLogsRequested, selectSlowLogs } from "@/state/valkey-features/slowlogs/slowLogsSlice"
import { useAppDispatch } from "@/hooks/hooks"
import { hotKeysRequested, selectHotKeys, selectHotKeysStatus } from "@/state/valkey-features/hotkeys/hotKeysSlice"

type TabType = "hot-keys" | "large-keys" | "slow-logs"

export const Monitoring = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<TabType>("hot-keys")

  const slowLogsData = useSelector((state: RootState) => selectSlowLogs(id!)(state))
  const hotKeysData = useSelector((state: RootState) => selectHotKeys(id!)(state))
  const hotKeysStatus = useSelector((state: RootState) => selectHotKeysStatus(id!)(state))

  useEffect(() => {
    if (id) {
      dispatch(slowLogsRequested({ connectionId: id }))
      dispatch(hotKeysRequested({ connectionId: id }))
    }
  }, [id, dispatch])
  
  const getSlowLogs = () => {
    if (id) {
      dispatch(slowLogsRequested({ connectionId: id }))
    }
  }

  const tabs = [
    { id: "hot-keys" as TabType, label: "Hot Keys" },
    { id: "large-keys" as TabType, label: "Large Keys" },
    { id: "slow-logs" as TabType, label: "Slow Logs" },
  ]

  return (
    <div className="flex flex-col h-screen p-4">
      <AppHeader icon={<Activity size={20} />} title="Monitoring" />

      <div className="flex justify-between mr-2">
        {/* Tab Navigation */}
        <div className="">
          <nav className="flex gap-x-1" role="tablist">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  aria-selected={isActive}
                  className={`py-3 px-2 inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap transition-colors
                            ${isActive
                  ? "border-tw-primary text-tw-primary"
                  : "border-transparent hover:text-tw-primary text-gray-400"
                }
                        `}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                >
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
        {activeTab === "slow-logs" && (
          <button
            className="flex items-center gap-2 font-light"
            onClick={getSlowLogs}
          >
            Refresh <RefreshCcw className="hover:text-tw-primary" size={15} />
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 border dark:border-tw-dark-border rounded overflow-y-auto">
        {activeTab === "hot-keys" && (
          <HotKeys data={hotKeysData} status={hotKeysStatus} />
        )}
        {activeTab === "large-keys" && (
          <div className="h-full flex items-center justify-center">
            <span className="text-lg text-gray-500 dark:text-white mb-2">
              No Large Keys Found
            </span>
          </div>
        )}

        {activeTab === "slow-logs" && (
          <SlowLogs data={slowLogsData}/>
        )}
      </div>
    </div>

  )
}
