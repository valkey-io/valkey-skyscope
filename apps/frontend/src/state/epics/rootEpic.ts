import { wsConnectionEpic } from './wsEpics';
import { connectionEpic, disconnectEpic, sendRequestEpic, setDataEpic } from './valkeyEpics';
import { merge } from 'rxjs'
import type { Store } from '@reduxjs/toolkit';

export const registerEpics = (store: Store) => {
    merge(
        wsConnectionEpic(store),
        connectionEpic(store),
        sendRequestEpic(),
        setDataEpic(),
        disconnectEpic()
    ).subscribe({
        error: err => console.error('Epic error:', err),
    })
}