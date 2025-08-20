const PREFIX = "valkey" as const

export const VALKEY = {
    setConnecting: `${PREFIX}/connecting`,
    setConnected:  `${PREFIX}/connected`,
    setError:      `${PREFIX}/error`,
    sendPending:   `${PREFIX}/sendPending`,
    sendFulfilled: `${PREFIX}/sendFulfilled`,
    sendFailed:    `${PREFIX}/sendFailed`,
    setData:       `${PREFIX}/setData`,
} as const
