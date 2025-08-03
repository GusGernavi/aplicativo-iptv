export type RootStackParamList = {
  Main: undefined;
  Player: {
    url: string;
    title: string;
    type: 'live' | 'movie' | 'series';
  };
};

export type TabParamList = {
  Home: undefined;
  LiveTV: undefined;
  Movies: undefined;
  Series: undefined;
  Favorites: undefined;
}; 