import { configureStore } from "@reduxjs/toolkit"
import leaguesReducer from "../features/leagues/leaguesSlice"
import teamsReducer from "../features/teams/teamsSlice"   
import playersReducer from "../features/players/playersSlice"   
import { footballApi } from "./api";

export const store = configureStore({
  reducer: {
    leagues: leaguesReducer,
    teams: teamsReducer,
    players: playersReducer,
    [footballApi.reducerPath]: footballApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(footballApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch