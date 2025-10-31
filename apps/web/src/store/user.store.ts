import { type User } from "better-auth"
import { create } from "zustand"

interface UserStore {
    user: User | null
    setUser: (user: User) => void
    clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    clearUser: () => set({ user: null }),
}))