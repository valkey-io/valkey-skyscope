import { createSlice } from "@reduxjs/toolkit";
import { VALKEY } from "@common/src/constants.ts";

const connectionSlice = createSlice({
  name: VALKEY.CONNECTION.name,
  initialState: {
    status: "Not Connected",
    connected: false,
    connecting: false,
    hasRedirected: false,
    connectionDetails: {
      host: "localhost",
      port: "6379",
      username: "",
      password: "",
    },
  },
  reducers: {
    setConnected: (state, action) => {
      state.status = action.payload.status ? "Connected" : "Not Connected";
      state.connected = action.payload.status;
      state.connecting = action.payload.status ? false : state.connecting;
    },
    setConnecting: (state, action) => {
      state.status = "Connecting...";
      state.connecting = action.payload.status;
      // Store connection details when connecting
      if (action.payload.status) {
        state.connectionDetails = {
          host: action.payload.host,
          port: action.payload.port,
          username: action.payload.username || "",
          password: action.payload.password || "",
        };
      }
    },
    // Add new action for updating connection details
    updateConnectionDetails: (state, action) => {
      state.connectionDetails = {
        ...state.connectionDetails,
        ...action.payload,
      };
    },
    setError: (state, action) => {
      state.status = "Error" + action.payload;
      state.connecting = false;
    },
    setRedirected: (state, action) => {
      state.hasRedirected = action.payload;
    },
  },
});

export default connectionSlice.reducer;
export const { setConnected, setConnecting, updateConnectionDetails, setError, setRedirected } =
  connectionSlice.actions;
