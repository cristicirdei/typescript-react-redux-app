import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { League } from '../../types/league';

const API_KEY = process.env.REACT_APP_API_FOOTBALL_KEY;
const API_BASE_URL = 'https://v3.football.api-sports.io';



interface LeaguesState {
    leagues: League[];
    searchedLeagues: League[];
    selectedLeague: League | null;

    // caches
    leagueCache: Record<number, League>;
    searchCache: Record<string, League[]>;

    loading: boolean;
    error: string | null;
}

const initialState: LeaguesState = {
    leagues: [],
    searchedLeagues: [],
    selectedLeague: null,
    leagueCache: {},
    searchCache: {},
    loading: false,
    error: null,
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'x-apisports-key': API_KEY || '',
    },
});

export const fetchLeagues = createAsyncThunk(
    'leagues/fetchLeagues',
    async (_, { rejectWithValue, getState }) => {
        const state = (getState() as any).leagues as LeaguesState;
        if (state.leagues.length > 0) {
            console.log('Leagues found in cache');
            return state.leagues;
        }
        try {
            const response = await apiClient.get('/leagues');
            console.log('Fetched leagues from API:', response.data.response);
            return response.data.response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

export const fetchLeagueById = createAsyncThunk(
    'leagues/fetchLeagueById',
    async (id: number, { rejectWithValue, getState }) => {
        const state = (getState() as any).leagues as LeaguesState;
        if (state.leagueCache[id]) {
            return state.leagueCache[id];
        }
        try {
            const response = await apiClient.get('/leagues', { params: { id } });
            return response.data.response[0];
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const searchLeagueByName = createAsyncThunk(
    'leagues/searchLeagueByName',
    async (name: string, { rejectWithValue, getState }) => {
        const state = (getState() as any).leagues as LeaguesState;
        const key = name.toLowerCase();
        if (state.searchCache[key]) {
            return state.searchCache[key];
        }
        try {
            const response = await apiClient.get('/leagues', { params: { name } });
            return response.data.response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const leaguesSlice = createSlice({
    name: 'leagues',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeagues.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeagues.fulfilled, (state, action) => {
                state.loading = false;
                state.leagues = action.payload;
                // cache list and individual entries
                action.payload.forEach((l: League) => {
                    state.leagueCache[l.league.id] = l;
                });
            })
            .addCase(fetchLeagues.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchLeagueById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeagueById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedLeague = action.payload;
                if (action.payload) {
                    state.leagueCache[action.payload.league.id] = action.payload;
                }
            })
            .addCase(fetchLeagueById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(searchLeagueByName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchLeagueByName.fulfilled, (state, action) => {
                state.loading = false;
                state.searchedLeagues = action.payload;
                if (action.meta.arg) {
                    state.searchCache[action.meta.arg.toLowerCase()] = action.payload;
                }
            })
            .addCase(searchLeagueByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

//export const { clearError } = leaguesSlice.actions;
export default leaguesSlice.reducer;