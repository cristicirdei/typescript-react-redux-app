import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Team } from '../../types/team';

const API_KEY = process.env.REACT_APP_API_FOOTBALL_KEY;
const API_BASE_URL = 'https://v3.football.api-sports.io';

interface TeamsState {
    teams: Team[];
    searchedTeams: Team[];
    selectedTeam: Team | null;

    // caches
    teamsCache: Team[];
    teamByIdCache: Record<number, Team>;
    searchCache: Record<string, Team[]>;
    leagueSeasonCache: Record<string, Team[]>; // key `${leagueId}-${season}`

    loading: boolean;
    error: string | null;
}

const initialState: TeamsState = {
    teams: [],
    searchedTeams: [],
    selectedTeam: null,
    teamsCache: [],
    teamByIdCache: {},
    searchCache: {},
    leagueSeasonCache: {},
    loading: false,
    error: null,
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'x-apisports-key': API_KEY || '',
    },
});

export const fetchTeams = createAsyncThunk(
    'teams/fetchTeams',
    async (_, { rejectWithValue, getState }) => {
        const state = (getState() as any).teams as TeamsState;
        if (state.teamsCache.length > 0) {
            return state.teamsCache;
        }
        try {
            const response = await apiClient.get('/teams');
            return response.data.response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchTeamById = createAsyncThunk(
    'teams/fetchTeamById',
    async (id: number, { rejectWithValue, getState }) => {
        const state = (getState() as any).teams as TeamsState;
        if (state.teamByIdCache[id]) {
            console.log(`Team with id ${id} found in cache`);
            return state.teamByIdCache[id];
        }
        try {
            const response = await apiClient.get('/teams', { params: { id } });
            console.log(`Fetched team with id ${id} from API:`, response.data.response[0]);
            return response.data.response[0];
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const searchTeamByName = createAsyncThunk(
    'teams/searchTeamByName',
    async (name: string, { rejectWithValue, getState }) => {
        const state = (getState() as any).teams as TeamsState;
        const key = name.toLowerCase();
        if (state.searchCache[key]) {
            return state.searchCache[key];
        }
        try {
            const response = await apiClient.get('/teams', { params: { name } });
            return response.data.response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

// fetch teams by league and season (e.g. league id + year)
export const fetchTeamsByLeagueSeason = createAsyncThunk(
    'teams/fetchTeamsByLeagueSeason',
    async (
        payload: { leagueId: number; season: number },
        { rejectWithValue, getState },
    ) => {
        const { leagueId, season } = payload;
        const state = (getState() as any).teams as TeamsState;
        const key = `${leagueId}-${season}`;
        if (state.leagueSeasonCache[key]) {
            return state.leagueSeasonCache[key];
        }
        const url = `/teams?league=${leagueId}&season=${season}`;
        try {
            const response = await apiClient.get(url);
            return response.data.response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    },
);

const teamsSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeams.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload;
                state.teamsCache = action.payload;
                action.payload.forEach((t: Team) => {
                    state.teamByIdCache[t.team.id] = t;
                });
            })
            .addCase(fetchTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTeamById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTeam = action.payload;
                if (action.payload) {
                    state.teamByIdCache[action.payload.team.id] = action.payload;
                }
            })
            .addCase(fetchTeamById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(searchTeamByName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchTeamByName.fulfilled, (state, action) => {
                state.loading = false;
                state.searchedTeams = action.payload;
                if (action.meta.arg) {
                    state.searchCache[action.meta.arg.toLowerCase()] = action.payload;
                }
            })
            .addCase(searchTeamByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // league/season fetch
            .addCase(fetchTeamsByLeagueSeason.pending, (state) => {
                state.loading = true;
                state.error = null;
                // clear previous teams so UI doesn't show stale data
                state.teams = [];
                console.log("fetchTeamsByLeagueSeason pending - cleared teams, loading set to true");
            })
            .addCase(fetchTeamsByLeagueSeason.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload;
                const lastReq = (action.meta.arg as any) as { leagueId: number; season: number };
                const key = `${lastReq.leagueId}-${lastReq.season}`;
                state.leagueSeasonCache[key] = action.payload;
            })
            .addCase(fetchTeamsByLeagueSeason.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default teamsSlice.reducer;
