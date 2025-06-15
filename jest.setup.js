"use client"

import "@testing-library/jest-dom"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return "/"
  },
}))

// Mock Supabase client
jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
    })),
  }),
}))
