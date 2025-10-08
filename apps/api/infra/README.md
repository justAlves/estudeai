# EstudeAI Infrastructure

Esta pasta contém o código de infraestrutura Pulumi para o projeto EstudeAI.

## Pré-requisitos

- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- Um projeto Google Cloud com billing habilitado

## Configuração

1. Instale as dependências:
   ```bash
   cd apps/api/infra
   npm install
   ```

2. Configure o Pulumi:
   ```bash
   pulumi config set gcp:project SEU_PROJECT_ID
   pulumi config set gcp:region us-central1
   pulumi config set githubOwner justAlves
   pulumi config set githubRepoName estudeai
   ```

3. Faça o deploy da infraestrutura:
   ```bash
   pulumi up
   ```

## O que esta infraestrutura cria

- **Artifact Registry**: Repositório para armazenar imagens Docker
- **Cloud Run**: Serviço para executar a aplicação
- **Cloud Build**: Configuração para buildar imagens automaticamente
- **Cloud Build Trigger**: Trigger que ativa a cada commit na branch main
- **Service Accounts**: Contas de serviço com permissões adequadas
- **IAM Bindings**: Permissões necessárias para os serviços

## Configuração

Os seguintes valores de configuração são necessários:

- `gcp:project`: Seu Google Cloud Project ID
- `gcp:region`: A região onde os recursos serão criados (padrão: us-central1)
- `githubOwner`: Nome do usuário/organização do GitHub
- `githubRepoName`: Nome do repositório do GitHub

## Deploy

Para fazer o deploy da infraestrutura:

```bash
pulumi up
```

Para destruir a infraestrutura:

```bash
pulumi destroy
```

## Outputs

Após o deploy, os seguintes outputs estão disponíveis:

- `artifactRegistryUrl`: URL do repositório Artifact Registry
- `cloudRunServiceUrl`: URL do serviço Cloud Run
- `cloudRunServiceName`: Nome do serviço Cloud Run
- `cloudBuildTriggerName`: Nome do trigger Cloud Build

## Integração com GitHub

Esta infraestrutura está configurada para buildar e fazer deploy automaticamente quando mudanças são enviadas para a branch main do repositório GitHub. Certifique-se de:

1. Conectar seu repositório GitHub ao Google Cloud Build
2. Conceder as permissões necessárias para o Cloud Build acessar seu repositório
3. Garantir que a estrutura do repositório corresponda ao layout esperado

## APIs Necessárias

Certifique-se de que as seguintes APIs estão habilitadas no seu projeto Google Cloud:

- Cloud Run API
- Artifact Registry API
- Cloud Build API
- Container Registry API
- Cloud Resource Manager API
- Service Usage API

## Estrutura do Projeto (Monorepo)

A infraestrutura está configurada para trabalhar com um monorepo Turbo com a seguinte estrutura:

```
estudeai/
├── package.json          # Root package.json do monorepo
├── bun.lock             # Lock file do Bun
├── turbo.json           # Configuração do Turbo
├── packages/            # Pacotes compartilhados
│   ├── ui/
│   ├── eslint-config/
│   └── typescript-config/
└── apps/
    └── api/
        ├── Dockerfile
        ├── cloudbuild.yaml
        ├── package.json
        └── infra/
            ├── index.ts
            └── package.json
```

### Considerações do Monorepo

- O Cloud Build executa a partir da raiz do repositório
- O Dockerfile está configurado para copiar todo o monorepo
- As dependências são instaladas na raiz para aproveitar o cache do Turbo
- O contexto de build é a raiz do repositório, não apenas a pasta `apps/api`

## Troubleshooting

Se você encontrar problemas:

1. Verifique se todas as APIs necessárias estão habilitadas no seu projeto Google Cloud
2. Verifique se sua conta de serviço tem as permissões necessárias
3. Verifique os logs do Cloud Build para problemas de deploy
4. Certifique-se de que seu Dockerfile está configurado corretamente
5. Verifique se o repositório GitHub está conectado corretamente ao Cloud Build

## Comandos Úteis

```bash
# Ver status da stack
pulumi stack ls

# Ver outputs
pulumi stack output

# Ver logs do último deploy
pulumi logs

# Verificar configuração
pulumi config
```