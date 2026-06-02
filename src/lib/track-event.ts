import { AnalyticsService } from "@/src/services/analytics.service";

/**
 * Generate an anonymous visitor hash using browser-native SubtleCrypto.
 * Based on UserAgent + screen dimensions — no real IP is stored.
 */
async function getVisitorHash(): Promise<string> {
  const raw = navigator.userAgent + screen.width + screen.height;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(raw));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Track an analytics event. Fails silently to never break UX.
 * @param eventType - 'page_view' | 'project_click' | 'blog_click' | 'language_switch' | 'cv_download'
 * @param eventKey  - Additional identifier (slug, locale code, etc.)
 */
export async function trackEvent(
  eventType: string,
  eventKey?: string
): Promise<void> {
  try {
    const visitorHash = await getVisitorHash();
    await AnalyticsService.trackEvent({
      event_type: eventType,
      event_key: eventKey,
      page_path: window.location.pathname,
      referrer: document.referrer || undefined,
      visitor_hash: visitorHash,
    });
  } catch {
    // Silent fail — analytics should never break the visitor experience
  }
}
