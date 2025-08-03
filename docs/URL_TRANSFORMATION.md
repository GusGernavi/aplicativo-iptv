# Transformação de URLs M3U

## Visão Geral

O parser M3U agora inclui uma funcionalidade automática de transformação de URLs para resolver problemas de conectividade com hosts específicos.

## Funcionalidade

### Substituição Automática de Host

O sistema automaticamente substitui o host `aguacomgas.shop` por `supg.nl` em todas as URLs do arquivo M3U durante o processamento.

### Como Funciona

1. **Detecção**: O parser verifica se uma URL contém `aguacomgas.shop`
2. **Transformação**: Se encontrado, substitui automaticamente por `supg.nl`
3. **Logging**: Registra no console cada transformação realizada
4. **Validação**: A URL transformada é então validada antes de ser aceita

### Exemplo de Transformação

```
URL Original: http://aguacomgas.shop:8080/live/user/pass/1234.ts
URL Transformada: http://supg.nl:8080/live/user/pass/1234.ts
```

## Implementação Técnica

### Método `transformUrl()`

```typescript
private transformUrl(url: string): string {
  try {
    if (url.includes('aguacomgas.shop')) {
      const transformedUrl = url.replace(/aguacomgas\.shop/g, 'supg.nl');
      console.log(`🔄 URL transformada: ${url} → ${transformedUrl}`);
      return transformedUrl;
    }
    return url;
  } catch (error) {
    console.warn(`⚠️ Erro ao transformar URL: ${url}`, error);
    return url;
  }
}
```

### Integração no Parser

A transformação é aplicada no método `parseM3UContent()` antes da validação da URL:

```typescript
const transformedUrl = this.transformUrl(line);
const isValidUrl = this.isValidUrl(transformedUrl);
```

## Logs e Monitoramento

### Logs de Transformação

- **Transformação Individual**: `🔄 URL transformada: [original] → [transformada]`
- **Resumo**: `✅ X URLs foram transformadas (aguacomgas.shop → supg.nl)`

### Exemplo de Output

```
🔄 URL transformada: http://aguacomgas.shop:8080/live/user/pass/1234.ts → http://supg.nl:8080/live/user/pass/1234.ts
🔄 URL transformada: http://aguacomgas.shop:8080/movie/user/pass/movie1.mp4 → http://supg.nl:8080/movie/user/pass/movie1.mp4
✅ 2 URLs foram transformadas (aguacomgas.shop → supg.nl)
```

## Benefícios

1. **Resolução Automática**: Elimina erros de `UnknownHostException`
2. **Transparência**: Logs claros mostram quais URLs foram alteradas
3. **Compatibilidade**: Mantém a estrutura original da URL
4. **Segurança**: Apenas o hostname é alterado, preservando parâmetros e caminhos

## Configuração

Atualmente, a transformação está hardcoded para substituir `aguacomgas.shop` por `supg.nl`. Para adicionar mais transformações, seria necessário:

1. Modificar o método `transformUrl()`
2. Adicionar mais condições de substituição
3. Atualizar os logs para refletir as novas transformações

## Troubleshooting

### Se as URLs não estão sendo transformadas:

1. Verifique se as URLs contêm exatamente `aguacomgas.shop`
2. Confirme que o parser está sendo executado
3. Verifique os logs do console para mensagens de transformação

### Se ainda há erros de conectividade:

1. Verifique se `supg.nl` está acessível
2. Confirme que as credenciais na URL estão corretas
3. Use as ferramentas de diagnóstico do app para testar conectividade 