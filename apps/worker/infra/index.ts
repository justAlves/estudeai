import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const config = new pulumi.Config();

const project = config.require("project");
const region = config.require("region");
const imageTag = config.get("imageTag") || "latest";
const createCloudRunService = config.getBoolean("createCloudRunService") ?? true;

// 1. Artifact Registry (Container Registry) - pode ser reutilizado se já existir
const artifactRegistry = new gcp.artifactregistry.Repository("estudeai-worker-registry", {
    repositoryId: "estudeai-worker",
    location: region,
    format: "DOCKER",
    description: "Container registry for EstudeAI Worker",
});

// 2. Cloud Run Service Account
const cloudRunServiceAccount = new gcp.serviceaccount.Account("worker-cloud-run-sa", {
    accountId: "estudeai-worker-cloud-run",
    displayName: "EstudeAI Worker Cloud Run Service Account",
    description: "Service account for Worker Cloud Run service",
});

// 3. Cloud Run Service (apenas se createCloudRunService for true)
let cloudRunService: gcp.cloudrunv2.Service | undefined;
if (createCloudRunService) {
    cloudRunService = new gcp.cloudrunv2.Service("estudeai-worker", {
        location: region,
        deletionProtection: false, // Permite remover o serviço quando necessário
        template: {
            containers: [{
                image: pulumi.interpolate`${region}-docker.pkg.dev/${project}/${artifactRegistry.repositoryId}/estudeai-worker:${imageTag}`,
                ports: {
                    containerPort: 8080,
                    name: "http1",
                },
                resources: {
                    limits: {
                        cpu: "1",
                        memory: "1Gi",
                    },
                },
            }],
            serviceAccount: cloudRunServiceAccount.email,
            scaling: {
                minInstanceCount: 1, // Worker sempre ativo
                maxInstanceCount: 10,
            },
            timeout: "300s",
        },
    });
}

export const artifactRegistryUrl = pulumi.interpolate`${region}-docker.pkg.dev/${project}/${artifactRegistry.repositoryId}`;
export const cloudRunServiceName = cloudRunService?.name;
export const cloudRunServiceUrl = cloudRunService?.uri;

