interface KeyDetailsStreamProps {
  selectedKey: string;
  selectedKeyInfo: {
    name: string;
    type: "stream";
    ttl: number;
    size: number;
    collectionSize?: number;
    elements: Array<{
      key: string;
      value: [string, string][];
    }>;
  };
  connectionId: string;
  readOnly: boolean;
}

export default function KeyDetailsStream(
  { selectedKeyInfo }: KeyDetailsStreamProps,
) {
  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      {selectedKeyInfo?.elements.map((entry, index: number) => (
        <div className="overflow-hidden" key={index}>
          <div className="bg-tw-dark-border opacity-85 text-white py-2 px-4 font-semibold">
            Entry ID: {entry.key} <span className="text-xs font-light">({new Date(1765207648389).toLocaleString()})</span>
          </div>
          <table className="table-auto w-full">
            <thead className="bg-tw-dark-border opacity-70 text-white">
              <tr>
                <th className="w-1/2 py-3 px-4 text-left font-semibold">
                  Field
                </th>
                <th className="w-1/2 py-3 px-4 text-left font-semibold">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {entry.value.map(([field, value], fieldIndex: number) => (
                <tr key={fieldIndex}>
                  <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                    {field}
                  </td>
                  <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {selectedKeyInfo.elements.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No entries in this stream
        </div>
      )}
    </div>
  )
}
