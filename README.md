# Aplicativo IPTV

Um aplicativo de IPTV moderno e amigável desenvolvido em React Native com Expo, inspirado nas melhores práticas de UX dos streamings populares.

## 🚀 Características

- **Interface Moderna**: Design inspirado nos principais serviços de streaming
- **Navegação Intuitiva**: Tab navigation com ícones claros e organizados
- **Player de Vídeo Avançado**: Suporte completo para reprodução de streams IPTV com controles avançados
- **Categorização Inteligente**: Organização automática por TV ao vivo, filmes, séries e favoritos
- **Validação de URLs**: Sistema robusto para detectar e filtrar URLs inválidas
- **Transformação Automática de URLs**: Substituição automática de hosts problemáticos (aguacomgas.shop → supg.nl)
- **Tratamento de Erros**: Mensagens de erro específicas e sugestões de solução
- **Ferramentas de Diagnóstico**: Testes de conectividade e validação de streams
- **Responsivo**: Adaptável a diferentes tamanhos de tela
- **Performance**: Otimizado para reprodução suave de vídeo
- **Desenvolvimento Rápido**: Usando Expo para facilitar o desenvolvimento

## 📱 Telas Principais

- **Início**: Destaques, conteúdo recente e ferramentas de desenvolvimento
- **TV ao Vivo**: Lista de canais de televisão
- **Filmes**: Catálogo de filmes
- **Séries**: Catálogo de séries
- **Favoritos**: Conteúdo salvo pelo usuário
- **Player**: Reprodução de vídeo em tela cheia com controles avançados
- **Teste do Player**: Ferramentas de diagnóstico e validação de streams

## 🛠️ Tecnologias Utilizadas

- **Expo**: Framework de desenvolvimento React Native
- **React Native**: Framework principal
- **TypeScript**: Tipagem estática
- **React Navigation**: Navegação entre telas
- **Expo AV**: Player de vídeo e áudio
- **Expo Image**: Otimização de imagens
- **Expo Linear Gradient**: Gradientes
- **React Native Vector Icons**: Ícones
- **Zustand**: Gerenciamento de estado

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app no seu dispositivo móvel

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd aplicativo-iptv
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o projeto**
   ```bash
   npm start
   # ou
   yarn start
   ```

## 🚀 Executando o Projeto

### Desenvolvimento Local
```bash
npm start
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## 📱 Testando no Dispositivo

1. Instale o app **Expo Go** no seu dispositivo móvel
2. Execute `npm start` no terminal
3. Escaneie o QR code que aparece no terminal com o app Expo Go
4. O aplicativo será carregado automaticamente no seu dispositivo

## 📁 Estrutura do Projeto

```
├── App.tsx                 # Componente principal
├── app.json               # Configuração do Expo
├── package.json           # Dependências
├── tsconfig.json          # Configuração TypeScript
├── docs/                  # Documentação
│   ├── VIDEO_PLAYER.md    # Documentação do player
│   └── TROUBLESHOOTING.md # Guia de troubleshooting
└── src/
    ├── components/        # Componentes reutilizáveis
    │   ├── VideoControls.tsx      # Controles avançados do player
    │   └── StreamQualityIndicator.tsx # Indicador de qualidade
    ├── screens/          # Telas do aplicativo
    │   ├── PlayerScreen.tsx       # Player principal
    │   └── PlayerTestScreen.tsx   # Tela de testes
    ├── services/         # Serviços
    │   └── m3uParser.ts  # Parser de arquivos M3U
    ├── store/           # Gerenciamento de estado
    │   └── iptvStore.ts # Store principal
    ├── utils/           # Utilitários
    │   ├── playerTest.ts    # Testes do player
    │   └── networkUtils.ts  # Utilitários de rede
    ├── config/          # Configurações
    │   └── playerConfig.ts  # Configuração do player
    ├── types/           # Definições de tipos TypeScript
    └── assets/          # Imagens, ícones e recursos
```

## 🎨 Design System

O aplicativo utiliza um design system consistente com:

- **Cores**: Paleta escura moderna (#1C1C1E, #2C2C2E, #007AFF)
- **Tipografia**: Hierarquia clara de textos
- **Espaçamento**: Sistema de grid consistente
- **Componentes**: Reutilizáveis e modulares

## 🔮 Próximas Funcionalidades

- [x] Player de vídeo avançado com controles completos
- [x] Validação e filtragem de URLs inválidas
- [x] Tratamento robusto de erros com mensagens específicas
- [x] Ferramentas de diagnóstico e teste de conectividade
- [x] Configurações centralizadas do player
- [ ] Integração com APIs de IPTV
- [ ] Sistema de busca avançada
- [ ] Filtros por categoria e gênero
- [ ] Histórico de visualização
- [ ] Suporte a legendas
- [ ] Modo offline
- [ ] Notificações de novos episódios
- [ ] Algoritmo personalizado de recomendação

## 🚀 Vantagens do Expo

- **Desenvolvimento Rápido**: Hot reload e desenvolvimento instantâneo
- **Fácil Configuração**: Sem necessidade de configurar Android Studio ou Xcode
- **Bibliotecas Otimizadas**: Expo AV, Expo Image, etc.
- **Deploy Simples**: Fácil publicação na App Store e Google Play
- **Atualizações OTA**: Atualizações sem passar pela loja

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🔧 Troubleshooting

### Problemas Comuns

**Erro "UnknownHostException":**
- Execute o "Teste de Rede" nas ferramentas de desenvolvimento
- Verifique sua conexão com a internet
- O hostname pode estar temporariamente indisponível

**Vídeo não reproduz:**
- Use a tela "Teste do Player" para verificar streams de exemplo
- Verifique se o formato é suportado (MP4, HLS, M3U8)
- Teste com diferentes qualidades de stream

**Problemas de buffering:**
- Verifique a velocidade da internet (mínimo 5 Mbps para HD)
- Reduza a qualidade do stream nas configurações
- Feche outros aplicativos que usam internet

### Ferramentas de Diagnóstico

O aplicativo inclui ferramentas integradas para diagnóstico:
- **Teste de Rede**: Verifica conectividade e DNS
- **Validação de URLs**: Testa acessibilidade de streams
- **Teste Completo**: Valida funcionalidades do player

Acesse: Home → Ferramentas de Desenvolvimento

Para mais detalhes, consulte o [Guia de Troubleshooting](docs/TROUBLESHOOTING.md).

## 📚 Documentação

- [Guia do Player de Vídeo](docs/VIDEO_PLAYER.md) - Documentação completa do player
- [Guia de Troubleshooting](docs/TROUBLESHOOTING.md) - Solução de problemas comuns
- [Transformação de URLs](docs/URL_TRANSFORMATION.md) - Como funciona a substituição automática de hosts

## 📞 Suporte

Para suporte e dúvidas, entre em contato através de:
- Email: [seu-email@exemplo.com]
- Issues: [GitHub Issues]

---

Desenvolvido com ❤️ para uma experiência de IPTV moderna e amigável usando Expo. 