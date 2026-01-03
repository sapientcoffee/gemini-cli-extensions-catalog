# Configure Firestore Database (Native Mode)
resource "google_firestore_database" "database" {
  provider                    = google-beta
  project                     = var.project_id
  name                        = "(default)"
  location_id                 = var.region
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode            = "OPTIMISTIC"
  app_engine_integration_mode = "DISABLED"

  depends_on = [
    google_project_service.apis
  ]
}

# Default Security Rules
resource "google_firebaserules_ruleset" "firestore" {
  provider = google-beta
  project  = var.project_id
  source {
    files {
      name    = "firestore.rules"
      content = <<EOT
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lock down by default, specific rules deployed via CLI
    match /{document=**} {
      allow read, write: if false; 
    }
  }
}
EOT
    }
  }

  depends_on = [
    google_project_service.apis
  ]
}

resource "google_firebaserules_release" "firestore" {
  provider     = google-beta
  project      = var.project_id
  name         = "cloud.firestore"
  ruleset_name = google_firebaserules_ruleset.firestore.name
}
