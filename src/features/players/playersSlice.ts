import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Player, PlayerStatistics } from '../../types/player';

const API_KEY = process.env.REACT_APP_API_FOOTBALL_KEY;
const API_BASE_URL = 'https://v3.football.api-sports.io';

interface PlayersState {
    // current items shown in UI
    profile: Player | null;
    teamPlayers: PlayerStatistics[];
    searchedPlayers: PlayerStatistics[];
    statistics: PlayerStatistics | null;

    // caches for avoiding duplicate fetches
    profileCache: Record<number, Player>;
    teamPlayersCache: Record<string, PlayerStatistics[]>; // key `${teamId}-${season}`
    searchCache: Record<string, PlayerStatistics[]>; // key by name
    statsCache: Record<string, PlayerStatistics>; // key `${playerId}-${season || ''}-${teamId || ''}`

    loading: boolean;
    error: string | null;
}

const initialState: PlayersState = {
    profile: null,
    teamPlayers: [],
    searchedPlayers: [],
    statistics: null,
    profileCache: {},
    teamPlayersCache: {},
    searchCache: {},
    statsCache: {},
    loading: false,
    error: null,
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'x-apisports-key': API_KEY || '',
    },
});

// fetch a player's basic profile by id
export const fetchPlayerProfile = createAsyncThunk(
    'players/fetchPlayerProfile',
    async (player: number, { rejectWithValue, getState }) => {
        const state = (getState() as any).players as PlayersState;
        if (state.profileCache[player]) {
            return state.profileCache[player];
        }
        try {
            const response = await apiClient.get('/players/profiles', { params: { player } });
            return response.data.response[0] || null;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

// fetch all players for a given team & season
export const fetchPlayersByTeam = createAsyncThunk(
    'players/fetchPlayersByTeam',
    async (
        payload: { teamId: number; season: number },
        { rejectWithValue, getState },
    ) => {
        const { teamId, season } = payload;
        const state = (getState() as any).players as PlayersState;
        const key = `${teamId}-${season}`;
        if (state.teamPlayersCache[key]) {
            return state.teamPlayersCache[key];
        }
        try {
            const response = await apiClient.get('/players/squads', {
                params: { team: teamId, season },
            });
            return response.data.response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

// search players by name
export const searchPlayersByName = createAsyncThunk(
    'players/searchPlayersByName',
    async (name: string, { rejectWithValue, getState }) => {
        const state = (getState() as any).players as PlayersState;
        const key = name.toLowerCase();
        if (state.searchCache[key]) {
            return state.searchCache[key];
        }
        try {
            const response = await apiClient.get('/players/profiles', { params: { name } });
            return response.data.response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

// fetch statistics for a player optionally filtered by season/team
export const fetchPlayerStatistics = createAsyncThunk(
    'players/fetchPlayerStatistics',
    async (
        payload: { playerId: number; season?: number; teamId?: number },
        { rejectWithValue, getState },
    ) => {
        const { playerId, season, teamId } = payload;
        const state = (getState() as any).players as PlayersState;
        const key = `${playerId}-${season || ''}-${teamId || ''}`;
        if (state.statsCache[key]) {
            return state.statsCache[key];
        }
        const params: any = { player: playerId };
        if (season) params.season = season;
        if (teamId) params.team = teamId;
        try {
            const response = await apiClient.get('/players/', {
                params,
            });
            return response.data.response[0] || null;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlayerProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlayerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                if (action.payload) {
                    state.profileCache[action.payload.id] = action.payload;
                }
            })
            .addCase(fetchPlayerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchPlayersByTeam.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.teamPlayers = [];
            })
            .addCase(fetchPlayersByTeam.fulfilled, (state, action) => {
                state.loading = false;
                state.teamPlayers = action.payload;
                // cache by key
                const lastReq = (action.meta.arg as any) as { teamId: number; season: number };
                const key = `${lastReq.teamId}-${lastReq.season}`;
                state.teamPlayersCache[key] = action.payload;
            })
            .addCase(fetchPlayersByTeam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(searchPlayersByName.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.searchedPlayers = [];
            })
            .addCase(searchPlayersByName.fulfilled, (state, action) => {
                state.loading = false;
                state.searchedPlayers = action.payload;
                if (action.meta.arg) {
                    state.searchCache[action.meta.arg.toLowerCase()] = action.payload;
                }
            })
            .addCase(searchPlayersByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchPlayerStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.statistics = null;
            })
            .addCase(fetchPlayerStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.statistics = action.payload;
                // store in statsCache
                const arg = action.meta.arg as any;
                const key = `${arg.playerId}-${arg.season || ''}-${arg.teamId || ''}`;
                if (action.payload) {
                    state.statsCache[key] = action.payload;
                }
            })
            .addCase(fetchPlayerStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default playersSlice.reducer;
