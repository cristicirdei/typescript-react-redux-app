import { Team } from './team';
import { League } from './league';
import { Player } from './player';

export interface FixtureStatistic {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  statistics: Array<{
    type: string;
    value: string | number | null;
  }>;
}

export interface FixtureEvent {
  time: {
    elapsed: number;
    extra: number | null;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
  type: string;
  detail: string;
  comments: string | null;
}

export interface FixtureDetails {
  id: number;
  referee?: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first?: number;
    second?: number;
  };
  venue: {
    id?: number;
    name?: string;
    city?: string;
  };
  status: {
    long: string;
    short: string;
    elapsed?: number;
  };
}

export interface Fixture {
  fixture: FixtureDetails;
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner?: boolean;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner?: boolean;
    };
  };
  goals: {
    home?: number;
    away?: number;
  };
  score: {
    halftime: {
      home?: number;
      away?: number;
    };
    fulltime: {
      home?: number;
      away?: number;
    };
    extratime: {
      home?: number;
      away?: number;
    };
    penalty: {
      home?: number;
      away?: number;
    };
  };
  events?: FixtureEvent[];
  statistics?: FixtureStatistic[];
}

export interface Lineup {
  team: {
    id: number;
    name: string;
    logo: string;
    colors: {
      player: {
        primary: string;
        number: string;
        border: string;
      };
      goalkeeper: {
        primary: string;
        number: string;
        border: string;
      };
    };
  };
  formation: string;
  startXI: Array<{
    player: {
      id: number;
      name: string;
      number: number;
      pos: string;
      grid: string;
    };
  }>;
  substitutes: Array<{
    player: {
      id: number;
      name: string;
      number: number;
      pos: string;
      grid: string;
    };
  }>;
  coach: {
    id: number;
    name: string;
    photo: string;
  };
}
