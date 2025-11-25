import { VALKEY } from "../../../../common/src/constants"
import { withDeps, Deps } from "./utils"

type HotKeysResponse = {
  nodeId: string
  hotkeys: [[]]
  checkAt: number
  monitorRunning: boolean
}

export const hotKeysRequested = withDeps<Deps, void>(
  async ({ ws, connectionId, metricsServerURIs }) => {
    console.log("The metric server uris are: ", metricsServerURIs)
    const metricsServerURI = metricsServerURIs.get(connectionId)
    try {
      let response = await fetch(`http://${metricsServerURI}/hot-keys`)
      let parsedResponse: HotKeysResponse = await response.json() as HotKeysResponse
      console.log(parsedResponse)
      if (parsedResponse.checkAt) {
        const delay = Math.max(parsedResponse.checkAt - Date.now(), 0)
        setTimeout(async () => {
          try {
            response = await fetch(`http://${metricsServerURI}/hot-keys`)
            parsedResponse = await response.json() as HotKeysResponse
            ws.send( 
              JSON.stringify({
                type: VALKEY.HOTKEYS.hotKeysFulfilled,
                payload: {
                  connectionId,
                  parsedResponse,
                },
              }),
            )
          } catch (error) {
            console.log(error)
            ws.send(
              JSON.stringify({
                type: VALKEY.HOTKEYS.hotKeysError,
                payload: {
                  connectionId,
                  error,
                },
              }),
            )
          }
        }, delay)
      }
      else {
        ws.send( 
          JSON.stringify({
            type: VALKEY.HOTKEYS.hotKeysFulfilled,
            payload: {
              connectionId,
              parsedResponse,
            },
          }),
        )
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: VALKEY.HOTKEYS.hotKeysError,
          payload: {
            connectionId,
            error,
          },
        }),
      )
    }
  },
)
