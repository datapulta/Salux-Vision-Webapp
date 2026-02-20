// src/types/next-auth.d.ts
import NextAuth, { type DefaultSession } from "next-auth"

// Usamos module augmentation de typescript para sobreescribir types
// Así VSCode no grita por el .role 

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's specific business role */
            role: 'admin' | 'user';
            /** The database uuid generated postgres id */
            id: string;
        } & DefaultSession["user"]
    }

    interface User {
        role: 'admin' | 'user';
    }
}
