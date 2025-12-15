interface KeyDetailsJsonProps {
  selectedKey: string;
  selectedKeyInfo: {
    name: string;
    type: "ReJSON-RL";
    ttl: number;
    size: number;
    elements: string;
  };
  connectionId: string;
  readOnly: boolean;
}

export default function KeyDetailsJson(
  { selectedKeyInfo }: KeyDetailsJsonProps,
) {

  let formattedJson = selectedKeyInfo.elements

  try {
    const parsed = JSON.parse(selectedKeyInfo.elements)
    formattedJson = JSON.stringify(parsed, null, 2)
  } catch {
    // display as is if not valid JSON
    formattedJson = selectedKeyInfo.elements
  }

  return (
    <div className="flex items-center justify-center w-full p-4">
      <div className="w-full">
        <div className="bg-tw-dark-border opacity-85 text-white py-3 px-4 font-semibold">
          JSON Value
        </div>
        <div className="p-4">
          <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap break-words dark:text-white">
            {formattedJson}
          </pre>
        </div>
      </div>
    </div>
  )
}
