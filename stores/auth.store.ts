import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, type RegistrationUser, type ResetPasswordUser } from '@/lib/utils/storage';

interface AuthStoreState {
  // Temporary data
  registrationUser: RegistrationUser | null;
  resetPasswordUser: ResetPasswordUser | null;
}

interface AuthStoreActions {
  // Registration flow
  setRegistrationUser: (user: RegistrationUser | null) => void;
  clearRegistrationUser: () => void;
  // Reset password flow
  setResetPasswordUser: (user: ResetPasswordUser | null) => void;
  clearResetPasswordUser: () => void;
  // Clear all temporary data
  clearAllTemporaryData: () => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

export const authStore = create<AuthStore>()(
  persist(
    (set) => ({
      registrationUser: null,
      resetPasswordUser: null,

      setRegistrationUser: (user) => set({ registrationUser: user }),
      clearRegistrationUser: () => set({ registrationUser: null }),

      setResetPasswordUser: (user) => set({ resetPasswordUser: user }),
      clearResetPasswordUser: () => set({ resetPasswordUser: null }),

      clearAllTemporaryData: () =>
        set({
          registrationUser: null,
          resetPasswordUser: null,
        }),
    }),
    {
      name: STORAGE_KEYS.AUTH_TEMP_DATA,
      storage: createJSONStorage(() => AsyncStorage),
      // Save only temporary data
      partialize: (state) => ({
        registrationUser: state.registrationUser,
        resetPasswordUser: state.resetPasswordUser,
      }),
    }
  )
);

export default authStore;
