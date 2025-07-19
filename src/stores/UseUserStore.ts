import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/User'

interface UserStore {
  user: User | null
  token: string | null
  setUser: (user: User, token: string) => void
  clearUser: () => void
  updateUserField: <K extends keyof User>(key: K, value: User[K]) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setUser: (user, token) => set({ user, token }),

      clearUser: () => set({ user: null, token: null }),

      updateUserField: (key, value) => {
        const currentUser = get().user
        if (!currentUser) return
        set({ user: { ...currentUser, [key]: value } })
      },
    }),
    {
      name: 'user-storage',
      storage: typeof window !== 'undefined'
        ? {
            getItem: (name) => {
              const item = localStorage.getItem(name)
              return item ? JSON.parse(item) : null
            },
            setItem: (name, value) => {
              localStorage.setItem(name, JSON.stringify(value))
            },
            removeItem: (name) => {
              localStorage.removeItem(name)
            }
          }
        : undefined,
    }
  )
)
