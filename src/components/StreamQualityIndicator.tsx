import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface StreamQualityIndicatorProps {
  isBuffering: boolean;
  hasError: boolean;
  quality?: 'low' | 'medium' | 'high' | 'unknown';
  bitrate?: number;
}

const StreamQualityIndicator: React.FC<StreamQualityIndicatorProps> = ({
  isBuffering,
  hasError,
  quality = 'unknown',
  bitrate,
}) => {
  const getQualityColor = () => {
    switch (quality) {
      case 'high': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'low': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getQualityText = () => {
    switch (quality) {
      case 'high': return 'HD';
      case 'medium': return 'SD';
      case 'low': return 'LD';
      default: return '--';
    }
  };

  if (hasError) {
    return (
      <View style={styles.container}>
        <Ionicons name="alert-circle" size={16} color="#F44336" />
        <Text style={[styles.text, styles.errorText]}>Erro</Text>
      </View>
    );
  }

  if (isBuffering) {
    return (
      <View style={styles.container}>
        <Ionicons name="sync" size={16} color="#FF9800" />
        <Text style={[styles.text, styles.bufferingText]}>Carregando</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.qualityDot, {backgroundColor: getQualityColor()}]} />
      <Text style={styles.text}>{getQualityText()}</Text>
      {bitrate && (
        <Text style={styles.bitrateText}>
          {Math.round(bitrate / 1000)}k
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    color: '#F44336',
  },
  bufferingText: {
    color: '#FF9800',
  },
  bitrateText: {
    color: '#CCCCCC',
    fontSize: 10,
    marginLeft: 4,
  },
});

export default StreamQualityIndicator; 