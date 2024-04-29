export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    password: string;
    roles: string;
    image: string | null;
}