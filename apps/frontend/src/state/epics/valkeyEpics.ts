import { getSocket } from "./wsEpics"
import { selectStatus, } from "../valkey-features/connection/connectionSelectors"
import { connectPending, connectFulfilled, resetConnection } from "../valkey-features/connection/connectionSlice"
import { sendRequested } from "../valkey-features/command/commandSlice"
import { filter, tap, ignoreElements } from 'rxjs/operators';
import { setData } from "../valkey-features/info/infoSlice";

import { action$ } from "../middleware/rxjsMiddleware/rxjsMiddlware"
import type { Store } from "@reduxjs/toolkit"
import { CONNECTED } from "@common/src/constants";

export const connectionEpic = (store: Store) => action$.pipe(
    filter((action) => {
        const state = store.getState()
        return selectStatus(state) != CONNECTED && action.type === connectPending.type
    }),
    tap((action) => {
        const socket = getSocket()
        console.log("Sending message to server from connecting epic...")
        socket.next(action)
    }),
    ignoreElements()
)

export const sendRequestEpic = () =>
    action$.pipe(
        filter((action) => action.type === sendRequested.type),
        tap((action) => {
            const socket = getSocket()
            socket.next(action)
        }),
    )

export const setDataEpic = () =>
    action$.pipe(
        filter((action) => action.type === connectFulfilled.type),
        tap(() => {
            const socket = getSocket()
            socket.next({ type: setData.type, payload: undefined })
        }),
    )

export const disconnectEpic = () =>
    action$.pipe(
        filter((action) => action.type === resetConnection.type),
        tap((action) => {
            const socket = getSocket()
            socket.next(action)
        }),
        ignoreElements()
    )

