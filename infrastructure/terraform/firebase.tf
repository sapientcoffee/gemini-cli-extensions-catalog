# Enable Firebase services for the project
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  depends_on = [
    google_project_service.apis
  ]
}

# Create the Firebase Web App
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = var.project_id
  display_name = "Cymbal Extension Registry Web"

  depends_on = [
    google_firebase_project.default
  ]
}

# Provision the default Storage Bucket for Firebase
resource "google_app_engine_application" "default" {
  provider      = google-beta
  project       = var.project_id
  location_id   = var.region
  database_type = "CLOUD_FIRESTORE" # Use Firestore Native

  depends_on = [
    google_project_service.apis
  ]
}
