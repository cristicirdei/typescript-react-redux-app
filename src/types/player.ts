export interface PlayerBirth {
    date: string;
    place?: string;
    country?: string;
}

export interface Player {
    id: number;
    name: string;
    firstname?: string;
    lastname?: string;
    age?: number;
    birth?: PlayerBirth;
    nationality?: string;
    height?: string;
    weight?: string;
    injured?: boolean;
    position?: string;
    number?: number;
    photo?: string;
}

export interface PlayerStatsEntry {
    team?: {
        id: number;
        name: string;
        logo?: string;
    };
    league?: {
        id: number;
        name: string;
        country?: string;
        logo?: string;
        flag?: string;
        season?: number;
    };
    games?: Record<string, any>;
    [key: string]: any;
}

export interface PlayerStatistics {
    player: Player;
    statistics: PlayerStatsEntry[];
}
