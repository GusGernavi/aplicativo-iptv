# Guia de Troubleshooting - Player de Vídeo IPTV

Este guia ajuda a resolver problemas comuns encontrados ao usar o player de vídeo do aplicativo IPTV.

## 🔍 Problemas Comuns e Soluções

### 1. Erro "UnknownHostException" ou "Unable to resolve host"

**Sintomas:**
- Erro: `java.net.UnknownHostException: Unable to resolve host "aguacomgas.shop"`
- Vídeo não carrega
- Mensagem de erro sobre hostname não encontrado

**Causas Possíveis:**
- URL inválida no arquivo M3U
- Problemas de DNS
- Hostname inexistente ou temporariamente indisponível
- Problemas de conectividade de rede

**Soluções:**

#### A. Verificar Conectividade de Rede
1. Acesse a tela "Ferramentas de Desenvolvimento" no app
2. Execute o "Teste de Rede"
3. Verifique se a internet está funcionando
4. Se houver problemas de DNS, tente:
   - Reiniciar o roteador
   - Mudar para DNS do Google (8.8.8.8) ou Cloudflare (1.1.1.1)
   - Verificar se há firewall bloqueando conexões

#### B. Validar URLs do M3U
1. Execute "Validar URLs" nas ferramentas de desenvolvimento
2. Verifique quais URLs estão inválidas
3. Se muitas URLs estiverem inválidas, o provedor IPTV pode estar com problemas

#### C. Verificar Arquivo M3U
1. Abra o arquivo M3U em um editor de texto
2. Procure por URLs com hostnames inválidos
3. Verifique se as URLs começam com `http://` ou `https://`
4. Remova ou corrija URLs problemáticas

### 2. Vídeo Não Reproduz (Erro de Formato)

**Sintomas:**
- Tela preta
- Mensagem de erro sobre formato não suportado
- Vídeo carrega mas não reproduz

**Soluções:**
1. Verifique se o formato é suportado (MP4, HLS, M3U8)
2. Teste com streams de exemplo nas ferramentas de desenvolvimento
3. Verifique se o codec é compatível com o dispositivo
4. Tente reduzir a qualidade do stream

### 3. Problemas de Buffering

**Sintomas:**
- Vídeo para constantemente
- Indicador de buffering aparece frequentemente
- Qualidade do stream oscila

**Soluções:**
1. Verifique a velocidade da internet (mínimo 5 Mbps para HD)
2. Reduza a qualidade do stream nas configurações
3. Feche outros aplicativos que usam internet
4. Verifique se o servidor IPTV está sobrecarregado

### 4. Erro de Timeout

**Sintomas:**
- Mensagem: "Timeout - servidor não respondeu em 15 segundos"
- Vídeo não carrega após tentativas

**Soluções:**
1. Verifique a conectividade de rede
2. Tente novamente em alguns minutos
3. O servidor pode estar temporariamente indisponível
4. Verifique se a URL do M3U ainda é válida

### 5. Problemas de Autenticação

**Sintomas:**
- Erro 403 (Forbidden)
- Mensagem: "Acesso negado"

**Soluções:**
1. Verifique se as credenciais IPTV estão corretas
2. Confirme se a assinatura não expirou
3. Verifique se o provedor IPTV está ativo
4. Entre em contato com o provedor se necessário

## 🛠️ Ferramentas de Diagnóstico

### Teste de Rede
- Acesse: Home → Ferramentas de Desenvolvimento → Teste de Rede
- Verifica conectividade básica
- Testa resolução de DNS
- Valida acesso à internet

### Validação de URLs
- Acesse: Home → Ferramentas de Desenvolvimento → Validar URLs
- Testa acessibilidade de URLs de exemplo
- Identifica URLs problemáticas
- Fornece detalhes sobre erros específicos

### Teste Completo do Player
- Acesse: Home → Ferramentas de Desenvolvimento → Teste Completo
- Testa reprodução de diferentes formatos
- Verifica funcionalidades do player
- Gera relatório detalhado

## 📱 Configurações Recomendadas

### Para Conexões Lentas (< 10 Mbps)
```typescript
// Em src/config/playerConfig.ts
bufferConfig: {
  minBufferMs: 10000,    // 10 segundos
  maxBufferMs: 30000,    // 30 segundos
  bufferForPlaybackMs: 5000,  // 5 segundos
  bufferForPlaybackAfterRebufferMs: 10000, // 10 segundos
}
```

### Para Conexões Rápidas (> 25 Mbps)
```typescript
bufferConfig: {
  minBufferMs: 5000,     // 5 segundos
  maxBufferMs: 15000,    // 15 segundos
  bufferForPlaybackMs: 2000,   // 2 segundos
  bufferForPlaybackAfterRebufferMs: 5000,  // 5 segundos
}
```

## 🔧 Logs e Debug

### Habilitar Logs Detalhados
No modo de desenvolvimento, informações de debug são exibidas automaticamente:
- URL sendo reproduzida
- Tipo de conteúdo
- Timestamp do erro
- Detalhes técnicos do erro

### Verificar Logs do Console
1. Abra o console de desenvolvimento
2. Procure por mensagens com prefixos:
   - `🔄` - Carregamento
   - `📊` - Processamento de dados
   - `❌` - Erros
   - `⚠️` - Avisos

## 📞 Suporte

Se os problemas persistirem:

1. **Colete Informações:**
   - Screenshot da tela de erro
   - Logs do console
   - Resultados dos testes de diagnóstico
   - URL do M3U (sem credenciais)

2. **Verifique:**
   - Versão do aplicativo
   - Sistema operacional do dispositivo
   - Tipo de conexão (WiFi/Celular)

3. **Contato:**
   - Forneça todas as informações coletadas
   - Descreva os passos que reproduzem o problema
   - Mencione soluções já tentadas

## 🚀 Dicas de Performance

1. **Use WiFi sempre que possível** - Conexões móveis podem ser instáveis
2. **Feche apps em segundo plano** - Libere memória e banda
3. **Mantenha o app atualizado** - Correções de bugs são frequentes
4. **Use streams de qualidade adequada** - Não force 4K em conexões lentas
5. **Reinicie o app periodicamente** - Limpa cache e memória

---

*Última atualização: Dezembro 2024* 