import {create} from 'zustand';
import {M3UItem, M3UData, m3uParser} from '../services/m3uParser';

interface IPTVStore {
  // Data
  channels: M3UItem[];
  movies: M3UItem[];
  series: M3UItem[];
  categories: string[];
  
  // UI State
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadM3UFromUrl: (url: string, forceRefresh?: boolean) => Promise<void>;
  loadM3UFromFile: (file: File) => Promise<void>;
  setSelectedCategory: (category: string | null) => void;
  clearError: () => void;
  
  // Computed
  getFilteredChannels: () => M3UItem[];
  getFilteredMovies: () => M3UItem[];
  getFilteredSeries: () => M3UItem[];
}

export const useIPTVStore = create<IPTVStore>((set, get) => ({
  // Initial state
  channels: [],
  movies: [],
  series: [],
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,

  // Actions
  loadM3UFromUrl: async (url: string, forceRefresh: boolean = false) => {
    set({isLoading: true, error: null});
    
    try {
      const data: M3UData = await m3uParser.fetchM3U(url, forceRefresh);
      
      set({
        channels: data.channels,
        movies: data.movies,
        series: data.series,
        categories: data.categories,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar M3U',
        isLoading: false,
      });
    }
  },

  loadM3UFromFile: async (file: File) => {
    set({isLoading: true, error: null});
    
    try {
      const data: M3UData = await m3uParser.fetchM3UFromFile(file);
      
      set({
        channels: data.channels,
        movies: data.movies,
        series: data.series,
        categories: data.categories,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar arquivo',
        isLoading: false,
      });
    }
  },

  setSelectedCategory: (category: string | null) => {
    set({selectedCategory: category});
  },

  clearError: () => {
    set({error: null});
  },

  // Computed getters
  getFilteredChannels: () => {
    const {channels, selectedCategory} = get();
    if (!selectedCategory) return channels;
    return channels.filter(channel => channel.category === selectedCategory);
  },

  getFilteredMovies: () => {
    const {movies, selectedCategory} = get();
    if (!selectedCategory) return movies;
    return movies.filter(movie => movie.category === selectedCategory);
  },

  getFilteredSeries: () => {
    const {series, selectedCategory} = get();
    if (!selectedCategory) return series;
    return series.filter(show => show.category === selectedCategory);
  },
})); 