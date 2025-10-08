import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

const config = new pulumi.Config();

const project = config.require("project");
const region = config.require("region");
const githubRepo = config.require("githubRepo") || "justAlves/estudeai";
const githubOwner = config.require("githubOwner") || "justAlves";
const githubRepoName = config.require("githubRepoName") || "estudeai";

// 1. Artifact Registry (Container Registry)
const artifactRegistry = new gcp.artifactregistry.Repository("estudeai-registry", {
    repositoryId: "estudeai-api",
    location: region,
    format: "DOCKER",
    description: "Container registry for EstudeAI API",
});

// 2. Cloud Build Service Account
const cloudBuildServiceAccount = new gcp.serviceaccount.Account("cloud-build-sa", {
    accountId: "estudeai-cloud-build",
    displayName: "EstudeAI Cloud Build Service Account",
    description: "Service account for Cloud Build operations",
});

// 3. IAM bindings for Cloud Build
const cloudBuildIamBinding = new gcp.projects.IAMBinding("cloud-build-iam", {
    project: project,
    role: "roles/cloudbuild.builds.builder",
    members: [pulumi.interpolate`serviceAccount:${cloudBuildServiceAccount.email}`],
});

const artifactRegistryIamBinding = new gcp.artifactregistry.RepositoryIamBinding("artifact-registry-iam", {
    location: artifactRegistry.location,
    repository: artifactRegistry.name,
    role: "roles/artifactregistry.writer",
    members: [pulumi.interpolate`serviceAccount:${cloudBuildServiceAccount.email}`],
});

// 4. Cloud Run Service Account
const cloudRunServiceAccount = new gcp.serviceaccount.Account("cloud-run-sa", {
    accountId: "estudeai-cloud-run",
    displayName: "EstudeAI Cloud Run Service Account",
    description: "Service account for Cloud Run service",
});

// 5. Cloud Run Service
const cloudRunService = new gcp.cloudrunv2.Service("estudeai-api", {
    location: region,
    template: {
        containers: [{
            image: pulumi.interpolate`${region}-docker.pkg.dev/${project}/${artifactRegistry.repositoryId}/estudeai-api:latest`,
            ports: {
                containerPort: 3000,
            },
            envs: [
                {
                    name: "NODE_ENV",
                    value: "production",
                },
                {
                    name: "PORT",
                    value: "3000",
                },
            ],
            resources: {
                limits: {
                    cpu: "1",
                    memory: "512Mi",
                },
            },
        }],
        serviceAccount: cloudRunServiceAccount.email,
        scaling: {
            minInstanceCount: 0,
            maxInstanceCount: 10,
        },
    },
    traffics: [{
        percent: 100,
        type: "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST",
    }],
});

// 6. Cloud Run IAM - Allow unauthenticated access
const cloudRunIamBinding = new gcp.cloudrunv2.ServiceIamBinding("cloud-run-iam", {
    location: cloudRunService.location,
    name: cloudRunService.name,
    role: "roles/run.invoker",
    members: ["allUsers"],
});

// 7. Cloud Build Trigger
const cloudBuildTrigger = new gcp.cloudbuild.Trigger("estudeai-build-trigger", {
    name: "estudeai-api-build",
    description: "Build trigger for EstudeAI API on push to main branch",
    github: {
        owner: githubOwner,
        name: githubRepoName,
        push: {
            branch: "^main$",
        },
    },
    filename: "apps/api/cloudbuild.yaml",
    serviceAccount: cloudBuildServiceAccount.id,
    substitutions: {
        _REGION: region,
        _PROJECT_ID: project,
        _REPOSITORY: artifactRegistry.repositoryId,
    },
});

// 8. Cloud Build Configuration File
const cloudBuildConfig = new gcp.storage.BucketObject("cloudbuild-config", {
    name: "cloudbuild.yaml",
    bucket: new gcp.storage.Bucket("estudeai-build-config", {
        name: pulumi.interpolate`${project}-estudeai-build-config`,
        location: region,
        uniformBucketLevelAccess: true,
    }).name,
    content: `steps:
  # Install dependencies for the entire monorepo
  - name: 'gcr.io/cloud-builders/npm'
    args: ['install']
    dir: '.'

  # Build the container image from the monorepo root
  - name: 'gcr.io/cloud-builders/docker'
    args: [
      'build',
      '-f', 'apps/api/Dockerfile',
      '-t', '${region}-docker.pkg.dev/${project}/${artifactRegistry.repositoryId}/estudeai-api:$COMMIT_SHA',
      '-t', '${region}-docker.pkg.dev/${project}/${artifactRegistry.repositoryId}/estudeai-api:latest',
      '.'
    ]
    dir: '.'

  # Push the container image to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: [
      'push',
      '${region}-docker.pkg.dev/${project}/${artifactRegistry.repositoryId}/estudeai-api:$COMMIT_SHA'
    ]

  - name: 'gcr.io/cloud-builders/docker'
    args: [
      'push',
      '${region}-docker.pkg.dev/${project}/${artifactRegistry.repositoryId}/estudeai-api:latest'
    ]

  # Deploy container image to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args: [
      'run',
      'deploy',
      'estudeai-api',
      '--image', '${region}-docker.pkg.dev/${project}/${artifactRegistry.repositoryId}/estudeai-api:$COMMIT_SHA',
      '--region', '${region}',
      '--platform', 'managed',
      '--allow-unauthenticated'
    ]

options:
  logging: CLOUD_LOGGING_ONLY
`,
});

// Export important values
export const artifactRegistryUrl = artifactRegistry.name;
export const cloudRunServiceUrl = cloudRunService.uri;
export const cloudRunServiceName = cloudRunService.name;
export const cloudBuildTriggerName = cloudBuildTrigger.name;