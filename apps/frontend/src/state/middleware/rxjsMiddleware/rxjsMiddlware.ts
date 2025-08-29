import { Subject } from 'rxjs'
import type { Middleware } from '@reduxjs/toolkit'
import { type PayloadAction } from '@reduxjs/toolkit';

export const action$ = new Subject<PayloadAction>()

export const rxjsMiddleware: Middleware = () => next => (action: unknown) => {
    const result = next(action)
    action$.next(action as PayloadAction)
    return result
}