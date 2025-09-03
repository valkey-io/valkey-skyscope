import { createSlice } from "@reduxjs/toolkit";
import { CONNECTED, VALKEY } from "@common/src/constants.ts"

const connectionSlice = createSlice({
    name: VALKEY.CONNECTION.name,
    initialState: {
        status: "Idle",
        errorMessage: null,
        hasRedirected: false,
        connectionDetails: {
          host: "localhost",
          port: "6379",
          username: "",
          password: "",
        },
    },
    reducers: {
        connectPending: (state, action) => {
            state.status = "Connecting";
            state.connectionDetails = {
              host: action.payload.host,
              port: action.payload.port,
              username: action.payload.username || "",
              password: action.payload.password || "",
            };
            state.errorMessage = null;
        },
        connectFulfilled: (state) => {
            state.status = CONNECTED;
            state.errorMessage = null;
        },
        connectRejected: (state, action) => {
            state.status = "Error";
            state.errorMessage = action.payload || "Unknown error";
        },
        setRedirected: (state, action) => {
            state.hasRedirected = action.payload;
        },
        resetConnection: (state) => {
            state.status = "Idle";
            state.errorMessage = null;
        },
        updateConnectionDetails: (state, action) => {
          state.connectionDetails = {
            ...state.connectionDetails,
            ...action.payload,
          };
        },
    }
})

export default connectionSlice.reducer
export const { connectPending, connectFulfilled, connectRejected, setRedirected, resetConnection, updateConnectionDetails } = connectionSlice.actions
