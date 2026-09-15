/**
 * analytics.ts — Unified Vercel Analytics & Microsoft Clarity Event Tracker
 *
 * Provides typed helpers to synchronize user behavior, custom events,
 * and high-value session upgrades to both Vercel Analytics and Microsoft Clarity.
 *
 * Includes GDPR/ePrivacy compliant Consent Mode integration.
 */
import { track as vercelTrack } from '@vercel/analytics';

/* ─────────────────────────────────────────────────────────────
   MICROSOFT CLARITY TYPED INTERFACE
───────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    clarity?: {
      (action: 'event', eventName: string): void;
      (action: 'set', key: string, value: string | number | boolean): void;
      (action: 'identify', customId: string, sessionMetadata?: string, pageMetadata?: string, friendlyName?: string): void;
      (action: 'upgrade', reason: string): void;
      (action: 'consent', consent?: boolean): void;
      (action: string, ...args: unknown[]): void;
      q?: unknown[];
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   CONSENT MODE MANAGER
───────────────────────────────────────────────────────────── */

export type ConsentStatus = 'granted' | 'denied' | 'unset';

export const consentManager = {
  /** Retrieve active consent state from localStorage */
  getStatus: (): ConsentStatus => {
    if (typeof window === 'undefined') return 'unset';
    try {
      const stored = localStorage.getItem('analytics_consent');
      if (stored === 'granted' || stored === 'denied') return stored;
    } catch {
      // Fallback for sandboxed or private browsing environments
    }
    return 'unset';
  },

  /** Update user consent preference and notify tracking providers */
  setConsent: (granted: boolean) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('analytics_consent', granted ? 'granted' : 'denied');
      if (typeof window.clarity === 'function') {
        window.clarity('consent', granted);
      }
    } catch {
      // Fallback for storage errors
    }
  },
};

/**
 * Microsoft Clarity programmatic helpers
 */
export const clarity = {
  /** Track custom event in Clarity */
  event: (eventName: string) => {
    try {
      if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
        window.clarity('event', eventName);
      }
    } catch {
      // Safe fallback if blocked by privacy shields
    }
  },

  /** Set custom dimension/tag for filtering recordings and heatmaps */
  tag: (key: string, value: string | number | boolean) => {
    try {
      if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
        window.clarity('set', key, value);
      }
    } catch {
      // Safe fallback
    }
  },

  /**
   * Prioritize and bookmark the current session recording in Clarity.
   */
  upgrade: (reason: string) => {
    try {
      if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
        window.clarity('upgrade', reason);
      }
    } catch {
      // Safe fallback
    }
  },

  /** Identify custom user or session attribute */
  identify: (customId: string, sessionMetadata?: string, pageMetadata?: string, friendlyName?: string) => {
    try {
      if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
        window.clarity('identify', customId, sessionMetadata, pageMetadata, friendlyName);
      }
    } catch {
      // Safe fallback
    }
  },

  /** Set explicit tracking consent */
  consent: (granted: boolean) => {
    consentManager.setConsent(granted);
  },
};

/* ─────────────────────────────────────────────────────────────
   TYPED UNIFIED EVENTS (Dispatches to both Vercel & Clarity)
───────────────────────────────────────────────────────────── */

export const track = {
  /* ── Navigation ────────────────────────────────────────── */
  navClick: (label: string) => {
    vercelTrack('nav_click', { label });
    clarity.event('nav_click');
    clarity.tag('nav_target', label);
  },

  /* ── Hero & Page CTAs ───────────────────────────────────── */
  ctaClick: (label: string, location: string) => {
    vercelTrack('cta_click', { label, location });
    clarity.event('cta_click');
    clarity.tag('cta_label', label);
    clarity.tag('cta_location', location);
    if (label.toLowerCase().includes('dossier') || label.toLowerCase().includes('pdf')) {
      clarity.upgrade('dossier_download_intent');
    }
  },

  /* ── Dossier / PDF Downloads ────────────────────────────── */
  downloadDossier: (location: string) => {
    vercelTrack('download_dossier', { location });
    clarity.event('download_dossier');
    clarity.tag('dossier_location', location);
    clarity.upgrade('dossier_downloaded');
  },

  /* ── Project interactions ───────────────────────────────── */
  projectView: (title: string, slug: string) => {
    vercelTrack('project_view', { title, slug });
    clarity.event('project_view');
    clarity.tag('active_project', slug);
  },

  projectLinkClick: (title: string, url: string) => {
    vercelTrack('project_link_click', { title, url });
    clarity.event('project_link_click');
    clarity.tag('project_target_url', url);
  },

  /* ── Contact ────────────────────────────────────────────── */
  contactFormStart: () => {
    vercelTrack('contact_form_start');
    clarity.event('contact_form_start');
  },

  contactFormSubmit: (success: boolean) => {
    vercelTrack('contact_form_submit', { success });
    clarity.event('contact_form_submit');
    clarity.tag('contact_success', success);
    if (success) {
      clarity.upgrade('contact_form_submitted');
    }
  },

  /* ── Social links ───────────────────────────────────────── */
  socialClick: (platform: string, location: string) => {
    vercelTrack('social_click', { platform, location });
    clarity.event('social_click');
    clarity.tag('social_platform', platform);
  },

  /* ── Email / phone taps ─────────────────────────────────── */
  emailClick: (location: string) => {
    vercelTrack('email_click', { location });
    clarity.event('email_click');
    clarity.tag('email_location', location);
    clarity.upgrade('email_intent');
  },

  phoneClick: (location: string) => {
    vercelTrack('phone_click', { location });
    clarity.event('phone_click');
    clarity.tag('phone_location', location);
  },

  /* ── Scroll milestones ──────────────────────────────────── */
  scrollDepth: (percent: 25 | 50 | 75 | 100) => {
    vercelTrack('scroll_depth', { percent });
    clarity.event(`scroll_${percent}`);
    clarity.tag('scroll_depth', percent);
  },

  /* ── Page-level ─────────────────────────────────────────── */
  pageView: (page: string) => {
    vercelTrack('page_view_custom', { page });
    clarity.event('page_view');
    clarity.tag('page_path', page);
  },

  /* ── Mobile menu ────────────────────────────────────────── */
  mobileMenuOpen: () => {
    vercelTrack('mobile_menu_open');
    clarity.event('mobile_menu_open');
  },

  /* ── Marquee / tech badge hover ─────────────────────────── */
  techBadgeHover: (tech: string) => {
    vercelTrack('tech_badge_hover', { tech });
    clarity.event('tech_badge_hover');
  },
};
