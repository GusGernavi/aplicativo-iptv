import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {Video, ResizeMode, AVPlaybackStatus} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import {Ionicons} from '@expo/vector-icons';
import {useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import VideoControls from '../components/VideoControls';
import StreamQualityIndicator from '../components/StreamQualityIndicator';
import {defaultPlayerConfig, getQualityForContentType} from '../config/playerConfig';

const {width, height} = Dimensions.get('window');

const PlayerScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const videoRef = useRef<Video>(null);
  
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(defaultPlayerConfig.defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(defaultPlayerConfig.defaultPlaybackRate);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [streamQuality, setStreamQuality] = useState<'low' | 'medium' | 'high' | 'unknown'>('unknown');
  const [bitrate, setBitrate] = useState<number | undefined>(undefined);
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    originalError: any;
    timestamp: string;
  } | null>(null);

  // Pegar os parâmetros da navegação
  const {url, title, type} = route.params as RootStackParamList['Player'];

  useEffect(() => {
    // Configurar orientação para horizontal automaticamente
    const setLandscapeOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.warn('Erro ao definir orientação:', error);
      }
    };

    setLandscapeOrientation();

    // Configurar back handler para fullscreen
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isFullscreen) {
        setIsFullscreen(false);
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
      // Restaurar orientação ao sair
      ScreenOrientation.unlockAsync();
    };
  }, [isFullscreen]);

  useEffect(() => {
    // Esconder controles após o tempo configurado
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, defaultPlayerConfig.showControlsTimeout);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Erro ao controlar reprodução:', error);
        Alert.alert('Erro', 'Não foi possível controlar a reprodução');
      }
    }
  };

  const handleSeek = async (direction: 'forward' | 'backward') => {
    // Desabilitar seek para conteúdo ao vivo
    if (type === 'live') {
      return;
    }
    
    if (videoRef.current && status?.isLoaded) {
      try {
        const currentPosition = status.positionMillis;
        const seekTime = direction === 'forward' ? currentPosition + 10000 : currentPosition - 10000;
        await videoRef.current.setPositionAsync(Math.max(0, seekTime));
      } catch (error) {
        console.error('Erro ao buscar:', error);
      }
    }
  };

  const handleVolumeToggle = async () => {
    if (videoRef.current) {
      try {
        if (isMuted) {
          await videoRef.current.setVolumeAsync(volume);
          setIsMuted(false);
        } else {
          await videoRef.current.setVolumeAsync(0);
          setIsMuted(true);
        }
      } catch (error) {
        console.error('Erro ao controlar volume:', error);
      }
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    if (videoRef.current) {
      try {
        setVolume(newVolume);
        if (!isMuted) {
          await videoRef.current.setVolumeAsync(newVolume);
        }
      } catch (error) {
        console.error('Erro ao alterar volume:', error);
      }
    }
  };

  const handlePlaybackRateChange = async (rate: number) => {
    // Desabilitar controle de velocidade para conteúdo ao vivo
    if (type === 'live') {
      return;
    }
    
    if (videoRef.current) {
      try {
        setPlaybackRate(rate);
        await videoRef.current.setRateAsync(rate, true);
      } catch (error) {
        console.error('Erro ao alterar velocidade:', error);
      }
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setShowControls(true);
  };

  const onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    setStatus(playbackStatus);
    
    if (playbackStatus.isLoaded) {
      setIsPlaying(playbackStatus.isPlaying);
      setIsLoading(false);
      setHasError(false);
      
      // Determinar qualidade baseada no status
      if (playbackStatus.isBuffering) {
        setStreamQuality('unknown');
      } else {
        // Usar função de configuração para determinar qualidade
        const quality = getQualityForContentType(type);
        setStreamQuality(quality);
        
        // Simular bitrate baseado na qualidade
        const qualitySettings = defaultPlayerConfig.qualitySettings[quality];
        setBitrate(qualitySettings.maxBitrate / 1000); // Converter para kbps
      }
    } else if (playbackStatus.error) {
      setIsLoading(false);
      setHasError(true);
      console.error('Erro de reprodução:', playbackStatus.error);
    }
  };

  const onLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const onLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const onError = (error: any) => {
    console.error('ERROR Erro no vídeo:', error);
    setHasError(true);
    setIsLoading(false);
    
    // Analisar o tipo de erro para fornecer feedback mais específico
    let errorMessage = 'Erro desconhecido ao reproduzir o vídeo';
    
    if (error && typeof error === 'object') {
      const errorString = JSON.stringify(error);
      
      // Verificar se é erro de hostname não encontrado
      if (errorString.includes('UnknownHostException') || 
          errorString.includes('Unable to resolve host') ||
          errorString.includes('aguacomgas.shop')) {
        errorMessage = 'Servidor não encontrado. Verifique sua conexão com a internet ou tente novamente mais tarde.';
      }
      // Verificar se é erro de timeout
      else if (errorString.includes('timeout') || errorString.includes('TIMEOUT')) {
        errorMessage = 'Tempo limite excedido. O servidor pode estar sobrecarregado.';
      }
      // Verificar se é erro de conexão
      else if (errorString.includes('Connection') || errorString.includes('Network')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      // Verificar se é erro de formato não suportado
      else if (errorString.includes('format') || errorString.includes('codec')) {
        errorMessage = 'Formato de vídeo não suportado pelo dispositivo.';
      }
      // Verificar se é erro de acesso negado
      else if (errorString.includes('403') || errorString.includes('Forbidden')) {
        errorMessage = 'Acesso negado. Este conteúdo pode estar restrito.';
      }
      // Verificar se é erro de conteúdo não encontrado
      else if (errorString.includes('404') || errorString.includes('Not Found')) {
        errorMessage = 'Conteúdo não encontrado. O link pode estar quebrado.';
      }
    }
    
    setErrorDetails({
      message: errorMessage,
      originalError: error,
      timestamp: new Date().toISOString(),
    });
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

  const getTypeLabel = () => {
    switch (type) {
      case 'live': return 'TV ao Vivo';
      case 'movie': return 'Filme';
      case 'series': return 'Série';
      default: return 'Vídeo';
    }
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
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onError={onError}
          shouldPlay={true}
          isMuted={isMuted}
          volume={volume}
          rate={1.0}
          shouldCorrectPitch={true}
          // Configurações para melhor compatibilidade
          progressUpdateIntervalMillis={1000}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}

        {/* Error State */}
        {hasError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color="#FF3B30" />
            <Text style={styles.errorTitle}>Erro de Reprodução</Text>
            <Text style={styles.errorText}>
              {errorDetails?.message || 'Erro ao carregar o vídeo. Verifique sua conexão.'}
            </Text>
            
            <View style={styles.errorActions}>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  setHasError(false);
                  setErrorDetails(null);
                  setIsLoading(true);
                  if (videoRef.current) {
                    videoRef.current.loadAsync({uri: url}, {}, false);
                  }
                }}>
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
            
            {__DEV__ && errorDetails && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Info (Dev Mode)</Text>
                <Text style={styles.debugText}>URL: {url}</Text>
                <Text style={styles.debugText}>Tipo: {type}</Text>
                <Text style={styles.debugText}>Timestamp: {errorDetails.timestamp}</Text>
              </View>
            )}
          </View>
        )}

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
                  {getTypeLabel()}
                </Text>
              </View>

              <View style={styles.headerRightControls}>
                {defaultPlayerConfig.showQualityIndicator && (
                  <StreamQualityIndicator
                    isBuffering={isLoading}
                    hasError={hasError}
                    quality={streamQuality}
                    bitrate={bitrate}
                  />
                )}
                
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => setShowAdvancedControls(true)}>
                  <Ionicons name="settings" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
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
            </View>
          )}

          {/* Center Play/Pause Button */}
          {showControls && !isLoading && !hasError && (
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
          {showControls && !isLoading && !hasError && (
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
                {type !== 'live' && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => handleSeek('backward')}>
                    <Ionicons name="play-back" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handlePlayPause}>
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={30}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                {type !== 'live' && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => handleSeek('forward')}>
                    <Ionicons name="play-forward" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Advanced Video Controls Modal */}
      <VideoControls
        isVisible={showAdvancedControls}
        onClose={() => setShowAdvancedControls(false)}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onMuteToggle={handleVolumeToggle}
        playbackRate={playbackRate}
        onPlaybackRateChange={handlePlaybackRateChange}
        contentType={type}
      />
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
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#8E8E93',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    maxWidth: '90%',
  },
  debugTitle: {
    color: '#FF9500',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  debugText: {
    color: '#CCCCCC',
    fontSize: 12,
    marginBottom: 5,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  headerRightControls: {
    flexDirection: 'row',
    gap: 10,
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