// Utilitário para testar o player de vídeo
// Este arquivo contém URLs de exemplo para testar diferentes tipos de conteúdo

export interface TestStream {
  name: string;
  url: string;
  type: 'live' | 'movie' | 'series';
  description: string;
  expectedQuality: 'low' | 'medium' | 'high';
}

export const testStreams: TestStream[] = [
  // Streams de TV ao Vivo (Live)
  {
    name: 'Big Buck Bunny (Live)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'live',
    description: 'Vídeo de teste em alta qualidade para TV ao vivo',
    expectedQuality: 'high',
  },
  {
    name: 'Elephant Dream (Live)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'live',
    description: 'Vídeo de teste em qualidade média para TV ao vivo',
    expectedQuality: 'medium',
  },
  
  // Filmes
  {
    name: 'Sintel (Movie)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    type: 'movie',
    description: 'Filme de teste em alta qualidade',
    expectedQuality: 'high',
  },
  {
    name: 'Tears of Steel (Movie)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'movie',
    description: 'Filme de teste em qualidade média',
    expectedQuality: 'medium',
  },
  
  // Séries
  {
    name: 'Subaru Outback (Series)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    type: 'series',
    description: 'Episódio de série de teste',
    expectedQuality: 'medium',
  },
  {
    name: 'Volkswagen GTI (Series)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    type: 'series',
    description: 'Episódio de série de teste em baixa qualidade',
    expectedQuality: 'low',
  },
];

// Streams HLS de teste (mais próximos de IPTV real)
export const hlsTestStreams: TestStream[] = [
  {
    name: 'HLS Test Stream 1',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    type: 'live',
    description: 'Stream HLS de teste público',
    expectedQuality: 'high',
  },
  {
    name: 'HLS Test Stream 2',
    url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    type: 'movie',
    description: 'Stream HLS Sintel (filme)',
    expectedQuality: 'high',
  },
];

// Função para obter streams de teste por tipo
export const getTestStreamsByType = (type: 'live' | 'movie' | 'series'): TestStream[] => {
  return testStreams.filter(stream => stream.type === type);
};

// Função para obter um stream de teste aleatório
export const getRandomTestStream = (): TestStream => {
  const allStreams = [...testStreams, ...hlsTestStreams];
  const randomIndex = Math.floor(Math.random() * allStreams.length);
  return allStreams[randomIndex];
};

// Função para validar URL de stream
export const validateStreamUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Função para testar conectividade do stream
export const testStreamConnectivity = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Função para obter informações do stream
export const getStreamInfo = async (url: string): Promise<{
  isAccessible: boolean;
  contentType?: string;
  contentLength?: number;
  lastModified?: string;
}> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    if (response.ok) {
      return {
        isAccessible: true,
        contentType: response.headers.get('content-type') || undefined,
        contentLength: response.headers.get('content-length') 
          ? parseInt(response.headers.get('content-length')!) 
          : undefined,
        lastModified: response.headers.get('last-modified') || undefined,
      };
    } else {
      return { isAccessible: false };
    }
  } catch {
    return { isAccessible: false };
  }
};

// Função para simular teste completo do player
export const runPlayerTest = async (): Promise<{
  success: boolean;
  results: Array<{
    stream: TestStream;
    isAccessible: boolean;
    error?: string;
  }>;
}> => {
  const results = [];
  const allStreams = [...testStreams, ...hlsTestStreams];
  
  for (const stream of allStreams) {
    try {
      const isAccessible = await testStreamConnectivity(stream.url);
      results.push({
        stream,
        isAccessible,
        error: isAccessible ? undefined : 'Stream não acessível',
      });
    } catch (error) {
      results.push({
        stream,
        isAccessible: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
  
  const success = results.some(result => result.isAccessible);
  
  return { success, results };
};

// Função para gerar relatório de teste
export const generateTestReport = (results: Array<{
  stream: TestStream;
  isAccessible: boolean;
  error?: string;
}>): string => {
  const total = results.length;
  const accessible = results.filter(r => r.isAccessible).length;
  const failed = total - accessible;
  
  let report = `📊 Relatório de Teste do Player\n\n`;
  report += `Total de streams testados: ${total}\n`;
  report += `Streams acessíveis: ${accessible}\n`;
  report += `Streams com erro: ${failed}\n`;
  report += `Taxa de sucesso: ${((accessible / total) * 100).toFixed(1)}%\n\n`;
  
  report += `📺 Streams por Tipo:\n`;
  const byType = results.reduce((acc, result) => {
    const type = result.stream.type;
    if (!acc[type]) acc[type] = { total: 0, accessible: 0 };
    acc[type].total++;
    if (result.isAccessible) acc[type].accessible++;
    return acc;
  }, {} as Record<string, { total: number; accessible: number }>);
  
  Object.entries(byType).forEach(([type, stats]) => {
    report += `  ${type}: ${stats.accessible}/${stats.total} (${((stats.accessible / stats.total) * 100).toFixed(1)}%)\n`;
  });
  
  if (failed > 0) {
    report += `\n❌ Streams com Erro:\n`;
    results.filter(r => !r.isAccessible).forEach(result => {
      report += `  - ${result.stream.name}: ${result.error}\n`;
    });
  }
  
  return report;
}; 