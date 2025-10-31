# EstudeAI Worker Infrastructure

Esta pasta contém o código de infraestrutura Pulumi para o Worker do projeto EstudeAI.

## Pré-requisitos

- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- Um projeto Google Cloud com billing habilitado

## Configuração

1. Instale as dependências:
   ```bash
   cd apps/worker/infra
   bun install
   ```

2. Configure o Pulumi:
   ```bash
   pulumi config set gcp:project SEU_PROJECT_ID
   pulumi config set gcp:region us-central1
   pulumi config set project SEU_PROJECT_ID
   pulumi config set region us-central1
   pulumi config set imageTag latest  # ou a tag da imagem que deseja usar
   ```

3. Configure as variáveis de ambiente. Você tem duas opções:

### Opção 1: Variáveis de Ambiente Diretas (Recomendado para desenvolvimento)

```bash
pulumi config set useSecrets false
pulumi config set amqpUrl amqp://user:password@host:5672
pulumi config set databaseUrl postgresql://user:password@host:5432/dbname
pulumi config set geminiApiKey your-api-key
```

### Opção 2: Usar Secret Manager (Recomendado para produção)

Primeiro, crie os secrets no Secret Manager:

```bash
# Criar secret do AMQP
echo -n "amqp://user:password@host:5672" | gcloud secrets create amqp-url --data-file=-

# Criar secret do Database
echo -n "postgresql://user:password@host:5432/dbname" | gcloud secrets create database-url --data-file=-

# Criar secret do Gemini
echo -n "your-api-key" | gcloud secrets create gemini-api-key --data-file=-
```

Depois, configure o Pulumi para usar secrets:

```bash
pulumi config set useSecrets true
pulumi config set amqpSecretName amqp-url
pulumi config set databaseSecretName database-url
pulumi config set geminiSecretName gemini-api-key
```

## Build e Push da Imagem Docker

Este setup não inclui Cloud Build automático. Você precisa fazer build e push manualmente:

```bash
# A partir da raiz do projeto
docker build -f apps/worker/Dockerfile -t us-central1-docker.pkg.dev/SEU_PROJECT_ID/estudeai-worker/estudeai-worker:latest .

# Autenticar no Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Fazer push da imagem
docker push us-central1-docker.pkg.dev/SEU_PROJECT_ID/estudeai-worker/estudeai-worker:latest
```

Ou você pode usar Cloud Build manualmente:

```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/SEU_PROJECT_ID/estudeai-worker/estudeai-worker:latest --file apps/worker/Dockerfile .
```

## Deploy

O deploy deve ser feito em **duas etapas**:

### Etapa 1: Criar a infraestrutura base (Artifact Registry e Service Account)

Primeiro, configure para criar apenas a infraestrutura base (sem o Cloud Run Service):

```bash
pulumi config set createCloudRunService false
```

Depois faça o deploy:

```bash
pulumi up
```

Isso criará apenas o Artifact Registry e a Service Account.

### Etapa 2: Build e Push da Imagem Docker

Depois que a infraestrutura base estiver criada, faça o build e push da imagem (veja seção "Build e Push da Imagem Docker" acima).

### Etapa 3: Criar o Cloud Run Service

Após fazer push da imagem, habilite a criação do Cloud Run Service:

```bash
pulumi config set createCloudRunService true
pulumi up
```

Agora o Cloud Run Service será criado com a imagem que você enviou.

### Destruir a infraestrutura

Para destruir a infraestrutura:

```bash
pulumi destroy
```

## Outputs

Após o deploy, os seguintes outputs estão disponíveis:

- `artifactRegistryUrl`: URL do repositório Artifact Registry
- `cloudRunServiceName`: Nome do serviço Cloud Run
- `cloudRunServiceUrl`: URL do serviço Cloud Run

## Atualizando a Imagem

Para atualizar o worker com uma nova imagem:

1. Faça build e push da nova imagem (veja seção acima)
2. Se necessário, atualize a tag no Pulumi:
   ```bash
   pulumi config set imageTag nova-tag
   ```
3. Faça update do serviço:
   ```bash
   pulumi up
   ```

Ou você pode atualizar diretamente pelo gcloud:

```bash
gcloud run services update estudeai-worker \
  --image us-central1-docker.pkg.dev/SEU_PROJECT_ID/estudeai-worker/estudeai-worker:latest \
  --region us-central1
```

## Observações

- O worker está configurado para sempre ter pelo menos 1 instância rodando (`minInstanceCount: 1`)
- O worker não expõe nenhum endpoint HTTP público (é apenas um worker de background)
- As variáveis de ambiente são injetadas via Secret Manager para maior segurança

