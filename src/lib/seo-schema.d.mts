export interface ProjectForJsonLd {
  slug: string;
  title: string;
  description: string;
  image: string;
  fallbackImage?: string;
  tools: string[];
  repoUrl?: string;
  link?: string;
  year?: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FaqItem {
  q?: string;
  question?: string;
  a?: string;
  answer?: string;
}

export declare const SITE_URL: string;
export declare function buildPersonJsonLd(): Record<string, unknown>;
export declare function buildWebsiteJsonLd(): Record<string, unknown>;
export declare function buildProjectJsonLd(project: ProjectForJsonLd): Record<string, unknown>;
export declare function buildFaqJsonLd(faqsByTab: Record<string, FaqItem[]> | FaqItem[]): Record<string, unknown>;
export declare function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown>;
