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