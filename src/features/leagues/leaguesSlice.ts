import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { League } from '../../types/league';

const API_KEY = process.env.REACT_APP_API_FOOTBALL_KEY;
const API_BASE_URL = 'https://v3.football.api-sports.io';



interface LeaguesState {
    leagues: League[];
    searchedLeagues: League[];
    selectedLeague: League | null;
    loading: boolean;
    error: string | null;
}

const initialState: LeaguesState = {
    leagues: [],
    searchedLeagues: [],
    selectedLeague: null,
    loading: false,
    error: null,
};

console.log('API Key:', API_KEY);

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'x-apisports-key': API_KEY || '',
    },
});

export const fetchLeagues = createAsyncThunk(
    'leagues/fetchLeagues',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/leagues');
            console.log(response.data.response);
            return response.data.response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchLeagueById = createAsyncThunk(
    'leagues/fetchLeagueById',
    async (id: number, { rejectWithValue }) => {
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
    async (name: string, { rejectWithValue }) => {
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
            })
            .addCase(searchLeagueByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

//export const { clearError } = leaguesSlice.actions;
export default leaguesSlice.reducer;