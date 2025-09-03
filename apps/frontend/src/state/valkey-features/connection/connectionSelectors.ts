import type { RootState } from "@/store.ts";
import { VALKEY } from "@common/src/constants.ts"

export const selectStatus = (state: RootState) => state[VALKEY.CONNECTION.name].status
export const selectRedirected = (state: RootState) => state[VALKEY.CONNECTION.name].hasRedirected
export const selectError = (state: RootState) => state[VALKEY.CONNECTION.name].status
export const selectConnectionDetails = (state: RootState) => state[VALKEY.CONNECTION.name].connectionDetails