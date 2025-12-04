import { Key, X } from "lucide-react"

interface BaseKeyInfo {
  name: string
  ttl: number
  size: number
  collectionSize?: number
}

interface ElementInfo {
  key: string
  value: string
}

type KeyInfo =
  | (BaseKeyInfo & { type: "string"; elements: string })
  | (BaseKeyInfo & { type: "hash"; elements: ElementInfo[] })
  | (BaseKeyInfo & { type: "list"; elements: string[] })
  | (BaseKeyInfo & { type: "set"; elements: string[] });

interface HotKeyContentsProps {
  selectedKey: string | null
  selectedKeyInfo: KeyInfo | null
  connectionId: string
  setSelectedKey: (key: string | null) => void
}

export function HotKeyContents({ selectedKey, selectedKeyInfo, setSelectedKey }: HotKeyContentsProps) {
  return (
    <div className="w-1/3 pl-2">
      <div className="h-full dark:border-tw-dark-border border rounded overflow-hidden">
        {selectedKey && selectedKeyInfo ? (
          <div className="h-full p-4 text-sm font-light overflow-y-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-2 border-b pb-4 border-tw-dark-border">
              <div>
                <span className="font-semibold flex items-center gap-2">
                  <Key size={16} />
                  {selectedKey}
                  <span className="ml-1 uppercase font-light text-xs bg-tw-primary rounded-full px-2 py-0.5 text-white">
                    {selectedKeyInfo.type}</span>
                </span>
              </div>
              <div className="space-x-2 flex items-center relative">
                <button
                  className="hover:text-tw-primary transition-colors"
                  onClick={() => setSelectedKey(null)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* show different key types */}
            {selectedKeyInfo.type === "string" && (
              <div className="flex items-center justify-center w-full p-4">
                <table className="table-auto w-full overflow-hidden">
                  <thead className="bg-tw-dark-border opacity-85 text-white">
                    <tr>
                      <th className="w-full py-3 px-4 text-left font-semibold">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 font-light dark:text-white">
                        <div className="whitespace-pre-wrap break-words">
                          {selectedKeyInfo.elements}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {selectedKeyInfo.type === "hash" && (
              <div className="flex items-center justify-center w-full p-4">
                <table className="table-auto w-full overflow-hidden">
                  <thead className="bg-tw-dark-border opacity-85 text-white">
                    <tr>
                      <th className="w-1/2 py-3 px-4 text-left font-semibold">
                        Key
                      </th>
                      <th className="w-1/2 py-3 px-4 text-left font-semibold">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedKeyInfo.elements.map((element, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                          {element.key}
                        </td>
                        <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                          {element.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {selectedKeyInfo.type === "list" && (
              <div className="flex items-center justify-center w-full p-4">
                <table className="table-auto w-full overflow-hidden">
                  <thead className="bg-tw-dark-border opacity-85 text-white">
                    <tr>
                      <th className="w-1/2 py-3 px-4 text-left font-semibold">
                        Index
                      </th>
                      <th className="w-1/2 py-3 px-4 text-left font-semibold">
                        Elements
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedKeyInfo.elements.map((element, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                          {index}
                        </td>
                        <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                          {String(element)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {selectedKeyInfo.type === "set" && (
              <div className="flex items-center justify-center w-full p-4">
                <table className="table-auto w-full overflow-hidden">
                  <thead className="bg-tw-dark-border opacity-85 text-white">
                    <tr>
                      <th className="w-1/2 py-3 px-4 text-left font-semibold">
                        Index
                      </th>
                      <th className="w-1/2 py-3 px-4 text-left font-semibold">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedKeyInfo.elements.map((element, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                          {index}
                        </td>
                        <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                          {String(element)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full p-4 text-sm font-light flex items-center justify-center text-gray-500">
            Select a key to see details
          </div>
        )}
      </div>
    </div>
  )
}
