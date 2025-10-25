# Worker - EstudeAI

Worker para processar mensagens do RabbitMQ usando Effect-TS e Pino logger.

## Funcionalidades

- ✅ Consome mensagens da fila `estudeai` no RabbitMQ
- ✅ Logging estruturado com Pino
- ✅ Gerenciamento de efeitos com Effect-TS
- ✅ Tratamento de erros robusto
- ✅ Configuração via variáveis de ambiente

## Requisitos

- Bun >= 1.0
- RabbitMQ server rodando

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
AMQP_URL=amqp://localhost:5672
```

## Instalação

```bash
bun install
```

## Execução

### Modo desenvolvimento (com hot reload)
```bash
bun run dev
```

### Modo produção
```bash
bun run index.ts
```

## Estrutura

```
worker/
├── config/
│   ├── env.ts      # Configuração de variáveis de ambiente
│   ├── amqp.ts     # Configuração do RabbitMQ com Effect
│   └── logger.ts   # Configuração do Pino logger com Effect
├── index.ts        # Arquivo principal do worker
└── package.json
```

## Como funciona

O worker:
1. Conecta ao RabbitMQ usando a URL configurada em `AMQP_URL`
2. Cria/asserta a fila `estudeai`
3. Fica aguardando mensagens nessa fila
4. Para cada mensagem recebida:
   - Loga a mensagem com timestamp usando Pino
   - Faz ACK da mensagem
5. Continua rodando indefinidamente até ser interrompido

## Logs

Os logs são formatados com `pino-pretty` e incluem:
- Timestamp
- Nível de log (info, error, warn, debug)
- Mensagem
- Dados estruturados (quando aplicável)

Exemplo de log:
```
[2025-10-20 12:34:56] INFO: 🚀 Worker iniciado!
[2025-10-20 12:34:56] INFO: 📡 Conectado ao RabbitMQ
[2025-10-20 12:34:56] INFO: 👂 Aguardando mensagens na fila 'estudeai'...
[2025-10-20 12:35:10] INFO: 📨 Nova mensagem recebida:
    message: "exemplo de mensagem"
    timestamp: "2025-10-20T12:35:10.123Z"
```

## Tratamento de erros

Erros são capturados e logados automaticamente. O worker:
- Loga erros de conexão/canal do RabbitMQ
- Continua tentando processar mensagens mesmo após erros
- Encerra com código de erro 1 em caso de erro fatal

## Effect-TS

Este worker usa Effect-TS para:
- **Dependency Injection**: Serviços são injetados via `Context.Tag` e `Layer`
- **Error Handling**: Erros são tipados (`AMQPError`) e tratados de forma funcional
- **Resource Management**: Conexões são gerenciadas automaticamente
- **Composability**: Lógica é composta usando `Effect.gen`
