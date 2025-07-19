import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserType } from 'website-lib'

interface UserStore {
  user: UserType | null
  token: string | null
  setUser: (user: UserType, token: string) => void
  clearUser: () => void
  updateUserField: <K extends keyof UserType>(key: K, value: UserType[K]) => void
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
      }
    }),
    {
      name: 'user-storage',
      storage:
        typeof window !== 'undefined'
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
          : undefined
    }
  )
)
