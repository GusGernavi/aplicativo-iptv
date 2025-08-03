import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const FavoritesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favoritos</Text>
      <Text style={styles.subtext}>Seus canais favoritos aparecerão aqui</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default FavoritesScreen; 