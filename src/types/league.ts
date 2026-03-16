export interface League {
    league: {
        id: number;
        name: string;
        type: string;
        logo?: string;};
    country: {
        name: string;
        code: string;
        flag?: string;};
    seasons: Array<{
        year: number;
        start: string;
        end: string;
        current: boolean;}>;
}

export interface Standing {
    rank: number;
    team: {
        id: number;
        name: string;
        logo: string;
    };
    points: number;
    goalsDiff: number;
    group: string;
    form: string;
    status: string;
    description?: string;
    all: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: {
            for: number;
            against: number;
        };
    };
    home: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: {
            for: number;
            against: number;
        };
    };
    away: {
        played: number;
        win: number;
        draw: number;
        lose: number;
        goals: {
            for: number;
            against: number;
        };
    };
    update: string;
}