import { create } from "zustand";

interface AppStore {
	isLoading: boolean
	setIsLoading: (b:boolean)=>void
}
export const useAppStore = create<AppStore>()((set)=>({
	isLoading: false,
	setIsLoading: (bool) => set({ isLoading: bool})
}))
