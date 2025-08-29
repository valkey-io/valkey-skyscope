import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { of, EMPTY } from 'rxjs'
import {
    catchError,
    mergeMap,
    takeUntil,
    tap,
    ignoreElements,
    filter
} from 'rxjs/operators'
import {
    setConnected,
    setConnecting,
    setError,
} from '@/state/wsconnection/wsConnectionSlice'
import { action$ } from '../middleware/rxjsMiddleware/rxjsMiddlware'
import type { PayloadAction, Store } from '@reduxjs/toolkit'

let socket$: WebSocketSubject<PayloadAction> | null = null;

export const wsConnectionEpic = (store: Store) =>
    action$.pipe(
        filter((action) => action.type === setConnecting.type),
        mergeMap(() => {
            if (socket$) {
                return EMPTY
            }
            socket$ = webSocket({
                url: 'ws://localhost:8080',
                deserializer: message => JSON.parse(message.data),
                serializer: message => JSON.stringify(message),
                openObserver: {
                    next: () => {
                        console.log('Socket Connection opened')
                        store.dispatch(setConnected(true))
                    }
                },
                closeObserver: {
                    next: (closeEvent) => {
                        console.log('Socket Connection closed', closeEvent)
                        store.dispatch(setConnected(false))
                    }
                }
            })
            return socket$.pipe(
                tap((message) => {
                    console.log('[WebSocket] Incoming message:', message)
                    store.dispatch(message)
                }),
                ignoreElements(),
                takeUntil(
                    action$.pipe(
                        filter((action) => action.type === 'wsconnection/disconnect'), // Need to fix this
                        tap(() => {
                            socket$?.complete();
                            socket$ = null;
                        })
                    )
                ),
                catchError((err) => of(setError(err)))
            );
        })
    )

export function getSocket(): WebSocketSubject<PayloadAction> {
    if (!socket$) {
        throw new Error("WebSocket is not connected");
    }
    return socket$;
}