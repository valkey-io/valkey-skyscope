import { CONNECTED } from "@common/src/constants";
import { createSlice } from "@reduxjs/toolkit";

const wsConnectionSlice = createSlice({
    name: "wsconnection",
    initialState: {
        status: "Idle",
        errorMessage: null,
    },
    reducers: {
        connectPending: (state) => {
            state.status = "Connecting";
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
        resetConnection: (state) => {
            state.status = "Idle";
            state.errorMessage = null;
        }
    }
})

export default wsConnectionSlice.reducer
export const { connectPending, connectFulfilled, connectRejected, resetConnection } = wsConnectionSlice.actions