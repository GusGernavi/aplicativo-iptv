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
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';
import {RootStackParamList} from '../types/navigation';

const {width} = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SeasonDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const {seriesName, seasonName, episodes} = route.params as RootStackParamList['SeasonDetail'];

  const handleEpisodePress = (episode: any) => {
    navigation.navigate('Player', {
      url: episode.url,
      title: episode.name,
      type: 'series',
    });
  };

  const renderEpisode = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity 
      style={styles.episodeItem}
      onPress={() => handleEpisodePress(item)}>
      <Image
        source={{uri: item.logo || 'https://via.placeholder.com/120x180/FF3B30/FFFFFF?text=Ep'}}
        style={styles.episodePoster}
        resizeMode="cover"
      />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle}>
          Episódio {index + 1}: {item.name}
        </Text>
        {item.duration && (
          <Text style={styles.episodeDuration}>
            Duração: {item.duration}
          </Text>
        )}
      </View>
      <Ionicons name="play-circle" size={24} color="#007AFF" />
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
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{seriesName}</Text>
          <Text style={styles.headerSubtitle}>{seasonName}</Text>
        </View>
      </View>

      {/* Episodes List */}
      {episodes.length > 0 ? (
        <FlatList
          data={episodes}
          renderItem={renderEpisode}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhum episódio encontrado nesta temporada.
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
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  listContainer: {
    padding: 20,
  },
  episodeItem: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
  },
  episodePoster: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  episodeDuration: {
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

export default SeasonDetailScreen; 