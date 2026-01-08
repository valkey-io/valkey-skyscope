import { type WebSocket } from "ws"
import { VALKEY } from "../../../../common/src/constants"
import { withDeps, Deps } from "./utils"
import { downsampleData, getBucketSize } from "../../../../common/src/cpu-usage-downsampling"

type CpuUsageResponse = Array<{
  timestamp: number
  value: number
}>

type TimeRange = "1h" | "6h" | "12h"

const sendCpuUsageFulfilled = (
  ws: WebSocket,
  connectionId: string,
  parsedResponse: CpuUsageResponse,
) => {
  ws.send(
    JSON.stringify({
      type: VALKEY.CPU.cpuUsageFulfilled,
      payload: {
        connectionId,
        parsedResponse,
      },
    }),
  )
}

const sendCpuUsageError = (
  ws: WebSocket,
  connectionId: string,
  error: unknown,
) => {
  console.log(error)
  ws.send(
    JSON.stringify({
      type: VALKEY.CPU.cpuUsageError,
      payload: {
        connectionId,
        error: error instanceof Error ? error.message : String(error),
      },
    }),
  )
}

type RequestPayload = {
  connectionIds: string[]
  timeRange?: string
}

export const cpuUsageRequested = withDeps<Deps, void>(
  async ({ ws, metricsServerURIs, action }) => {
    const { connectionIds, timeRange = "12h" } = action.payload as unknown as RequestPayload
    const promises = connectionIds.map(async (connectionId: string) => {
      const metricsServerURI = metricsServerURIs.get(connectionId)
      try {
        const url = `${metricsServerURI}/cpu?tolerance=0.2`
        const response = await fetch(url)
        const parsedResponse: CpuUsageResponse = await response.json() as CpuUsageResponse

        // filtering based on the needed time range
        const now = Date.now()
        const hoursInMs = {
          "1h": 1 * 60 * 60 * 1000,
          "6h": 6 * 60 * 60 * 1000,
          "12h": 12 * 60 * 60 * 1000,
        }
        const cutoffTime = now - hoursInMs[timeRange as TimeRange]
        const filteredResponse = parsedResponse.filter((item) => item.timestamp >= cutoffTime)

        // downsampling based on the needed time range
        const bucketSize = getBucketSize(timeRange as TimeRange)
        const downsampledResponse = downsampleData(filteredResponse, bucketSize)

        console.log(`Original points: ${filteredResponse.length}, Downsampled to: ${downsampledResponse.length}`)

        sendCpuUsageFulfilled(ws, connectionId, downsampledResponse)
      } catch (error) {
        sendCpuUsageError(ws, connectionId, error)
      }
    })
    await Promise.all(promises)
  })
