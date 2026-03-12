import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { League } from '../types/league';
import { Team } from '../types/team';
import { Player, PlayerStatistics } from '../types/player';

// grab API key from environment and define base URL for requests
const API_KEY = process.env.REACT_APP_API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

// wrap fetchBaseQuery to print a message every time a real network
// request is made.  RTK Query does *not* call the baseQuery when it
// returns data from the cache, so this gives us an easy way to
// differentiate between cached and fresh responses in the console.
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    if (API_KEY) {
      headers.set('x-apisports-key', API_KEY);
    }
    return headers;
  },
});

const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  console.log('[network] request:', args);
  const result = await rawBaseQuery(args, api, extraOptions);
  console.log('[network] response:', result);
  return result;
};

export const footballApi = createApi({
  reducerPath: 'footballApi',
  // configure fetch wrapper with base url and attach api key header
  baseQuery,
  tagTypes: ['League', 'Team', 'Player'],
  // define all API endpoints used by the app
  endpoints: (builder) => ({
    // fetch all leagues
    // fetch all leagues -- API returns {response: League[]}
    getLeagues: builder.query<League[], void>({
      query: () => '/leagues',
      transformResponse: (res: any) => res.response,
      providesTags: (result) =>
        result
          ? [...result.map(({ league }) => ({ type: 'League' as const, id: league.id })), { type: 'League', id: 'LIST' }]
          : [{ type: 'League', id: 'LIST' }],
    }),
    // fetch a single league by its ID
    getLeagueById: builder.query<League, number>({
      query: (id) => ({ url: '/leagues', params: { id } }),
      transformResponse: (res: any) => res.response[0],
      providesTags: (result, error, id) => [{ type: 'League', id }],
    }),
    // search leagues by name
    searchLeagues: builder.query<League[], string>({
      query: (name) => ({ url: '/leagues', params: { name } }),
      transformResponse: (res: any) => res.response,
      providesTags: (result) =>
        result
          ? result.map(({ league }) => ({ type: 'League' as const, id: league.id }))
          : [],
    }),
    // fetch all teams
    getTeams: builder.query<Team[], void>({
      query: () => '/teams',
      transformResponse: (res: any) => res.response,
      providesTags: (result) =>
        result
          ? [...result.map(({ team }) => ({ type: 'Team' as const, id: team.id })), { type: 'Team', id: 'LIST' }]
          : [{ type: 'Team', id: 'LIST' }],
    }),
    // fetch a single team by ID
    getTeamById: builder.query<Team, number>({
      query: (id) => ({ url: '/teams', params: { id } }),
      transformResponse: (res: any) => res.response[0],
      providesTags: (result, error, id) => [{ type: 'Team', id }],
    }),
    // search teams by name
    searchTeams: builder.query<Team[], string>({
      query: (search) => ({ url: '/teams', params: { search } }),
      transformResponse: (res: any) => res.response,
    }),
    // fetch teams for a specific league+season
    getTeamsByLeagueSeason: builder.query<Team[], { leagueId: number; season: number }>({
      query: ({ leagueId, season }) => `/teams?league=${leagueId}&season=${season}`,
      transformResponse: (res: any) => res.response,
      providesTags: (result, error, arg) =>
        result
          ? [{ type: 'Team' as const, id: `LEAGUE-${arg.leagueId}-SEASON-${arg.season}` }]
          : [],
    }),
    // get roster of players for a team 
    getPlayersByTeam: builder.query<PlayerStatistics[], { teamId: number }>({
      query: ({ teamId}) => ({ url: '/players/squads', params: { team: teamId } }),
      transformResponse: (res: any) => {
        // API sends back an array where the first element contains the team and its players
        return res.response[0]?.players || [];
      },
      providesTags: (result) =>
        result
          ? result.map(({ player }) => ({ type: 'Player' as const, id: player?.id }))
          : [],
    }),
    // fetch detailed profile for a player
    getPlayerProfile: builder.query<Player, number>({
      query: (id) => ({ url: '/players/profiles', params: { player: id } }),
      transformResponse: (res: any) => res.response[0].player,
      providesTags: (result, error, id) => [{ type: 'Player', id }],
    }),
    // search for players by name
    searchPlayers: builder.query<Player[], string>({
      query: (search) => ({ url: '/players/profiles', params: { search } }),
      transformResponse: (res: any) => res.response.map((player: any) => player.player),
    }),
    // fetch performance statistics for a player (optionally filtered)
    getPlayerStats: builder.query<PlayerStatistics, { playerId: number; season?: number; teamId?: number }>({
      query: ({ playerId, season, teamId }) => {
        const params: any = { id: playerId };
        if (season) params.season = season;
        if (teamId) params.team = teamId;
        return { url: '/players/', params };
      },      transformResponse: (res: any) => res.response[0],    }),
  }),
});

// export hooks
export const {
  useGetLeaguesQuery,
  useGetLeagueByIdQuery,
  useSearchLeaguesQuery,
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useSearchTeamsQuery,
  useGetTeamsByLeagueSeasonQuery,
  useGetPlayersByTeamQuery,
  useGetPlayerProfileQuery,
  useSearchPlayersQuery,
  useGetPlayerStatsQuery,
} = footballApi;
