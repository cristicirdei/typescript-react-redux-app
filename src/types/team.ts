export interface Team {
    team: {
        id: number;
        name: string;
        code?: string;
        logo?: string;
        country?: string;
        founded?: number;
        national?: boolean;
        venue?: string;
    };
    venue?: {
        id: number;
        name: string;
        city?: string;
        capacity?: number;
        surface?: string;
        address?: string;
        image?: string;
    };
}
