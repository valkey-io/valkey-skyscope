import { createSlice } from "@reduxjs/toolkit"
import { type JSONObject } from "@common/src/json-utils"
import { VALKEY } from "@common/src/constants.ts"
import * as R from "ramda"
import type { RootState } from "@/store.ts"

export const selectSlowLogs = (id: string) => (state: RootState) =>
  R.path([VALKEY.SLOWLOGS.name, id, "slowLogs"], state)

interface SlowLogEntry {
  id: string
  ts: number
  duration_us: number
  argv: string[]
  addr: string
  client: string
}

interface SlowLogsState {
  [connectionId: string]: {
    slowLogs: Array<{
      ts: number
      metric: string
      values: SlowLogEntry[]
    }>
    count: number
    error?: JSONObject | null
    loading?: boolean
  }
}

const initialSlowLogsState: SlowLogsState = {}

const slowLogsSlice = createSlice({
  name: "slowLogs",
  initialState: initialSlowLogsState,
  reducers: {
    slowLogsRequested: (state, action) => {
      const connectionId = action.payload.connectionId
      state[connectionId] ??= {
        slowLogs: [],
        count: 50,
        loading: false,
      }
      state[connectionId].loading = true
    },
    slowLogsFulfilled: (state, action) => {
      const { rows, count } = action.payload.parsedResponse
      const connectionId = action.payload.connectionId
      state[connectionId] = {
        slowLogs: rows,
        count,
        loading: false,
      }
    },
    slowLogsError: (state, action) => {
      const { connectionId, error } = action.payload
      if (state[connectionId]) {
        state[connectionId].error = error
        state[connectionId].loading = false
      }
    },
  },
})

export default slowLogsSlice.reducer
export const {
  slowLogsRequested,
  slowLogsFulfilled,
  slowLogsError,
} = slowLogsSlice.actions
