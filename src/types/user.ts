export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: 'USER' | 'ADMIN';
    createdAt: string;
}
