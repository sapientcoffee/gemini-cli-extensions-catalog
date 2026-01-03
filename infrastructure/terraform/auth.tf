# Configure Identity Platform (Firebase Auth)
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = var.project_id

  sign_in {
    email {
      enabled = true # Allow email/password if needed, or just keep false if strictly Google
    }
  }

  depends_on = [
    google_project_service.apis
  ]
}

# Note: Adding Google as an OAuth provider often requires Client ID/Secret 
# which usually requires manual setup in credentials page or importing them securely.
# For this template, we will output instructions, as checking in secrets or 
# expecting them in vars without a secret manager is risky for a "get started" template.
# However, we can stub the resource if the user provides the vars.
