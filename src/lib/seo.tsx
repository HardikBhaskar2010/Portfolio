/* eslint-disable react-refresh/only-export-components */
/**
 * src/lib/seo.tsx
 * Single source of truth for per-route SEO metadata.
 *
 * Exports:
 *  - SITE_URL            — canonical production domain
 *  - buildPersonJsonLd   — schema.org Person node (Hardik Bhaskar)
 *  - buildWebsiteJsonLd  — schema.org WebSite node
 *  - buildProjectJsonLd  — schema.org CreativeWork/SoftwareSourceCode node
 *  - <Seo>               — thin wrapper around react-helmet-async <Helmet>
 */

import { Helmet } from 'react-helmet-async';
import {
  SITE_URL,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
  buildProjectJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
} from './seo-schema.mjs';
import type { ProjectForJsonLd, BreadcrumbItem, FaqItem } from './seo-schema.d.mts';

export {
  SITE_URL,
  buildPersonJsonLd,
  buildWebsiteJsonLd,
  buildProjectJsonLd,
  buildFaqJsonLd,
  buildBreadcrumbJsonLd,
};
export type { ProjectForJsonLd, BreadcrumbItem, FaqItem };

// ── <Seo> component ─────────────────────────────────────────────────────────

interface SeoProps {
  /** Full page title — shown in browser tab and SERP */
  title: string;
  /** ~155-char meta description for SERP */
  description: string;
  /** Route path (e.g. "/about"), used to build canonical + og:url */
  path: string;
  /** Absolute or root-relative OG image URL. Defaults to /og-preview.png */
  ogImage?: string;
  /** JSON-LD object (or array of objects) to inject as ld+json script */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** If true, adds <meta name="robots" content="noindex, follow"> */
  noindex?: boolean;
}

export function Seo({
  title,
  description,
  path,
  ogImage = '/og-preview.png',
  jsonLd,
  noindex = false,
}: SeoProps) {
  const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:secure_url" content={ogImageUrl} />
      {ogImage === '/og-preview.png' && (
        <>
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:url" content={canonicalUrl} />

      {/* JSON-LD structured data */}
      {jsonLdString && (
        <script type="application/ld+json">{jsonLdString}</script>
      )}
    </Helmet>
  );
}
