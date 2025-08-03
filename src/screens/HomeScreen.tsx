import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import M3ULoader from '../components/M3ULoader';
import {useIPTVStore} from '../store/iptvStore';
import {RootStackParamList} from '../types/navigation';

const {width, height} = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showLoader, setShowLoader] = useState(true); // Mostrar automaticamente
  const {channels, movies, series, categories, selectedCategory, setSelectedCategory} = useIPTVStore();

  const featuredContent = [
    ...movies.slice(0, 2).map(movie => ({
      id: movie.id,
      title: movie.name,
      image: movie.logo || 'https://via.placeholder.com/400x225/007AFF/FFFFFF?text=Filme',
      type: 'movie' as const,
      url: movie.url,
    })),
    ...series.slice(0, 1).map(show => ({
      id: show.id,
      title: show.name,
      image: show.logo || 'https://via.placeholder.com/400x225/FF3B30/FFFFFF?text=Serie',
      type: 'series' as const,
      url: show.url,
    })),
  ];

  const recentChannels = channels.slice(0, 6).map(channel => ({
    id: channel.id,
    title: channel.name,
    image: channel.logo || 'https://via.placeholder.com/200x112/34C759/FFFFFF?text=Canal',
    url: channel.url,
  }));

  const handleFeaturedPress = (item: any) => {
    navigation.navigate('Player', {
      url: item.url,
      title: item.title,
      type: item.type,
    });
  };

  const handleChannelPress = (channel: any) => {
    navigation.navigate('Player', {
      url: channel.url,
      title: channel.title,
      type: 'live',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#1C1C1E', '#2C2C2E']}
        style={styles.header}>
        <Text style={styles.headerTitle}>IPTV App</Text>
        <Text style={styles.headerSubtitle}>Sua TV em qualquer lugar</Text>
        
        <TouchableOpacity
          style={styles.loadButton}
          onPress={() => setShowLoader(!showLoader)}>
          <Text style={styles.loadButtonText}>
            {showLoader ? 'Ocultar' : 'Mostrar'} Carregador
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* M3U Loader */}
      {showLoader && <M3ULoader />}

      {/* Category Filter */}
      {categories.length > 0 && (
        <View style={styles.categoryContainer}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                !selectedCategory && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(null)}>
              <Text style={[
                styles.categoryButtonText,
                !selectedCategory && styles.categoryButtonTextActive,
              ]}>
                Todas
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}>
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive,
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Featured Content */}
      {featuredContent.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Em Destaque</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredContent.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.featuredCard}
                onPress={() => handleFeaturedPress(item)}>
                <Image
                  source={{uri: item.image}}
                  style={styles.featuredImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.featuredOverlay}>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Recent Channels */}
      {recentChannels.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Canais Recentes</Text>
          <View style={styles.gridContainer}>
            {recentChannels.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.gridItem}
                onPress={() => handleChannelPress(item)}>
                <Image
                  source={{uri: item.image}}
                  style={styles.gridImage}
                  resizeMode="cover"
                />
                <Text style={styles.gridTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>TV ao Vivo ({channels.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Filmes ({movies.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Séries ({series.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Developer Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ferramentas de Desenvolvimento</Text>
        <TouchableOpacity 
          style={styles.devButton}
          onPress={() => navigation.navigate('PlayerTest')}>
          <Text style={styles.devButtonText}>🧪 Testar Player de Vídeo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
  },
  loadButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  loadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  featuredCard: {
    width: width * 0.8,
    height: 200,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    padding: 15,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 60) / 3,
    marginBottom: 15,
  },
  gridImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  gridTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  devButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  devButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HomeScreen; 