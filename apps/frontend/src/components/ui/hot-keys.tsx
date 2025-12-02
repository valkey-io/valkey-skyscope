import React, { useState } from "react"
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import * as R from "ramda"

type SortOrder = "asc" | "desc"

interface HotKeysProps {
  data: [string, number][] | null
  status?: string
}

export function HotKeys({ data, status }: HotKeysProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const toggleSortOrder = () => {
    setSortOrder((prev) => prev === "asc" ? "desc" : "asc")
  }

  const sortedHotKeys = R.sort<[string, number]>(
    (sortOrder === "asc" ? R.ascend : R.descend)(R.nth(1) as (tuple: [string, number]) => number),
    R.defaultTo([], data),
  )

  // loader while the hotkeys are getting fetched
  if (status === "Pending") {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-tw-primary" size={32} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Loading hot keys...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 rounded overflow-y-auto">
        {sortedHotKeys.length > 0 ? (
          <div className="h-full w-full flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-neutral-900 border-b dark:border-neutral-700 p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300 w-64">
                  Key Name
                </span>
                <button
                  className="text-sm font-semibold text-gray-700 dark:text-neutral-300 w-32 flex items-center gap-2 hover:text-tw-primary"
                  onClick={toggleSortOrder}
                >
                  Access Count
                  {sortOrder === "asc" ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="">
                {sortedHotKeys.map(([keyName, count], index) => (
                  <div
                    className="flex items-center gap-4 border-b dark:border-neutral-700 py-2 hover:bg-tw-primary/10"
                    key={`${keyName}-${index}`}
                  >
                    <div className="w-64 ml-4">
                      <span className="text-sm text-tw-primary bg-tw-primary/20 px-2 py-1 font-mono rounded">
                        {keyName}
                      </span>
                    </div>
                    <span className="text-sm text-gray-800 dark:text-neutral-200 w-32 font-mono text-center">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-lg text-gray-500 dark:text-white mb-2">
              No Hot Keys Found
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
