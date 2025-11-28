import { type WebSocket } from "ws"
import { VALKEY } from "../../../../common/src/constants"
import { withDeps, Deps } from "./utils"

type SlowLogsResponse = {
  count: number
  rows: Array<{
    ts: number
    metric: string
    values: Array<{
      id: string
      ts: number
      duration_us: number
      argv: string[]
      addr: string
      client: string
    }>
  }>
}

const sendSlowLogsFulfilled = (
  ws: WebSocket,
  connectionId: string,
  parsedResponse: SlowLogsResponse,
) => {
  ws.send(
    JSON.stringify({
      type: VALKEY.SLOWLOGS.slowLogsFulfilled,
      payload: {
        connectionId,
        parsedResponse,
      },
    }),
  )
}

const sendSlowLogsError = (
  ws: WebSocket,
  connectionId: string,
  error: unknown,
) => {
  console.log(error)
  ws.send(
    JSON.stringify({
      type: VALKEY.SLOWLOGS.slowLogsError,
      payload: {
        connectionId,
        error: error instanceof Error ? error.message : String(error),
      },
    }),
  )
}

export const slowLogsRequested = withDeps<Deps, void>(
  async ({ ws, connectionId, metricsServerURIs }) => {
    const metricsServerURI = metricsServerURIs.get(connectionId)

    try {
      const count = 50 
      const url = `${metricsServerURI}/slowlog?count=${count}`
      console.log("[slowLogsRequested] Fetching from:", url)

      const response = await fetch(url)
      const parsedResponse: SlowLogsResponse = await response.json() as SlowLogsResponse

      console.log("[slowLogsRequested] Response received:", {
        count: parsedResponse.count,
        rowsLength: parsedResponse.rows?.length,
      })

      sendSlowLogsFulfilled(ws, connectionId, parsedResponse)
    } catch (error) {
      sendSlowLogsError(ws, connectionId, error)
    }
  },
)
