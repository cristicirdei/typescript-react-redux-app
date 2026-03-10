import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Team } from '../../types/team';

const API_KEY = process.env.REACT_APP_API_FOOTBALL_KEY;
const API_BASE_URL = 'https://v3.football.api-sports.io';

interface TeamsState {
    teams: Team[];
    searchedTeams: Team[];
    selectedTeam: Team | null;
    loading: boolean;
    error: string | null;
}

const initialState: TeamsState = {
    teams: [],
    searchedTeams: [],
    selectedTeam: null,
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
    async (_, { rejectWithValue }) => {
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
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/teams', { params: { id } });
            return response.data.response[0];
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const searchTeamByName = createAsyncThunk(
    'teams/searchTeamByName',
    async (name: string, { rejectWithValue }) => {
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
        { rejectWithValue },
    ) => {
        console.log("Fetching teams for leagueId:", payload.leagueId, "season:", payload.season);
        const { leagueId, season } = payload;
        // construct URL exactly as API expects
        const url = `/teams?league=${leagueId}&season=${season}`;
        try {
            console.log("Constructed URL:", url);
            const response = await apiClient.get(url);
            console.log("teams response", response.data.response);

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
                console.log("fetchTeamsByLeagueSeason fulfilled - teams updated, loading set to false");
            })
            .addCase(fetchTeamsByLeagueSeason.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default teamsSlice.reducer;
