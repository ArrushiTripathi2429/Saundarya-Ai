import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log("===== LOGIN ATTEMPT =====");

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        console.log("Email entered:", credentials.email);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        console.log("User from DB:", user);

        if (!user) {
          console.log("❌ USER NOT FOUND");
          return null;
        }

        console.log("Stored hash:", user.passwordHash);

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        console.log("Password match:", isValid);

        if (!isValid) {
          console.log("❌ PASSWORD INCORRECT");
          return null;
        }

        console.log("✅ LOGIN SUCCESS");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  debug: true, 

  secret: process.env.NEXTAUTH_SECRET,
};
