import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Activity, ArrowUp, ArrowDown, RefreshCcw } from "lucide-react"
import * as R from "ramda"
import { useParams } from "react-router"
import { AppHeader } from "./ui/app-header"
import type { RootState } from "@/store"
import { slowLogsRequested, selectSlowLogs } from "@/state/valkey-features/slowlogs/slowLogsSlice"
import { useAppDispatch } from "@/hooks/hooks"

type TabType = "hot-keys" | "large-keys" | "slow-logs"
type SortOrder = "asc" | "desc"

export const Monitoring = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<TabType>("hot-keys")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const slowLogsData = useSelector((state: RootState) => selectSlowLogs(id!)(state))

  const getSlowLogs = () => {
    if (id) {
      dispatch(slowLogsRequested({ connectionId : id }))
    }
  }

  useEffect(() => {
    getSlowLogs()
  }, [id, dispatch])

  const tabs = [
    { id: "hot-keys" as TabType, label: "Hot Keys" },
    { id: "large-keys" as TabType, label: "Large Keys" },
    { id: "slow-logs" as TabType, label: "Slow Logs" },
  ]

  const toggleSortOrder = () => {
    setSortOrder((prev) => prev === "asc" ? "desc" : "asc")
  }

  const sortedSlowLogs = R.defaultTo([], slowLogsData).flatMap((logGroup) =>
    logGroup.values.map((entry) => ({
      ...entry,
      groupTs: logGroup.ts,
    })),
  ).sort((a, b) => {
    const timestampA = a.ts
    const timestampB = b.ts
    return sortOrder === "asc" ? timestampA - timestampB : timestampB - timestampA
  })

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
          <div className="h-full flex items-center justify-center">
            <span className="text-lg text-gray-500 dark:text-white mb-2">
              No Hot Keys Found
            </span>
          </div>
        )}
        {activeTab === "large-keys" && (
          <div className="h-full flex items-center justify-center">
            <span className="text-lg text-gray-500 dark:text-white mb-2">
              No Large Keys Found
            </span>
          </div>
        )}

        {activeTab === "slow-logs" && (
          <div className="h-full w-full flex flex-col">
            {sortedSlowLogs.length > 0 ? (
              <div className="h-full w-full flex flex-col">
                {/* Header */}
                <div className="bg-white dark:bg-neutral-900 border-b dark:border-neutral-700 p-4">
                  <div className="flex items-center gap-4">
                    <button
                      className="text-sm font-semibold text-gray-700 dark:text-neutral-300 w-45 flex items-center gap-2 hover:text-tw-primary"
                      onClick={toggleSortOrder}
                    >
                      Timestamp
                      {sortOrder === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )}
                    </button>
                    <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300 w-24">
                      Duration
                    </span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300 flex-1">
                      Command
                    </span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300 w-40">
                      Client Address
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-4">
                    {sortedSlowLogs.map((entry, index) => (
                      <div
                        className="flex items-center gap-4 border-b dark:border-neutral-700 py-1 hover:bg-tw-primary/10"
                        key={`${entry.groupTs}-${entry.id}-${index}`}
                      >
                        <span className="text-sm text-gray-600 dark:text-neutral-400 w-45">
                          {new Date(entry.ts).toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-800 dark:text-neutral-200 w-24 font-mono">
                          {entry.duration_us} µs
                        </span>
                        <div className="flex-1">
                          <code className="text-sm text-tw-primary bg-tw-primary/20 px-2 py-1 rounded">
                            {entry.argv.join(" ")}
                          </code>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-neutral-400 w-40 font-mono">
                          {entry.addr}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-lg text-gray-500 dark:text-white mb-2">
                  No Slow Logs Found
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

  )
}
