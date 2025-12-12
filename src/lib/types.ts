export interface User {
    rank: number;
    name: string;
    ecoscore: number; 
    city: string;
    avatar: string;
    isCurrentUser?: boolean;
}

export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    ecoPoints: number;
    location?: string;
    completedActions?: string[];
}
