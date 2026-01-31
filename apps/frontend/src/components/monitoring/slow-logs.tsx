import React, { useState } from "react"
import { ArrowUp, ArrowDown, Clock } from "lucide-react"
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
      {sortedSlowLogs.length > 0 ? (
        <>
          {/* Header */}
          <div className="sticky top-0 z-10 border-b-2 dark:border-tw-dark-border">
            <div className="flex items-center px-4 py-3">
              <button
                className="text-xs font-bold w-1/4 flex items-center gap-2 hover:text-tw-primary transition-colors"
                onClick={toggleSortOrder}
              >
                <Clock className="text-tw-primary" size={16} />
                Timestamp
                {sortOrder === "asc" ? (
                  <ArrowUp size={14} />
                ) : (
                  <ArrowDown size={14} />
                )}
              </button>
              <div className="text-xs font-bold w-1/6 text-center">
                Duration
              </div>
              <div className="text-xs font-bold flex-1">
                Command
              </div>
              <div className="text-xs font-bold w-1/5 text-center">
                Client Address
              </div>
            </div>
          </div>

          {/* Contents*/}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <tbody>
                {sortedSlowLogs.map((entry, index) => (
                  <tr
                    className="group border-b dark:border-tw-dark-border hover:bg-tw-primary/10"
                    key={`${entry.groupTs}-${entry.id}-${index}`}
                  >
                    {/* timestamp */}
                    <td className="px-4 py-2 w-1/4">
                      <span className="text-sm">
                        {new Date(entry.ts).toLocaleString()}
                      </span>
                    </td>

                    {/* duration */}
                    <td className="px-4 py-2 w-1/6 text-center">
                      <span className="inline-flex font-mono items-center text-sm bg-tw-primary/30 px-2 text-tw-primary rounded-full">
                        {entry.duration_us} µs
                      </span>
                    </td>

                    {/* command */}
                    <td className="px-4 py-2 flex-1">
                      <code className="text-sm font-mono text-tw-primary bg-tw-primary/20 px-3 py-1 rounded-full">
                        {entry.argv.join(" ")}
                      </code>
                    </td>

                    {/* client address */}
                    <td className="px-4 py-2 w-1/5 text-center">
                      <span className="text-sm font-mono">
                        {entry.addr}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center">
          <Clock className="mb-3 opacity-30" size={48} />
          <span className="text-lg font-medium">No Slow Logs Found</span>
          <span className="text-sm mt-1">Slow commands will appear here</span>
        </div>
      )}
    </div>
  )
}
