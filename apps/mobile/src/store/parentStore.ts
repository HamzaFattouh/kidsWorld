import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ParentState {
  selectedChildId: string | null;
  setSelectedChildId: (id: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useParentStore = create<ParentState>((set) => ({
  selectedChildId: null,
  
  setSelectedChildId: async (id) => {
    await AsyncStorage.setItem('selectedChildId', id);
    set({ selectedChildId: id });
  },

  hydrate: async () => {
    try {
      const id = await AsyncStorage.getItem('selectedChildId');
      if (id) {
        set({ selectedChildId: id });
      }
    } catch (e) {
      // ignore
    }
  }
}));
