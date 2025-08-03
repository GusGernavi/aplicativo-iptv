export type RootStackParamList = {
  Main: undefined;
  Player: {
    url: string;
    title: string;
    type: 'live' | 'movie' | 'series';
  };
  SeriesDetail: {
    seriesName: string;
    seriesItems: any[];
  };
  SeasonDetail: {
    seriesName: string;
    seasonName: string;
    episodes: any[];
  };
  PlayerTest: undefined;
};

export type TabParamList = {
  Home: undefined;
  LiveTV: undefined;
  Movies: undefined;
  Series: undefined;
  Favorites: undefined;
}; 