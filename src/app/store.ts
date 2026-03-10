import { configureStore } from "@reduxjs/toolkit"
import leaguesReducer from "../features/leagues/leaguesSlice"
import teamsReducer from "../features/teams/teamsSlice"   
import playersReducer from "../features/players/playersSlice"   

export const store = configureStore({
  reducer: {
    leagues: leaguesReducer,
    teams: teamsReducer,
    players: playersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch