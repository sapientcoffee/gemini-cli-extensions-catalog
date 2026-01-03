# Infrastructure Setup

This directory contains Terraform code to provision the Google Cloud Platform (GCP) and Firebase resources required for the Cymbal Coffee Extension Registry.

## Prerequisites

1.  [Install Terraform](https://developer.hashicorp.com/terraform/install).
2.  [Install Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
3.  Authenticate with GCP:
    ```bash
    gcloud auth application-default login
    ```
4.  Ensure you have a Billing Account ID if you are creating a new project, or an existing Project ID.

## Setup Instructions

1.  **Initialize Terraform:**
    ```bash
    cd infrastructure/terraform
    terraform init
    ```

2.  **Plan the deployment:**
    Replace `your-project-id` with your desired GCP project ID.
    ```bash
    terraform plan -var="project_id=your-project-id" -out=tfplan
    ```

3.  **Apply the configuration:**
    ```bash
    terraform apply tfplan
    ```

4.  **Configure Frontend:**
    After a successful apply, Terraform will output the configuration needed for your Next.js app. Copy the output (between `EOT`) into `registry-app/.env.local`.

    ```bash
    terraform output -raw nextjs_env_file > ../../registry-app/.env.local
    ```

## Post-Setup (Manual Steps)

Some configurations are currently easier to handle in the Firebase Console:

1.  **Authentication:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Select your project.
    *   Go to **Authentication** > **Sign-in method**.
    *   Enable **Google**. You may need to provide a support email.
    *   In the **Authorized Domains** section, verify `localhost` is present for development.

2.  **App Hosting:**
    *   Go to **App Hosting**.
    *   Follow the wizard to connect your GitHub repository and deploy the `registry-app` directory.
