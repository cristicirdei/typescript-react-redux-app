import { configureStore } from "@reduxjs/toolkit"
import postsReducer from "../features/posts/postsSlice"
import leaguesReducer from "../features/leagues/leaguesSlice"   

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    leagues: leaguesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch