import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useIPTVStore} from '../store/iptvStore';

const M3ULoader: React.FC = () => {
  const [url, setUrl] = useState('http://supg.nl/get.php?username=5653604&password=8565171&type=m3u_plus&output=mpegts');
  const {loadM3UFromUrl, loadM3UFromFile, isLoading, error} = useIPTVStore();

  // Carregar automaticamente quando o componente montar
  useEffect(() => {
    handleLoadFromUrl();
  }, []);

  const handleLoadFromUrl = async () => {
    try {
      await loadM3UFromUrl(url.trim());
      Alert.alert('Sucesso', 'M3U carregado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar M3U');
    }
  };

  const handleLoadFromFile = () => {
    // Para React Native, precisamos usar uma biblioteca de seleção de arquivos
    // Por enquanto, vamos simular com dados de exemplo
    Alert.alert(
      'Carregar Arquivo',
      'Funcionalidade de arquivo será implementada em breve. Use a URL por enquanto.',
      [{text: 'OK'}]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carregar Lista IPTV</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Cole a URL do arquivo M3U aqui..."
          placeholderTextColor="#8E8E93"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLoadFromUrl}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Carregar da URL</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleLoadFromFile}>
        <Text style={styles.buttonText}>Carregar Arquivo</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Text style={styles.helpText}>
        A URL do seu M3U já está preenchida e será carregada automaticamente.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#1C1C1E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#3C3C3E',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#666666',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  helpText: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
});

export default M3ULoader; 