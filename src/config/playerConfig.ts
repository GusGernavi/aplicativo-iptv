export interface PlayerConfig {
  // Configurações de reprodução
  defaultVolume: number;
  defaultPlaybackRate: number;
  autoPlay: boolean;
  loop: boolean;
  
  // Configurações de interface
  showControlsTimeout: number;
  showQualityIndicator: boolean;
  showAdvancedControls: boolean;
  
  // Configurações de buffer
  bufferConfig: {
    minBufferMs: number;
    maxBufferMs: number;
    bufferForPlaybackMs: number;
    bufferForPlaybackAfterRebufferMs: number;
  };
  
  // Configurações de qualidade
  qualitySettings: {
    low: {
      maxBitrate: number;
      maxResolution: string;
    };
    medium: {
      maxBitrate: number;
      maxResolution: string;
    };
    high: {
      maxBitrate: number;
      maxResolution: string;
    };
  };
  
  // Configurações de erro
  errorHandling: {
    maxRetries: number;
    retryDelay: number;
    showErrorDialog: boolean;
  };
}

export const defaultPlayerConfig: PlayerConfig = {
  // Configurações de reprodução
  defaultVolume: 1.0,
  defaultPlaybackRate: 1.0,
  autoPlay: true,
  loop: false,
  
  // Configurações de interface
  showControlsTimeout: 3000,
  showQualityIndicator: true,
  showAdvancedControls: true,
  
  // Configurações de buffer
  bufferConfig: {
    minBufferMs: 15000,
    maxBufferMs: 50000,
    bufferForPlaybackMs: 2500,
    bufferForPlaybackAfterRebufferMs: 5000,
  },
  
  // Configurações de qualidade
  qualitySettings: {
    low: {
      maxBitrate: 1000000, // 1 Mbps
      maxResolution: '480p',
    },
    medium: {
      maxBitrate: 3000000, // 3 Mbps
      maxResolution: '720p',
    },
    high: {
      maxBitrate: 8000000, // 8 Mbps
      maxResolution: '1080p',
    },
  },
  
  // Configurações de erro
  errorHandling: {
    maxRetries: 3,
    retryDelay: 2000,
    showErrorDialog: true,
  },
};

// Função para obter configuração personalizada
export const getPlayerConfig = (customConfig?: Partial<PlayerConfig>): PlayerConfig => {
  return {
    ...defaultPlayerConfig,
    ...customConfig,
  };
};

// Função para determinar qualidade baseada no tipo de conteúdo
export const getQualityForContentType = (type: 'live' | 'movie' | 'series'): 'low' | 'medium' | 'high' => {
  switch (type) {
    case 'live':
      return 'high'; // TV ao vivo geralmente precisa de melhor qualidade
    case 'movie':
      return 'medium'; // Filmes podem ter qualidade média
    case 'series':
      return 'medium'; // Séries também podem ter qualidade média
    default:
      return 'medium';
  }
};

// Função para obter configurações de buffer baseadas na qualidade
export const getBufferConfigForQuality = (quality: 'low' | 'medium' | 'high') => {
  const baseConfig = defaultPlayerConfig.bufferConfig;
  
  switch (quality) {
    case 'high':
      return {
        ...baseConfig,
        minBufferMs: 20000, // Mais buffer para alta qualidade
        maxBufferMs: 60000,
      };
    case 'low':
      return {
        ...baseConfig,
        minBufferMs: 10000, // Menos buffer para baixa qualidade
        maxBufferMs: 30000,
      };
    default:
      return baseConfig;
  }
}; 