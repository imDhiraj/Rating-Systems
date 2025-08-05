import { create } from 'zustand';

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  rating: number;
  userRating?: number;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  userName: string;
  createdAt: string;
}

interface StoreState {
  stores: Store[];
  ratings: Rating[];
  setStores: (stores: Store[]) => void;
  setRatings: (ratings: Rating[]) => void;
  updateStoreRating: (storeId: string, rating: number, userRating?: number) => void;
}

export const useStoreStore = create<StoreState>((set) => ({
  stores: [],
  ratings: [],
  setStores: (stores) => set({ stores }),
  setRatings: (ratings) => set({ ratings }),
  updateStoreRating: (storeId, rating, userRating) =>
    set((state) => ({
      stores: state.stores.map((store) =>
        store.id === storeId ? { ...store, rating, userRating } : store
      ),
    })),
}));