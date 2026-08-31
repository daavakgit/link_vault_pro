import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { signToken, setAuthCookie } from '@/lib/auth';
import { cookies } from 'next/headers';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          await connectToDatabase();
          let dbUser = await User.findOne({ email: user.email.toLowerCase() });

          if (!dbUser) {
            dbUser = await User.create({
              name: user.name || 'Google User',
              email: user.email.toLowerCase(),
              avatar: user.image || '',
            });
          } else if (user.image && !dbUser.avatar) {
            dbUser.avatar = user.image;
            await dbUser.save();
          }

          // Issue LinkVault JWT Cookie for full session compatibility across app
          const jwtToken = signToken({
            userId: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.name,
          });

          const cookieStore = await cookies();
          const cookieConfig = setAuthCookie(jwtToken);
          cookieStore.set(cookieConfig.name, cookieConfig.value, cookieConfig);

          return true;
        } catch (err) {
          console.error('Error handling Google user sign in:', err);
          return true;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};
