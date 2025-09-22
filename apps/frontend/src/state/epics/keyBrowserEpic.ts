import { tap } from "rxjs/operators"
import { merge } from "rxjs"
import { getSocket } from "./wsEpics"
import { 
  getKeysRequested, 
  getKeyTypeRequested 
} from "../valkey-features/keys/keyBrowserSlice" 
import { action$, select } from "../middleware/rxjsMiddleware/rxjsMiddlware"

export const keyBrowserEpic = () =>
  merge(
    // for getting all keys (getKeys)
    action$.pipe(
      select(getKeysRequested),
      tap((action) => {
        const socket = getSocket()
        console.log("Sending getKeys request to server...")
        socket.next(action)
      }),
    ),
    
    // for getting a key type (getKeyType)
    action$.pipe(
      select(getKeyTypeRequested),
      tap((action) => {
        const socket = getSocket()
        console.log("Sending getKeyType request to server...")
        socket.next(action)
      }),
    )
  )