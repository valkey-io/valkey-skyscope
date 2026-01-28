import { useState } from "react"
import { Check, Pencil, X, TriangleAlert } from "lucide-react"
import { KEY_TYPES } from "@common/src/constants"
import { useSelector } from "react-redux"
import { CustomTooltip } from "../../ui/custom-tooltip"
import { Button } from "../../ui/button"
import { useAppDispatch } from "@/hooks/hooks"
import { updateKeyRequested } from "@/state/valkey-features/keys/keyBrowserSlice"
import { selectJsonModuleAvailable } from "@/state/valkey-features/connection/connectionSelectors"

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
  { selectedKey, selectedKeyInfo, connectionId, readOnly = false }: KeyDetailsJsonProps,
) {
  const dispatch = useAppDispatch()
  const [isEditable, setIsEditable] = useState(false)
  const [editedValue, setEditedValue] = useState("")
  const [error, setError] = useState("")

  const jsonModuleAvailable = useSelector(selectJsonModuleAvailable(connectionId))

  let formattedJson = selectedKeyInfo.elements

  try {
    const parsed = JSON.parse(selectedKeyInfo.elements)
    formattedJson = JSON.stringify(parsed, null, 2)
  } catch {
    // display as is if not valid JSON
    formattedJson = selectedKeyInfo.elements
  }

  const handleEdit = () => {
    if (isEditable) {
      // Cancel edit
      setIsEditable(false)
      setEditedValue("")
      setError("")
    } else {
      // Start editing with formatted JSON
      setEditedValue(formattedJson)
      setIsEditable(true)
    }
  }

  const handleSave = () => {
    // validate JSON before saving
    try {
      JSON.parse(editedValue)
      setError("")
      dispatch(updateKeyRequested({
        connectionId: connectionId,
        key: selectedKey,
        keyType: KEY_TYPES.JSON,
        value: editedValue,
      }))
      setIsEditable(false)
      setEditedValue("")
    } catch {
      setError("Invalid JSON format. Please enter valid JSON data.")
    }
  }

  return (
    <div className="flex items-center justify-center w-full p-4">
      <table className="table-auto w-full overflow-hidden">
        <thead className="bg-tw-dark-border opacity-85 text-white">
          <tr>
            <th className="w-full py-3 px-4 text-left font-semibold">
              JSON Value
            </th>
            <th className="">
              {!readOnly && (isEditable ? (
                <div className="flex gap-1">
                  <CustomTooltip content="Save">
                    <Button
                      className="text-tw-primary hover:text-tw-primary"
                      onClick={handleSave}
                      variant={"secondary"}
                    >
                      <Check />
                    </Button>
                  </CustomTooltip>
                  <CustomTooltip content="Cancel">
                    <Button
                      onClick={handleEdit}
                      variant={"destructiveGhost"}
                    >
                      <X />
                    </Button>
                  </CustomTooltip>
                </div>
              ) : (
                <CustomTooltip content={jsonModuleAvailable ? "Edit" : "JSON module not available"}>
                  <Button
                    className="mr-1"
                    disabled={!jsonModuleAvailable}
                    onClick={handleEdit}
                    variant={"ghost"}
                  >
                    <Pencil />
                  </Button>
                </CustomTooltip>
              ))}
            </th>
          </tr>
        </thead>
        <tbody>
          {!jsonModuleAvailable && (
            <tr>
              <td className="px-4 pt-3" colSpan={2}>
                <div className="flex items-center gap-2 px-3 py-2 rounded text-sm bg-tw-primary/20 text-red-400">
                  <TriangleAlert size={14} />
                  <span>
                    JSON module is not loaded on this Valkey instance. Editing is disabled.
                  </span>
                </div>
              </td>
            </tr>
          )}
          <tr>
            <td className="py-3 px-4 font-light dark:text-white" colSpan={2}>
              {isEditable ? (
                <div>
                  <textarea
                    autoFocus
                    className="w-full p-2 dark:bg-tw-dark-bg dark:border-tw-dark-border border rounded focus:outline-none
                      focus:ring-2 focus:ring-tw-primary min-h-[400px] font-mono text-sm"
                    onChange={(e) => setEditedValue(e.target.value)}
                    value={editedValue}
                  />
                  {error && (
                    <div className="mt-2 text-sm text-red-500">
                      {error}
                    </div>
                  )}
                </div>
              ) : (
                <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap break-words">
                  {formattedJson}
                </pre>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
