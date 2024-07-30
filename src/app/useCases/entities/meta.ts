export interface Meta {
  format: string;
  version: string;
  projectId: string;
  resourcePath?: string[] | null;
  recursive: boolean;
  creationTime: number;
  app: string;
}
