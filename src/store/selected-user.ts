import { TUser } from '@/types';
import { create } from 'zustand';

type SelectedUserStore = {
  user: TUser | null;
  setUser: (user: TUser) => void;
};

export const useSelectedUserStore = create<SelectedUserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
