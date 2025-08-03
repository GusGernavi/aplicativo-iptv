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

const LiveTVScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const {getFilteredChannels, categories, selectedCategory, setSelectedCategory} = useIPTVStore();
  const channels = getFilteredChannels();

  const handleChannelPress = (channel: any) => {
    navigation.navigate('Player', {
      url: channel.url,
      title: channel.name,
      type: 'live',
    });
  };

  const renderChannel = ({item}: {item: any}) => (
    <TouchableOpacity 
      style={styles.channelItem}
      onPress={() => handleChannelPress(item)}>
      <Image
        source={{uri: item.logo || 'https://via.placeholder.com/80x80/007AFF/FFFFFF?text=TV'}}
        style={styles.channelLogo}
        resizeMode="cover"
      />
      <Text style={styles.channelName}>{item.name}</Text>
      {item.category && (
        <Text style={styles.channelCategory}>{item.category}</Text>
      )}
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

      {/* Channels List */}
      {channels.length > 0 ? (
        <FlatList
          data={channels}
          renderItem={renderChannel}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedCategory 
              ? `Nenhum canal encontrado na categoria "${selectedCategory}"`
              : 'Nenhum canal carregado. Carregue um arquivo M3U na tela inicial.'
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
    padding: 20,
  },
  channelItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 5,
  },
  channelLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  channelName: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 5,
  },
  channelCategory: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
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

export default LiveTVScreen; 