import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validation/auth";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/app/lib/prisma";



export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },


      async authorize(credentials) {
  const parsed = loginSchema.safeParse(credentials);

  if (!parsed.success) {
    return null;
  }

  const { email, password } = parsed.data;

  const limit = rateLimit({
    key: `login:${email}`,
    limit: 5,
    windowMs: 60 * 1000,
  });

  if (!limit.success) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      password: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}


    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = (user as { role?: string }).role;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
    }
    return session;
  },
},
  pages: {
    signIn: "/login",
  },
});