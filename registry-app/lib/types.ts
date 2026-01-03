/**
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export type ExtensionType = 'persona' | 'tool';

export interface Extension {
  id: string;
  name: string;
  description: string;
  type: ExtensionType;
  tags: string[];
  imageUrl: string;
  author: string;
  version: string;
  installCommand: string;
  readme: string;
  associatedTools?: string[];
  repoUrl?: string;
}
