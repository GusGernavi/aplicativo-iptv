# Player de Vídeo - Documentação

## Visão Geral

O player de vídeo do aplicativo IPTV foi desenvolvido usando o `expo-av` e oferece uma experiência completa de reprodução de conteúdo com controles avançados e interface moderna.

## Funcionalidades Principais

### 🎬 Reprodução de Vídeo
- Suporte a múltiplos formatos de stream (HLS, MP4, etc.)
- Reprodução automática
- Controles de play/pause
- Navegação por tempo (seek forward/backward)

### 🔊 Controle de Áudio
- Controle de volume (0-100%)
- Botão de mute/unmute
- Interface intuitiva para ajuste de volume

### ⚡ Controle de Velocidade
- Múltiplas velocidades de reprodução (0.5x a 2.0x)
- Interface de seleção rápida
- Configuração persistente durante a sessão

### 📊 Indicador de Qualidade
- Monitoramento em tempo real da qualidade do stream
- Indicadores visuais de buffer e erro
- Informações de bitrate (quando disponível)

### 🎛️ Controles Avançados
- Modal de configurações avançadas
- Controles de volume e velocidade
- Interface responsiva e intuitiva

### 🔄 Tratamento de Erros
- Detecção automática de erros de reprodução
- Sistema de retry automático
- Mensagens de erro informativas
- Opção de tentar novamente manualmente

## Componentes

### PlayerScreen
Componente principal do player que gerencia toda a reprodução de vídeo.

**Props:**
- `url`: URL do stream de vídeo
- `title`: Título do conteúdo
- `type`: Tipo de conteúdo ('live', 'movie', 'series')

**Estados:**
- `isPlaying`: Status de reprodução
- `isLoading`: Status de carregamento
- `hasError`: Status de erro
- `volume`: Volume atual (0-1)
- `isMuted`: Status de mute
- `playbackRate`: Velocidade de reprodução
- `streamQuality`: Qualidade do stream
- `bitrate`: Bitrate atual

### VideoControls
Modal de controles avançados com configurações de volume e velocidade.

**Props:**
- `isVisible`: Visibilidade do modal
- `onClose`: Função de fechamento
- `volume`: Volume atual
- `onVolumeChange`: Callback para mudança de volume
- `isMuted`: Status de mute
- `onMuteToggle`: Callback para toggle de mute
- `playbackRate`: Velocidade atual
- `onPlaybackRateChange`: Callback para mudança de velocidade

### StreamQualityIndicator
Indicador visual da qualidade do stream e status de buffer.

**Props:**
- `isBuffering`: Status de buffer
- `hasError`: Status de erro
- `quality`: Qualidade do stream ('low', 'medium', 'high', 'unknown')
- `bitrate`: Bitrate atual

## Configuração

### playerConfig.ts
Arquivo de configuração centralizada para todas as configurações do player.

**Configurações Disponíveis:**
- Volume padrão
- Velocidade de reprodução padrão
- Timeout dos controles
- Configurações de buffer
- Configurações de qualidade
- Configurações de tratamento de erro

**Exemplo de Uso:**
```typescript
import {getPlayerConfig} from '../config/playerConfig';

const customConfig = getPlayerConfig({
  defaultVolume: 0.8,
  showControlsTimeout: 5000,
  errorHandling: {
    maxRetries: 5,
    retryDelay: 3000,
  }
});
```

## Uso

### Navegação para o Player
```typescript
navigation.navigate('Player', {
  url: 'https://example.com/stream.m3u8',
  title: 'Nome do Conteúdo',
  type: 'live' // ou 'movie', 'series'
});
```

### Controles Básicos
- **Toque na tela**: Mostra/esconde controles
- **Botão play/pause**: Controla reprodução
- **Botões de seek**: Avança/retrocede 10 segundos
- **Botão de configurações**: Abre controles avançados
- **Botão fullscreen**: Alterna modo tela cheia

### Controles Avançados
- **Volume**: Botões +/- para ajustar volume
- **Mute**: Botão para silenciar/ativar som
- **Velocidade**: Seleção de velocidade de reprodução
- **Qualidade**: Indicador visual da qualidade do stream

## Tratamento de Erros

O player inclui um sistema robusto de tratamento de erros:

1. **Detecção Automática**: Erros são detectados automaticamente
2. **Retry Automático**: Tentativas automáticas de reconexão
3. **Interface de Erro**: Tela informativa com opções
4. **Logs Detalhados**: Console logs para debugging

## Compatibilidade

### Formatos Suportados
- HLS (.m3u8)
- MP4
- Outros formatos suportados pelo expo-av

### Plataformas
- iOS
- Android
- Web (com limitações)

## Performance

### Otimizações Implementadas
- Lazy loading de controles
- Timeout automático de interface
- Configurações de buffer otimizadas
- Tratamento eficiente de estados

### Monitoramento
- Indicadores de qualidade em tempo real
- Logs de performance
- Métricas de buffer

## Personalização

### Temas
O player usa o sistema de cores do aplicativo:
- Fundo: `#000000`
- Controles: `rgba(0,0,0,0.7)`
- Texto: `#FFFFFF`
- Destaque: `#007AFF`

### Configurações
Todas as configurações podem ser personalizadas através do arquivo `playerConfig.ts`.

## Troubleshooting

### Problemas Comuns

1. **Vídeo não carrega**
   - Verificar URL do stream
   - Verificar conectividade
   - Verificar formato suportado

2. **Controles não aparecem**
   - Toque na tela para mostrar controles
   - Verificar timeout de controles

3. **Erro de reprodução**
   - Verificar logs no console
   - Tentar recarregar o stream
   - Verificar compatibilidade do formato

### Logs Úteis
```typescript
// Habilitar logs detalhados
console.log('Player Status:', status);
console.log('Stream Quality:', streamQuality);
console.log('Error Details:', error);
```

## Futuras Melhorias

- [ ] Suporte a legendas
- [ ] Controle de qualidade adaptativa
- [ ] Histórico de reprodução
- [ ] Favoritos integrados
- [ ] Picture-in-Picture
- [ ] Controles por gestos
- [ ] Suporte a múltiplas qualidades
- [ ] Cache de streams
- [ ] Analytics de reprodução 