export interface NetworkTestResult {
  isConnected: boolean;
  canReachInternet: boolean;
  dnsWorking: boolean;
  testUrls: Array<{
    url: string;
    isAccessible: boolean;
    responseTime?: number;
    error?: string;
  }>;
}

export interface URLValidationResult {
  isValid: boolean;
  isAccessible: boolean;
  responseTime?: number;
  contentType?: string;
  error?: string;
}

/**
 * Testa a conectividade básica da rede
 */
export const testNetworkConnectivity = async (): Promise<NetworkTestResult> => {
  const testUrls = [
    'https://www.google.com',
    'https://www.cloudflare.com',
    'https://httpbin.org/get',
  ];

  const results: NetworkTestResult = {
    isConnected: false,
    canReachInternet: false,
    dnsWorking: false,
    testUrls: [],
  };

  try {
    // Testar URLs básicas
    for (const url of testUrls) {
      const startTime = Date.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            'User-Agent': 'IPTV-App/1.0',
          },
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - startTime;

        results.testUrls.push({
          url,
          isAccessible: response.ok,
          responseTime,
        });

        if (response.ok) {
          results.canReachInternet = true;
          results.dnsWorking = true;
        }
      } catch (error) {
        const responseTime = Date.now() - startTime;
        results.testUrls.push({
          url,
          isAccessible: false,
          responseTime,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Determinar se há conectividade básica
    results.isConnected = results.testUrls.some(test => test.isAccessible);

    return results;
  } catch (error) {
    console.error('Erro ao testar conectividade:', error);
    return results;
  }
};

/**
 * Valida uma URL específica e testa sua acessibilidade
 */
export const validateURL = async (url: string): Promise<URLValidationResult> => {
  const result: URLValidationResult = {
    isValid: false,
    isAccessible: false,
  };

  try {
    // Validar formato da URL
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      result.error = 'Protocolo não suportado';
      return result;
    }

    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      result.error = 'Hostname inválido';
      return result;
    }

    result.isValid = true;

    // Testar acessibilidade
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'IPTV-App/1.0',
        },
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      result.isAccessible = response.ok;
      result.responseTime = responseTime;
      result.contentType = response.headers.get('content-type') || undefined;

      if (!response.ok) {
        result.error = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      result.responseTime = responseTime;

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          result.error = 'Timeout - servidor não respondeu em 15 segundos';
        } else if (error.message.includes('Network request failed')) {
          result.error = 'Falha na requisição de rede';
        } else if (error.message.includes('Unable to resolve host')) {
          result.error = 'Hostname não pode ser resolvido (DNS)';
        } else {
          result.error = error.message;
        }
      } else {
        result.error = 'Erro desconhecido';
      }
    }
  } catch (error) {
    result.error = 'URL malformada';
  }

  return result;
};

/**
 * Testa múltiplas URLs de uma vez
 */
export const validateMultipleURLs = async (urls: string[]): Promise<URLValidationResult[]> => {
  const results: URLValidationResult[] = [];
  
  for (const url of urls) {
    const result = await validateURL(url);
    results.push(result);
    
    // Pequena pausa entre requisições para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};

/**
 * Gera um relatório de conectividade
 */
export const generateConnectivityReport = (networkTest: NetworkTestResult): string => {
  let report = '=== RELATÓRIO DE CONECTIVIDADE ===\n\n';
  
  report += `Status Geral:\n`;
  report += `- Conectado: ${networkTest.isConnected ? '✅ Sim' : '❌ Não'}\n`;
  report += `- Internet: ${networkTest.canReachInternet ? '✅ Acessível' : '❌ Inacessível'}\n`;
  report += `- DNS: ${networkTest.dnsWorking ? '✅ Funcionando' : '❌ Com problemas'}\n\n`;
  
  report += `Testes de URL:\n`;
  networkTest.testUrls.forEach((test, index) => {
    report += `${index + 1}. ${test.url}\n`;
    report += `   Status: ${test.isAccessible ? '✅ OK' : '❌ Falhou'}\n`;
    if (test.responseTime) {
      report += `   Tempo: ${test.responseTime}ms\n`;
    }
    if (test.error) {
      report += `   Erro: ${test.error}\n`;
    }
    report += '\n';
  });
  
  return report;
}; 