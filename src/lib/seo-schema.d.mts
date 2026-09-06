export interface ProjectForJsonLd {
  slug: string;
  title: string;
  description: string;
  image: string;
  tools: string[];
  repoUrl?: string;
  link?: string;
  year?: string;
}

export declare const SITE_URL: string;
export declare function buildPersonJsonLd(): Record<string, unknown>;
export declare function buildWebsiteJsonLd(): Record<string, unknown>;
export declare function buildProjectJsonLd(project: ProjectForJsonLd): Record<string, unknown>;
