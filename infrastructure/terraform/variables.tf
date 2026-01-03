# Copyright 2026 Google LLC
# SPDX-License-Identifier: Apache-2.0

variable "project_id" {
  description = "The ID of the Google Cloud Project."
  type        = string
}

variable "project_name" {
  description = "The name of the Google Cloud Project."
  type        = string
  default     = "Cymbal Coffee Extension Registry"
}

variable "region" {
  description = "The default GCP region for resources."
  type        = string
  default     = "us-central1"
}

variable "billing_account" {
  description = "The Billing Account ID to attach to the project (optional if project already exists)."
  type        = string
  default     = ""
}

variable "org_id" {
  description = "The Organization ID to create the project under (optional)."
  type        = string
  default     = ""
}
