import { formatBytes } from "./bytes-conversion"

export type ValueType = "bytes" | "number" | "mixed"

const formatSeconds = (seconds: number): string => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

  return parts.join(" ")
}

export const formatMetricValue = (
  key: string,
  value: number | null,
  valueType: ValueType = "number",
): string => {
  if (value === null || value === undefined) return "N/A"

  if (valueType === "bytes") {
    return formatBytes(value)
  }

  if (valueType === "mixed") {
    const byteKeys = ["total_net_input_bytes", "total_net_output_bytes"]
    const secondKeys = ["uptime_in_seconds"]

    if (byteKeys.includes(key)) {
      return formatBytes(value)
    }

    if (secondKeys.includes(key)) {
      return formatSeconds(value)
    }
  }

  return typeof value === "number" ? value.toLocaleString() : String(value)
}
