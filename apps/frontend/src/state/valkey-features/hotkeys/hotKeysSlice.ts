import { createSlice } from "@reduxjs/toolkit"
import { type JSONObject } from "@common/src/json-utils"
import { VALKEY } from "@common/src/constants.ts"
import * as R from "ramda"
import type { RootState } from "@/store.ts"

export const selectHotKeys = (id: string) => (state: RootState) =>
  R.path([VALKEY.HOTKEYS.name, id, "hotKeys"], state)

interface HotKeysState {
  [connectionId: string]: {
    hotKeys: [string, number][]
    checkAt: string|null,
    monitorRunning: boolean,
    nodeId: string|null,
    error?: JSONObject | null,
  }
}

const initialHotKeysState: HotKeysState = {}

const hotKeysSlice = createSlice({
  name: "hotKeys",
  initialState: initialHotKeysState,
  reducers: {
    hotKeysRequested: (state, action) => {
      const connectionId = action.payload.connectionId
      if (!state[connectionId]) {
        state[connectionId] = {
          hotKeys: [],
          checkAt: null, 
          monitorRunning: false,
          nodeId: null,
        }
      }
    },
    hotKeysFulfilled: (state, action) => {
      const { hotKeys, monitorRunning, checkAt, nodeId } = action.payload.parsedResponse
      console.log("Parsed response in the frontend is: ", action.payload.parsedResponse)
      const connectionId = action.payload.connectionId
      state[connectionId] = {
        hotKeys,
        checkAt,
        monitorRunning, 
        nodeId,
      }
      
    },
    hotKeysError: (state, action) => {
      const { connectionId, error } = action.payload
      state[connectionId].error = error
    },
  },
})
export default hotKeysSlice.reducer
export const {
  hotKeysRequested,
  hotKeysFulfilled,
  hotKeysError,
} = hotKeysSlice.actions
