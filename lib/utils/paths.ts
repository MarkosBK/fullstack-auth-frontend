import { Href } from 'expo-router';

export const paths = {
  home() {
    return '/(tabs)/index' as Href;
  },
  profile() {
    return '/(tabs)/profile' as Href;
  },
  settings() {
    return '/profile/settings' as Href;
  },

  modals: {
    selectLanguage() {
      return '/select-language/modal' as Href;
    },
  },
};
