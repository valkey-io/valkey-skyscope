import React, { useState } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import * as R from "ramda"

type SortOrder = "asc" | "desc"

interface SlowLogEntry {
  id: string
  ts: number
  duration_us: number
  argv: string[]
  addr: string
}

interface SlowLogGroup {
  ts: number
  metric: string
  values: SlowLogEntry[]
}

interface SlowLogsProps {
  data: SlowLogGroup[] | null
}

export function SlowLogs({ data }: SlowLogsProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const toggleSortOrder = () => {
    setSortOrder((prev) => prev === "asc" ? "desc" : "asc")
  }

  const sortedSlowLogs = R.defaultTo([], data)
    .flatMap((logGroup) =>
      logGroup.values.map((entry) => ({
        ...entry,
        groupTs: logGroup.ts,
      })),
    )
    .sort((sortOrder === "asc" ? R.ascend : R.descend)(R.prop("ts")))

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 rounded overflow-y-auto">
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
    </div>
  )
}
