import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import { z } from 'zod';
import bcryptjs from 'bcryptjs';
import prisma from '@/lib/prisma';
import credentials from 'next-auth/providers/credentials';
import { User } from '@prisma/client';

const autenticatedRoutes = [
  '/checkout/address',
  '/checkout'
]

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    jwt({token, user}){
      if(user){
        token.data = user;
      }
      return token
    },
    async session({session, token, user}){
      session.user = token.data as any;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = autenticatedRoutes.includes(nextUrl.pathname);
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return true;
      }
      
      return true;
    }
  },
  providers: [
    credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
          if (!user) return null;

          const isValidPassword = await validPassword(user, password)
          if(!isValidPassword) return null;

          const { password: _, ...rest } = user;
          
          return rest;
        }

        return null;
      },
    }),
  ],
};

async function getUserByEmail(email: string) {
  const user = await prisma.user.findFirst({ where: { email: email.toLowerCase() } })
  if (!user) {
    return null;
  }
  return user;
}
  

async function validPassword(user : User, password: string) {
  const isValidPassword = await bcryptjs.compare(password, user!.password);
  if (!isValidPassword) return null;
  return user;
}



export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)