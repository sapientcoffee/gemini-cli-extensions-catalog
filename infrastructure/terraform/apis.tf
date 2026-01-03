# Copyright 2026 Google LLC
# SPDX-License-Identifier: Apache-2.0

# Enable required APIs
resource "google_project_service" "apis" {
  provider = google-beta
  for_each = toset([
    "serviceusage.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    "identitytoolkit.googleapis.com", # Required for Firebase Auth
    "firestore.googleapis.com",
    "firebaserules.googleapis.com",
    "cloudfunctions.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "storage.googleapis.com",
    "firebasehosting.googleapis.com" # For App Hosting / Hosting
  ])

  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}
