import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';
import {RootStackParamList} from '../types/navigation';

const {width} = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Season {
  name: string;
  episodes: any[];
}

const SeriesDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const {seriesName, seriesItems} = route.params as RootStackParamList['SeriesDetail'];

  // Organizar episódios por temporada
  const seasons = useMemo(() => {
    const seasonMap = new Map<string, any[]>();
    
    seriesItems.forEach(item => {
      // Extrair temporada do nome ou categoria
      let seasonName = 'Temporada 1'; // padrão
      
      // Tentar extrair temporada do nome
      const seasonMatch = item.name.match(/temporada\s*(\d+)/i) || 
                         item.name.match(/season\s*(\d+)/i) ||
                         item.name.match(/s(\d+)/i);
      
      if (seasonMatch) {
        seasonName = `Temporada ${seasonMatch[1]}`;
      } else if (item.category) {
        // Usar categoria como temporada se não encontrar no nome
        seasonName = item.category;
      }
      
      if (!seasonMap.has(seasonName)) {
        seasonMap.set(seasonName, []);
      }
      seasonMap.get(seasonName)!.push(item);
    });
    
    // Converter para array e ordenar
    return Array.from(seasonMap.entries())
      .map(([name, episodes]) => ({name, episodes}))
      .sort((a, b) => {
        // Ordenar temporadas numericamente
        const aNum = parseInt(a.name.match(/\d+/)?.[0] || '0');
        const bNum = parseInt(b.name.match(/\d+/)?.[0] || '0');
        return aNum - bNum;
      });
  }, [seriesItems]);

  const handleSeasonPress = (season: Season) => {
    navigation.navigate('SeasonDetail', {
      seriesName,
      seasonName: season.name,
      episodes: season.episodes,
    });
  };

  const renderSeason = ({item}: {item: Season}) => (
    <TouchableOpacity 
      style={styles.seasonItem}
      onPress={() => handleSeasonPress(item)}>
      <View style={styles.seasonHeader}>
        <Ionicons name="folder" size={24} color="#007AFF" />
        <View style={styles.seasonInfo}>
          <Text style={styles.seasonTitle}>{item.name}</Text>
          <Text style={styles.episodeCount}>
            {item.episodes.length} episódio{item.episodes.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{seriesName}</Text>
      </View>

      {/* Seasons List */}
      {seasons.length > 0 ? (
        <FlatList
          data={seasons}
          renderItem={renderSeason}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhuma temporada encontrada para esta série.
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  listContainer: {
    padding: 20,
  },
  seasonItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  seasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  seasonInfo: {
    flex: 1,
    marginLeft: 15,
  },
  seasonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  episodeCount: {
    fontSize: 14,
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

export default SeriesDetailScreen; 