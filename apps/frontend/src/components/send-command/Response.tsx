import * as R from "ramda"
import React from "react"
import { toast } from "sonner"
import { toJson, toKeyPaths, type JSONObject } from "@common/src/json-utils.ts"
import { cn, copyToClipboard } from "@/lib/utils.ts"
import { CopyToClipboard, KeyFilterable, KV, spacing } from "@/components/send-command/CommandElements.tsx"

const Response = ({ filter, response }: { filter: string, response: JSONObject }) => {
  const filtered =
    R.pipe(
      toKeyPaths,
      R.map((keyPath) => ({ keyPath, keyPathString: keyPath.join(".") })),
      R.isEmpty(filter) ? R.identity : R.filter(({ keyPathString }) => keyPathString.includes(filter)),
    )(response)

  const onCopy = () =>
    R.pipe(
      R.isEmpty(filter) // we don't need to assemble a JSON from DiffEntry[] if not filtering keys
        ? R.always(response)
        : toJson(response),
      (r) => JSON.stringify(r, null, 2),
      copyToClipboard,
      R.tap(() => toast.success("Copied!")),
    )(filtered)

  return (
    R.isNotEmpty(filtered) &&
    <>
      <CopyToClipboard onClick={onCopy} />
      {
        filtered.map(({ keyPath, keyPathString }) =>
          <KV key={keyPathString}>
            <KeyFilterable
              filter={filter}
              keyPathString={keyPathString}
            />
            <div className={cn("bg-white dark:bg-black", spacing)}>
              {R.path(keyPath as string[], response)}
            </div>
          </KV>)
      }
    </>
  )
}

export default Response
