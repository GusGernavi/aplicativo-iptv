import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface VideoControlsProps {
  isVisible: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  contentType?: 'live' | 'movie' | 'series';
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isVisible,
  onClose,
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle,
  playbackRate,
  onPlaybackRateChange,
  contentType = 'movie',
}) => {
  const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Configurações</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Volume Control */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons 
                name={isMuted ? "volume-mute" : "volume-high"} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text style={styles.sectionTitle}>Volume</Text>
            </View>
            <View style={styles.volumeContainer}>
              <View style={styles.volumeButtons}>
                <TouchableOpacity 
                  style={styles.volumeButton}
                  onPress={() => onVolumeChange(Math.max(0, volume - 0.1))}>
                  <Ionicons name="remove" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                
                <Text style={styles.volumeText}>
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </Text>
                
                <TouchableOpacity 
                  style={styles.volumeButton}
                  onPress={() => onVolumeChange(Math.min(1, volume + 0.1))}>
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity onPress={onMuteToggle} style={styles.muteButton}>
                <Ionicons 
                  name={isMuted ? "volume-mute" : "volume-high"} 
                  size={20} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Playback Rate Control - Desabilitado para conteúdo ao vivo */}
          {contentType !== 'live' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="speedometer" size={20} color="#FFFFFF" />
                <Text style={styles.sectionTitle}>Velocidade</Text>
              </View>
              <View style={styles.rateContainer}>
                {playbackRates.map((rate) => (
                  <TouchableOpacity
                    key={rate}
                    style={[
                      styles.rateButton,
                      playbackRate === rate && styles.rateButtonActive,
                    ]}
                    onPress={() => onPlaybackRateChange(rate)}>
                    <Text style={[
                      styles.rateButtonText,
                      playbackRate === rate && styles.rateButtonTextActive,
                    ]}>
                      {rate}x
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  volumeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 15,
    minWidth: 50,
    textAlign: 'center',
  },
  muteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rateButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: '#2C2C2E',
    minWidth: 50,
    alignItems: 'center',
  },
  rateButtonActive: {
    backgroundColor: '#007AFF',
  },
  rateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  rateButtonTextActive: {
    fontWeight: 'bold',
  },
});

export default VideoControls; 