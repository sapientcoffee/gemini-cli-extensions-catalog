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
