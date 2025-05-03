import { create } from 'zustand';

import { TUser } from '@/types';

type SelectedUserStore = {
  user: TUser | null;
  setUser: (user: TUser) => void;
};

export const useSelectedUserStore = create<SelectedUserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
