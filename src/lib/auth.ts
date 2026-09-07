import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Dev / Test bypass credentials for Admin and Buyer
        if (credentials?.email === 'admin@submedortho.com' && credentials?.password === 'Admin123!') {
          return { id: 'admin-dev-id', email: 'admin@submedortho.com', name: 'SubMedOrtho Admin', role: 'admin' }
        }
        if (credentials?.email === 'admin@surgimart.com' && credentials?.password === 'Admin123!') {
          return { id: 'admin-surgimart-id', email: 'admin@surgimart.com', name: 'SurgiMart Admin', role: 'admin' }
        }
        if (credentials?.email === 'buyer@test.com' && credentials?.password === 'Test123!') {
          return { id: 'e2e-buyer', email: 'buyer@test.com', name: 'E2E Buyer', role: 'buyer' }
        }

        if (!credentials?.email || !credentials?.password) return null
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })
          if (!user || !user.passwordHash) return null
          const valid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          )
          if (!valid) return null
          return { id: user.id, email: user.email, name: user.name, role: user.role }
        } catch {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = (user as { role?: string }).role }
      return token
    },
    async session({ session, token }) {
      if (token) { session.user.id = token.id as string; session.user.role = token.role as string }
      return session
    }
  }
})
