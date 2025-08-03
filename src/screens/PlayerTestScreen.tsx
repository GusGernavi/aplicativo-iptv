import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';
import {RootStackParamList} from '../types/navigation';
import {
  testStreams,
  hlsTestStreams,
  TestStream,
  runPlayerTest,
  generateTestReport,
} from '../utils/playerTest';
import {
  testNetworkConnectivity,
  validateURL,
  generateConnectivityReport,
  NetworkTestResult,
  URLValidationResult,
} from '../utils/networkUtils';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const PlayerTestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [isRunningNetworkTest, setIsRunningNetworkTest] = useState(false);
  const [testResults, setTestResults] = useState<string>('');
  const [networkResults, setNetworkResults] = useState<NetworkTestResult | null>(null);
  const [urlValidationResults, setUrlValidationResults] = useState<URLValidationResult[]>([]);

  const allStreams = [...testStreams, ...hlsTestStreams];

  const handleStreamPress = (stream: TestStream) => {
    navigation.navigate('Player', {
      url: stream.url,
      title: stream.name,
      type: stream.type,
    });
  };

  const runFullTest = async () => {
    setIsRunningTest(true);
    setTestResults('');
    
    try {
      const result = await runPlayerTest();
      const report = generateTestReport(result.results);
      setTestResults(report);
      
      Alert.alert(
        'Teste Concluído',
        `Taxa de sucesso: ${((result.results.filter(r => r.isAccessible).length / result.results.length) * 100).toFixed(1)}%`,
        [{text: 'OK'}]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao executar teste');
    } finally {
      setIsRunningTest(false);
    }
  };

  const runNetworkTest = async () => {
    setIsRunningNetworkTest(true);
    setNetworkResults(null);
    
    try {
      const result = await testNetworkConnectivity();
      setNetworkResults(result);
      
      const report = generateConnectivityReport(result);
      Alert.alert(
        'Teste de Rede Concluído',
        `Status: ${result.isConnected ? 'Conectado' : 'Desconectado'}\nInternet: ${result.canReachInternet ? 'OK' : 'Problemas'}`,
        [{text: 'OK'}]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao executar teste de rede');
    } finally {
      setIsRunningNetworkTest(false);
    }
  };

  const validateTestURLs = async () => {
    setIsRunningTest(true);
    setUrlValidationResults([]);
    
    try {
      const urls = allStreams.map(stream => stream.url);
      const results = await Promise.all(
        urls.slice(0, 10).map(url => validateURL(url)) // Limitar a 10 URLs para não sobrecarregar
      );
      
      setUrlValidationResults(results);
      
      const validCount = results.filter(r => r.isValid && r.isAccessible).length;
      Alert.alert(
        'Validação de URLs Concluída',
        `${validCount}/${results.length} URLs válidas e acessíveis`,
        [{text: 'OK'}]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao validar URLs');
    } finally {
      setIsRunningTest(false);
    }
  };

  const renderStreamItem = ({item}: {item: TestStream}) => (
    <TouchableOpacity 
      style={styles.streamItem}
      onPress={() => handleStreamPress(item)}>
      <View style={styles.streamHeader}>
        <Text style={styles.streamName}>{item.name}</Text>
        <View style={[styles.qualityBadge, styles[`quality${item.expectedQuality}`]]}>
          <Text style={styles.qualityText}>{item.expectedQuality.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.streamType}>{item.type}</Text>
      <Text style={styles.streamDescription}>{item.description}</Text>
      
      <View style={styles.streamFooter}>
        <Text style={styles.streamUrl} numberOfLines={1}>
          {item.url}
        </Text>
        <Ionicons name="play-circle" size={24} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );

  const renderTestSection = () => (
    <View style={styles.testSection}>
      <Text style={styles.sectionTitle}>Testes de Sistema</Text>
      
      <View style={styles.testButtons}>
        <TouchableOpacity
          style={[styles.testButton, styles.primaryButton]}
          onPress={runFullTest}
          disabled={isRunningTest}>
          {isRunningTest ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Ionicons name="play" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.testButtonText}>
            {isRunningTest ? 'Executando...' : 'Teste Completo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.networkButton]}
          onPress={runNetworkTest}
          disabled={isRunningNetworkTest}>
          {isRunningNetworkTest ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Ionicons name="wifi" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.testButtonText}>
            {isRunningNetworkTest ? 'Testando...' : 'Teste de Rede'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.validationButton]}
          onPress={validateTestURLs}
          disabled={isRunningTest}>
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.testButtonText}>Validar URLs</Text>
        </TouchableOpacity>
      </View>

      {/* Resultados dos testes */}
      {(testResults || networkResults || urlValidationResults.length > 0) && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Resultados dos Testes</Text>
          
          <ScrollView style={styles.resultsScroll}>
            {testResults && (
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>Teste do Player</Text>
                <Text style={styles.resultText}>{testResults}</Text>
              </View>
            )}
            
            {networkResults && (
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>Teste de Rede</Text>
                <Text style={styles.resultText}>
                  Status: {networkResults.isConnected ? '✅ Conectado' : '❌ Desconectado'}{'\n'}
                  Internet: {networkResults.canReachInternet ? '✅ OK' : '❌ Problemas'}{'\n'}
                  DNS: {networkResults.dnsWorking ? '✅ Funcionando' : '❌ Com problemas'}
                </Text>
              </View>
            )}
            
            {urlValidationResults.length > 0 && (
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>Validação de URLs</Text>
                {urlValidationResults.map((result, index) => (
                  <Text key={index} style={styles.resultText}>
                    {index + 1}. {result.isValid && result.isAccessible ? '✅' : '❌'} 
                    {result.error ? ` ${result.error}` : ' OK'}
                  </Text>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Teste do Player de Vídeo</Text>
        <Text style={styles.subtitle}>
          Teste o player com diferentes tipos de conteúdo
        </Text>
      </View>

      {renderTestSection()}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📺 Streams de Teste</Text>
        <Text style={styles.sectionSubtitle}>
          {allStreams.length} streams disponíveis
        </Text>
      </View>

      <FlatList
        data={allStreams}
        renderItem={renderStreamItem}
        keyExtractor={(item) => item.url}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  testSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  testButtons: {
    marginBottom: 20,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    marginBottom: 10,
  },
  networkButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 10,
  },
  validationButton: {
    backgroundColor: '#FF9800',
  },
  resultsContainer: {
    backgroundColor: '#2C2C2E',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  resultsScroll: {
    maxHeight: 200, // Limit scroll height for better readability
  },
  resultSection: {
    marginBottom: 10,
  },
  resultSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 12,
    color: '#CCCCCC',
    lineHeight: 18,
  },
  listContainer: {
    padding: 20,
  },
  streamItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  streamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  streamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  qualityhigh: {
    backgroundColor: '#4CAF50',
  },
  qualitymedium: {
    backgroundColor: '#FF9800',
  },
  qualitylow: {
    backgroundColor: '#F44336',
  },
  qualityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  streamType: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  streamDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 10,
    lineHeight: 20,
  },
  streamFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streamUrl: {
    fontSize: 12,
    color: '#8E8E93',
    flex: 1,
    marginRight: 10,
  },
});

export default PlayerTestScreen; 