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
}

export interface M3UData {
  channels: M3UItem[];
  movies: M3UItem[];
  series: M3UItem[];
  categories: string[];
}

class M3UParser {
  private parseM3UContent(content: string): M3UItem[] {
    const lines = content.split('\n');
    const items: M3UItem[] = [];
    let currentItem: Partial<M3UItem> = {};

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
        // URL line
        currentItem.url = line;
        items.push(currentItem as M3UItem);
        currentItem = {};
      }
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
      logo: undefined,
      group: undefined,
      duration: undefined,
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

  async fetchM3U(url: string): Promise<M3UData> {
    try {
      const response = await fetch(url);
      const content = await response.text();
      
      if (!content.startsWith('#EXTM3U')) {
        throw new Error('Invalid M3U file format');
      }

      const items = this.parseM3UContent(content);
      
      // Separate items by type
      const channels = items.filter(item => item.type === 'live');
      const movies = items.filter(item => item.type === 'movie');
      const series = items.filter(item => item.type === 'series');

      // Get unique categories and clean them
      const categories = [...new Set(items.map(item => item.category).filter(Boolean))].sort();

      console.log(`📊 M3U Processado: ${items.length} itens totais`);
      console.log(`📺 Canais: ${channels.length}`);
      console.log(`🎬 Filmes: ${movies.length}`);
      console.log(`📺 Séries: ${series.length}`);
      console.log(`🏷️ Categorias: ${categories.length}`);

      return {
        channels,
        movies,
        series,
        categories,
      };
    } catch (error) {
      console.error('Error fetching M3U:', error);
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
          const categories = [...new Set(items.map(item => item.category).filter(Boolean))];

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