import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import {Video, ResizeMode, AVPlaybackStatus} from 'expo-av';
import {Ionicons} from '@expo/vector-icons';
import {useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';

const {width, height} = Dimensions.get('window');

const PlayerScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const videoRef = useRef<Video>(null);
  
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pegar os parâmetros da navegação
  const {url, title, type} = route.params as RootStackParamList['Player'];

  useEffect(() => {
    // Esconder controles após 3 segundos
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = async (direction: 'forward' | 'backward') => {
    if (videoRef.current && status?.isLoaded) {
      const currentPosition = status.positionMillis;
      const seekTime = direction === 'forward' ? currentPosition + 10000 : currentPosition - 10000;
      await videoRef.current.setPositionAsync(Math.max(0, seekTime));
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Aqui você pode implementar a lógica de fullscreen real
    Alert.alert('Fullscreen', 'Funcionalidade de fullscreen será implementada');
  };

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    setStatus(playbackStatus);
    if (playbackStatus.isLoaded) {
      setIsPlaying(playbackStatus.isPlaying);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (status?.isLoaded && status.durationMillis) {
      return status.positionMillis / status.durationMillis;
    }
    return 0;
  };

  return (
    <View style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
      <StatusBar hidden={isFullscreen} />
      
      {/* Video Player */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{uri: url}}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          shouldPlay={true}
          isMuted={false}
          volume={1.0}
          rate={1.0}
          shouldCorrectPitch={true}
          onError={(error) => {
            console.error('Erro no vídeo:', error);
            Alert.alert('Erro', 'Não foi possível reproduzir este vídeo');
          }}
        />

        {/* Overlay para mostrar controles */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowControls(!showControls)}>
          
          {/* Header Controls */}
          {showControls && (
            <View style={styles.headerControls}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={styles.subtitle}>
                  {type === 'live' ? 'TV ao Vivo' : type === 'movie' ? 'Filme' : 'Série'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleFullscreen}>
                <Ionicons 
                  name={isFullscreen ? "contract" : "expand"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Center Play/Pause Button */}
          {showControls && (
            <TouchableOpacity
              style={styles.centerButton}
              onPress={handlePlayPause}>
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={50}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}

          {/* Bottom Controls */}
          {showControls && (
            <View style={styles.bottomControls}>
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      {width: `${getProgress() * 100}%`}
                    ]} 
                  />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {status?.isLoaded ? formatTime(status.positionMillis) : '0:00'}
                  </Text>
                  <Text style={styles.timeText}>
                    {status?.isLoaded && status.durationMillis 
                      ? formatTime(status.durationMillis) 
                      : '--:--'
                    }
                  </Text>
                </View>
              </View>

              {/* Control Buttons */}
              <View style={styles.controlButtons}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handleSeek('backward')}>
                  <Ionicons name="play-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handlePlayPause}>
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={30}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handleSeek('forward')}>
                  <Ionicons name="play-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 2,
  },
  centerButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default PlayerScreen; 