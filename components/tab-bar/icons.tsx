import { Feather } from '@expo/vector-icons';
export const icons = {
  index: ({ color }: { color: string }) => <Feather name="home" size={22} color={color} />,
  profile: ({ color }: { color: string }) => <Feather name="user" size={22} color={color} />,
  news: ({ color }: { color: string }) => <Feather name="list" size={22} color={color} />,
  search: ({ color }: { color: string }) => <Feather name="search" size={22} color={color} />,
};
