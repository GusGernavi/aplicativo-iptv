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
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useIPTVStore} from '../store/iptvStore';
import {RootStackParamList} from '../types/navigation';

const {width} = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SeriesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {getFilteredSeries, categories, selectedCategory, setSelectedCategory} = useIPTVStore();
  const series = getFilteredSeries();

  // Agrupar séries por nome
  const groupedSeries = useMemo(() => {
    const seriesMap = new Map<string, any[]>();
    
    series.forEach(item => {
      // Extrair nome da série (remover temporada/episódio do nome)
      let seriesName = item.name;
      
      // Remover padrões de temporada/episódio do nome
      seriesName = seriesName
        .replace(/temporada\s*\d+/i, '')
        .replace(/season\s*\d+/i, '')
        .replace(/s\d+/i, '')
        .replace(/episódio\s*\d+/i, '')
        .replace(/episode\s*\d+/i, '')
        .replace(/e\d+/i, '')
        .replace(/^\s*-\s*/, '') // remover hífens no início
        .replace(/\s*-\s*$/, '') // remover hífens no final
        .trim();
      
      if (!seriesMap.has(seriesName)) {
        seriesMap.set(seriesName, []);
      }
      seriesMap.get(seriesName)!.push(item);
    });
    
    // Converter para array e ordenar
    return Array.from(seriesMap.entries())
      .map(([name, items]) => ({name, items}))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [series]);

  const handleSeriesPress = (seriesGroup: {name: string; items: any[]}) => {
    navigation.navigate('SeriesDetail', {
      seriesName: seriesGroup.name,
      seriesItems: seriesGroup.items,
    });
  };

  const renderSeries = ({item}: {item: {name: string; items: any[]}}) => (
    <TouchableOpacity 
      style={styles.seriesItem}
      onPress={() => handleSeriesPress(item)}>
      <Image
        source={{uri: item.items[0]?.logo || 'https://via.placeholder.com/120x180/FF3B30/FFFFFF?text=Serie'}}
        style={styles.seriesPoster}
        resizeMode="cover"
      />
      <View style={styles.seriesInfo}>
        <Text style={styles.seriesTitle}>{item.name}</Text>
        <Text style={styles.seriesCategory}>
          {item.items.length} episódio{item.items.length !== 1 ? 's' : ''}
        </Text>
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

      {/* Series List */}
      {groupedSeries.length > 0 ? (
        <FlatList
          data={groupedSeries}
          renderItem={renderSeries}
          keyExtractor={(item) => item.name}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedCategory 
              ? `Nenhuma série encontrada na categoria "${selectedCategory}"`
              : 'Nenhuma série carregada. Carregue um arquivo M3U na tela inicial.'
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
  seriesItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    overflow: 'hidden',
  },
  seriesPoster: {
    width: '100%',
    height: 180,
  },
  seriesInfo: {
    padding: 10,
  },
  seriesTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 5,
  },
  seriesCategory: {
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

export default SeriesScreen; 