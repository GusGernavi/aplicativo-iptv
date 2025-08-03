import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useIPTVStore} from '../store/iptvStore';
import {RootStackParamList} from '../types/navigation';

const {width} = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MoviesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {getFilteredMovies, categories, selectedCategory, setSelectedCategory} = useIPTVStore();
  const movies = getFilteredMovies();

  const handleMoviePress = (movie: any) => {
    navigation.navigate('Player', {
      url: movie.url,
      title: movie.name,
      type: 'movie',
    });
  };

  const renderMovie = ({item}: {item: any}) => (
    <TouchableOpacity 
      style={styles.movieItem}
      onPress={() => handleMoviePress(item)}>
      <Image
        source={{uri: item.logo || 'https://via.placeholder.com/120x180/007AFF/FFFFFF?text=Filme'}}
        style={styles.moviePoster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.name}</Text>
        {item.category && (
          <Text style={styles.movieCategory}>{item.category}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = ({item}: {item: string}) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item ? null : item)}>
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === item && styles.categoryButtonTextActive,
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      {categories.length > 0 && (
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Filtrar por Categoria:</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryButton}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        </View>
      )}

      {/* Movies List */}
      {movies.length > 0 ? (
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedCategory 
              ? `Nenhum filme encontrado na categoria "${selectedCategory}"`
              : 'Nenhum filme carregado. Carregue um arquivo M3U na tela inicial.'
            }
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  categoryList: {
    paddingRight: 20,
  },
  categoryButton: {
    backgroundColor: '#2C2C2E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  movieItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    overflow: 'hidden',
  },
  moviePoster: {
    width: '100%',
    height: 180,
  },
  movieInfo: {
    padding: 10,
  },
  movieTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 5,
  },
  movieCategory: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MoviesScreen; 