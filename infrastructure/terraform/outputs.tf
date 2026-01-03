# Copyright 2026 Google LLC
# SPDX-License-Identifier: Apache-2.0

# Retrieve the Web App config to output environment variables
data "google_firebase_web_app_config" "default" {
  provider   = google-beta
  web_app_id = google_firebase_web_app.default.app_id
  project    = var.project_id
}

output "nextjs_env_file" {
  description = "Content for .env.local file"
  value       = <<EOT
NEXT_PUBLIC_FIREBASE_API_KEY=${data.google_firebase_web_app_config.default.api_key}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${data.google_firebase_web_app_config.default.auth_domain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${var.project_id}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${data.google_firebase_web_app_config.default.storage_bucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${data.google_firebase_web_app_config.default.messaging_sender_id}
NEXT_PUBLIC_FIREBASE_APP_ID=${google_firebase_web_app.default.app_id}
EOT
  sensitive = true
}
