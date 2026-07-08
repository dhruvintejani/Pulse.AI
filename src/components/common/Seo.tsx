import { memo, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { DASHBOARD_PATHS, ROUTES } from '@/constants/routes';

interface SeoConfig {
  title: string;
  description: string;
  image: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

const siteName = 'Pulse AI';
const defaultSiteUrl = 'https://pulse-ai.vercel.app';
const siteUrl = (import.meta.env.VITE_SITE_URL || defaultSiteUrl).replace(/\/$/, '');

const defaultSeo: SeoConfig = {
  title: 'Pulse AI — Your Intelligent Workspace',
  description: 'Pulse AI is a premium AI workspace for conversations, documents, analytics, global search, and productivity workflows.',
  image: `${siteUrl}/og-image.svg`,
  type: 'website',
};

const routeSeo: Record<string, SeoConfig> = {
  [ROUTES.HOME]: defaultSeo,
  [ROUTES.LOGIN]: { title: 'Sign in — Pulse AI', description: 'Sign in to your Pulse AI workspace.', image: defaultSeo.image, noIndex: true },
  [ROUTES.SIGNUP]: { title: 'Create account — Pulse AI', description: 'Create your Pulse AI account and start building with your intelligent workspace.', image: defaultSeo.image },
  [ROUTES.FORGOT_PASSWORD]: { title: 'Recover account — Pulse AI', description: 'Recover access to your Pulse AI account.', image: defaultSeo.image, noIndex: true },
  [ROUTES.RESET_PASSWORD]: { title: 'Reset password — Pulse AI', description: 'Reset your Pulse AI account password.', image: defaultSeo.image, noIndex: true },
  [ROUTES.VERIFY]: { title: 'Verify account — Pulse AI', description: 'Verify your Pulse AI account email.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.ROOT]: { title: 'Dashboard — Pulse AI', description: 'Your Pulse AI dashboard with recent chats, documents, analytics, activity, and notifications.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.CHAT]: { title: 'AI Chat — Pulse AI', description: 'Chat with Pulse AI using beautiful streaming responses, history, shortcuts, and document context.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.DOCUMENTS]: { title: 'Documents — Pulse AI', description: 'Upload, organize, preview, search, and analyze your documents with Pulse AI.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.ANALYTICS]: { title: 'Analytics — Pulse AI', description: 'Track AI usage, workspace productivity, model performance, and document analytics.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.NOTIFICATIONS]: { title: 'Notifications — Pulse AI', description: 'Manage unread alerts, preferences, categories, and notification activity.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.SETTINGS]: { title: 'Settings — Pulse AI', description: 'Manage profile, theme, billing, language, security, privacy, and account settings.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.PROFILE]: { title: 'Profile — Pulse AI', description: 'View profile details, activity, statistics, skills, and workspace achievements.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.BILLING]: { title: 'Billing — Pulse AI', description: 'Manage Pulse AI plans, invoices, usage, and billing preferences.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.MODELS]: { title: 'Models — Pulse AI', description: 'Explore AI models, providers, usage, and model preferences.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.TEAM]: { title: 'Team — Pulse AI', description: 'Manage team members, collaborators, roles, and workspace access.', image: defaultSeo.image, noIndex: true },
  [DASHBOARD_PATHS.ADMIN]: { title: 'Admin — Pulse AI', description: 'Admin controls for users, documents, chats, logs, analytics, and settings.', image: defaultSeo.image, noIndex: true },
};

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
};

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
};

const upsertStructuredData = (json: object) => {
  let element = document.head.querySelector<HTMLScriptElement>('script[data-pulse-schema="true"]');
  if (!element) {
    element = document.createElement('script');
    element.type = 'application/ld+json';
    element.dataset.pulseSchema = 'true';
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(json);
};

const Seo = () => {
  const location = useLocation();
  const routeConfig = routeSeo[location.pathname] ?? defaultSeo;
  const seo = location.pathname.startsWith(ROUTES.DASHBOARD)
    ? { ...routeConfig, noIndex: true }
    : routeConfig;
  const canonicalUrl = `${siteUrl}${location.pathname === '/' ? '' : location.pathname}`;

  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteName,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android, macOS, Windows',
    url: siteUrl,
    description: defaultSeo.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/pwa-icon.svg`,
    },
  }), []);

  useEffect(() => {
    document.title = seo.title;
    upsertMeta('meta[name="description"]', { name: 'description', content: seo.description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: seo.noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large' });
    upsertMeta('meta[name="application-name"]', { name: 'application-name', content: siteName });
    upsertMeta('meta[name="apple-mobile-web-app-title"]', { name: 'apple-mobile-web-app-title', content: siteName });
    upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#F8F4EC' });

    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: siteName });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type ?? 'website' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: seo.image });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: 'Pulse AI intelligent workspace preview' });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: seo.image });

    upsertLink('canonical', canonicalUrl);
    upsertStructuredData(structuredData);
  }, [canonicalUrl, seo, structuredData]);

  return null;
};

export default memo(Seo);
