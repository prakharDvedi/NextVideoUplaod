import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "http2";
import { connectToDatabase } from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { use } from "react";

//These are existing standard providers for NextAuth.js
//I have to make credentials method and my own logic for Auth using email and password which is tricky with NextAuth

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add your custom authentication logic here
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or password are missing");
        }
        try {
          await connectToDatabase();
          // Check the database for user with provided email and password
          //why do we add await?
          const user = await User.findOne({
            email: credentials.email,
            password: credentials.password,
          });
          if (!user) {
            throw new Error("Invalid email or password");
          }

          const valid = await bcrypt.compare(
            credentials.password,
            user.password!
          );
          return {
            id: user._id.toString(),
            email: user.email,
          };
          if (!valid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.log("Error during authentication", error);
          throw error;
        }

        // return user object if authenticated, or null if not
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If user is available, it means it's the first time JWT callback is called after sign in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// You can expand this file to include authentication strategies and configurations
// depending on your application's requirements.
// For example, you might want to add JWT support, OAuth providers, etc.

//JWT based session vs Cookie based session?
//NextAuth.js supports both JWT and database sessions. By default, it uses JWT for session management.
//What is the difference between JWT and database sessions in NextAuth.js?
//JWT sessions store session data in a JSON Web Token, which is sent to the client and included in each request. This is stateless and doesn't require server-side storage.
//Database sessions store session data on the server side, typically in a database. The client only holds a session ID, which is used to retrieve session data from the server.
