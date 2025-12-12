interface ZSetElement {
  key: string;
  value: number;
}

interface KeyDetailsZSetProps {
  selectedKey: string;
  selectedKeyInfo: {
    name: string;
    type: "zset";
    ttl: number;
    size: number;
    collectionSize?: number;
    elements: ZSetElement[];
  };
  connectionId: string;
  readOnly: boolean;
}

export default function KeyDetailsZSet(
  { selectedKeyInfo }: KeyDetailsZSetProps,
) {

  console.log("selectedKeyInfo:::", selectedKeyInfo)
  return (
    <div className="flex items-center justify-center w-full p-4">
      <table className="table-auto w-full overflow-hidden">
        <thead className="bg-tw-dark-border opacity-85 text-white">
          <tr>
            <th className="w-1/4 py-3 px-4 text-left font-semibold">
              Key
            </th>
            <th className="w-3/4 py-3 px-4 text-left font-semibold">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedKeyInfo.elements.map((element: ZSetElement, index: number) => (
            <tr key={index}>
              <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                {element.value}
              </td>
              <td className="py-3 px-4 border-b border-tw-dark-border font-light dark:text-white">
                {element.key}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
