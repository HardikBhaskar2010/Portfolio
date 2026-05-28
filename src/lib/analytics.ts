/**
 * analytics.ts — Vercel Analytics event-tracking helpers
 *
 * Usage:
 *   import { track } from '@/lib/analytics';
 *   track.ctaClick('Let\'s work together', 'hero');
 */
import { track as vercelTrack } from '@vercel/analytics';

/* ─────────────────────────────────────────────────────────────
   TYPED EVENTS  (everything tracked in one place)
───────────────────────────────────────────────────────────── */

export const track = {

  /* ── Navigation ────────────────────────────────────────── */
  navClick: (label: string) =>
    vercelTrack('nav_click', { label }),

  /* ── Hero CTAs ──────────────────────────────────────────── */
  ctaClick: (label: string, location: string) =>
    vercelTrack('cta_click', { label, location }),

  /* ── Project interactions ───────────────────────────────── */
  projectView: (title: string, slug: string) =>
    vercelTrack('project_view', { title, slug }),

  projectLinkClick: (title: string, url: string) =>
    vercelTrack('project_link_click', { title, url }),

  /* ── Contact ────────────────────────────────────────────── */
  contactFormStart: () =>
    vercelTrack('contact_form_start'),

  contactFormSubmit: (success: boolean) =>
    vercelTrack('contact_form_submit', { success }),

  /* ── Social links ───────────────────────────────────────── */
  socialClick: (platform: string, location: string) =>
    vercelTrack('social_click', { platform, location }),

  /* ── Email / phone taps ─────────────────────────────────── */
  emailClick: (location: string) =>
    vercelTrack('email_click', { location }),

  phoneClick: (location: string) =>
    vercelTrack('phone_click', { location }),

  /* ── Scroll milestones ──────────────────────────────────── */
  scrollDepth: (percent: 25 | 50 | 75 | 100) =>
    vercelTrack('scroll_depth', { percent }),

  /* ── Page-level ─────────────────────────────────────────── */
  pageView: (page: string) =>
    vercelTrack('page_view_custom', { page }),

  /* ── Mobile menu ────────────────────────────────────────── */
  mobileMenuOpen: () =>
    vercelTrack('mobile_menu_open'),

  /* ── Marquee / tech badge hover ─────────────────────────── */
  techBadgeHover: (tech: string) =>
    vercelTrack('tech_badge_hover', { tech }),
};
