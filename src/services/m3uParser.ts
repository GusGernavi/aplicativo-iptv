export interface M3UItem {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
  type: 'live' | 'movie' | 'series';
  category?: string;
  description?: string;
  duration?: string;
  isValid?: boolean; // Nova propriedade para indicar se a URL é válida
}

export interface M3UData {
  channels: M3UItem[];
  movies: M3UItem[];
  series: M3UItem[];
  categories: string[];
}

export interface M3UCache {
  data: M3UData;
  url: string;
  timestamp: number;
  lastModified?: string;
}

class M3UParser {
  private cache: M3UCache | null = null;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos em millisegundos

  // Função para validar URL
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      // Verificar se o protocolo é http ou https
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return false;
      }
      // Verificar se o hostname não está vazio
      if (!urlObj.hostname || urlObj.hostname.length === 0) {
        return false;
      }
      // Verificar se o hostname não contém caracteres inválidos
      if (urlObj.hostname.includes(' ') || urlObj.hostname.includes('\t')) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // Função para testar conectividade da URL (opcional)
  private async testUrlConnectivity(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
      
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'IPTV-App/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      return response.ok || response.status < 400;
    } catch {
      return false;
    }
  }

  // Função para transformar URLs - substitui aguacomgas.shop por supg.nl
  private transformUrl(url: string): string {
    try {
      // Verificar se a URL contém o host problemático
      if (url.includes('aguacomgas.shop')) {
        const transformedUrl = url.replace(/aguacomgas\.shop/g, 'supg.nl');
        return transformedUrl;
      }
      return url;
    } catch (error) {
      console.warn(`⚠️ Erro ao transformar URL: ${url}`, error);
      return url;
    }
  }

  private parseM3UContent(content: string): M3UItem[] {
    const lines = content.split('\n');
    const items: M3UItem[] = [];
    let currentItem: Partial<M3UItem> = {};
    let invalidUrlsCount = 0;
    let transformedUrlsCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('#EXTINF:')) {
        // Parse EXTINF line
        const info = this.parseExtInf(line);
        currentItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: info.name,
          logo: info.logo,
          group: info.group,
          type: this.determineType(info.name, info.group),
          category: info.group,
          duration: info.duration,
        };
      } else if (line.startsWith('http') && currentItem.name) {
        // URL line - transformar e validar antes de adicionar
        const transformedUrl = this.transformUrl(line);
        if (transformedUrl !== line) {
          transformedUrlsCount++;
        }
        const isValidUrl = this.isValidUrl(transformedUrl);
        if (isValidUrl) {
          currentItem.url = transformedUrl;
          currentItem.isValid = true;
          items.push(currentItem as M3UItem);
        } else {
          invalidUrlsCount++;
          console.warn(`⚠️ URL inválida ignorada: ${transformedUrl}`);
        }
        currentItem = {};
      }
    }

    if (transformedUrlsCount > 0) {
      console.log(`✅ ${transformedUrlsCount} URLs foram transformadas`);
    }
    if (invalidUrlsCount > 0) {
      console.warn(`⚠️ ${invalidUrlsCount} URLs inválidas foram filtradas do M3U`);
    }

    return items;
  }

  private parseExtInf(line: string): {
    name: string;
    logo?: string;
    group?: string;
    duration?: string;
  } {
    const result = {
      name: '',
      logo: undefined as string | undefined,
      group: undefined as string | undefined,
      duration: undefined as string | undefined,
    };

    // Extract logo
    const logoMatch = line.match(/tvg-logo="([^"]*)"/);
    if (logoMatch) {
      result.logo = logoMatch[1];
    }

    // Extract group
    const groupMatch = line.match(/group-title="([^"]*)"/);
    if (groupMatch) {
      result.group = groupMatch[1];
    }

    // Extract duration
    const durationMatch = line.match(/length="([^"]*)"/);
    if (durationMatch) {
      result.duration = durationMatch[1];
    }

    // Extract name (everything after the last comma)
    const lastCommaIndex = line.lastIndexOf(',');
    if (lastCommaIndex !== -1) {
      result.name = line.substring(lastCommaIndex + 1).trim();
    }

    return result;
  }

  private determineType(name: string, group?: string): 'live' | 'movie' | 'series' {
    const lowerName = name.toLowerCase();
    const lowerGroup = group?.toLowerCase() || '';

    // Keywords for movies
    const movieKeywords = ['filme', 'movie', 'cinema', 'theatre', 'filmes'];
    // Keywords for series
    const seriesKeywords = ['série', 'series', 'episódio', 'episode', 'season', 'temporada', 'séries'];
    // Keywords for live TV
    const liveKeywords = ['ao vivo', 'live', 'tv', 'canal', 'channel', 'rádio', 'radio', '4k', 'hd', 'fhd'];

    // Check group first
    if (group) {
      if (movieKeywords.some(keyword => lowerGroup.includes(keyword))) {
        return 'movie';
      }
      if (seriesKeywords.some(keyword => lowerGroup.includes(keyword))) {
        return 'series';
      }
      if (liveKeywords.some(keyword => lowerGroup.includes(keyword))) {
        return 'live';
      }
    }

    // Check name
    if (movieKeywords.some(keyword => lowerName.includes(keyword))) {
      return 'movie';
    }
    if (seriesKeywords.some(keyword => lowerName.includes(keyword))) {
      return 'series';
    }

    // Default to live TV
    return 'live';
  }

  // Métodos para gerenciar cache
  private isCacheValid(url: string): boolean {
    if (!this.cache || this.cache.url !== url) {
      return false;
    }
    
    const now = Date.now();
    const cacheAge = now - this.cache.timestamp;
    return cacheAge < this.CACHE_DURATION;
  }

  private setCache(url: string, data: M3UData, lastModified?: string): void {
    this.cache = {
      data,
      url,
      timestamp: Date.now(),
      lastModified,
    };
  }

  private getCache(url: string): M3UData | null {
    if (this.isCacheValid(url)) {
      console.log(`📦 Usando cache para: ${url}`);
      return this.cache!.data;
    }
    return null;
  }

  public clearCache(): void {
    this.cache = null;
    console.log('🗑️ Cache limpo');
  }

  public getCacheInfo(): { hasCache: boolean; url?: string; age?: number } {
    if (!this.cache) {
      return { hasCache: false };
    }
    
    const age = Date.now() - this.cache.timestamp;
    return {
      hasCache: true,
      url: this.cache.url,
      age: Math.floor(age / 1000), // idade em segundos
    };
  }

  async fetchM3U(url: string, forceRefresh: boolean = false): Promise<M3UData> {
    try {
      // Verificar cache primeiro (se não for forçado a atualizar)
      if (!forceRefresh) {
        const cachedData = this.getCache(url);
        if (cachedData) {
          return cachedData;
        }
      }

      console.log(`🔄 Carregando M3U de: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'IPTV-App/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const content = await response.text();
      
      if (!content.startsWith('#EXTM3U')) {
        throw new Error('Invalid M3U file format');
      }

      const items = this.parseM3UContent(content);
      
      // Separar itens por tipo
      const channels = items.filter(item => item.type === 'live');
      const movies = items.filter(item => item.type === 'movie');
      const series = items.filter(item => item.type === 'series');

      // Obter categorias únicas e limpar
      const categories = [...new Set(items.map(item => item.category).filter((cat): cat is string => Boolean(cat)))].sort();

      const data: M3UData = {
        channels,
        movies,
        series,
        categories,
      };

      // Salvar no cache
      this.setCache(url, data, response.headers.get('last-modified') || undefined);

      console.log(`📊 M3U Processado: ${items.length} itens válidos`);
      console.log(`📺 Canais: ${channels.length}`);
      console.log(`🎬 Filmes: ${movies.length}`);
      console.log(`📺 Séries: ${series.length}`);
      console.log(`🏷️ Categorias: ${categories.length}`);

      return data;
    } catch (error) {
      console.error('❌ Erro ao carregar M3U:', error);
      throw error;
    }
  }

  async fetchM3UFromFile(file: File): Promise<M3UData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (!content.startsWith('#EXTM3U')) {
            throw new Error('Invalid M3U file format');
          }

          const items = this.parseM3UContent(content);
          
          const channels = items.filter(item => item.type === 'live');
          const movies = items.filter(item => item.type === 'movie');
          const series = items.filter(item => item.type === 'series');
          const categories = [...new Set(items.map(item => item.category).filter((cat): cat is string => Boolean(cat)))];

          resolve({
            channels,
            movies,
            series,
            categories,
          });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

export const m3uParser = new M3UParser(); 