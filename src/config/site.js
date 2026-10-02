/**
 * src/config/site.js
 * ---------------------------------------------------------------------------
 * App-facing view of the root site.config.js (the single source of truth
 * for identity). Import from here in components:
 *
 *   import { site, owner, socials, org, pageTitle, absUrl } from '../config/site'
 *
 * Do NOT hardcode names, emails, URLs or domains in components — they all
 * come from site.config.js so a future identity migration is a one-file edit.
 * ---------------------------------------------------------------------------
 */
import config from '../../site.config.js';

export const { site, owner, socials, org, colors } = config;

/** Absolute URL for a site-relative path (e.g. absUrl(owner.photo)). */
export const absUrl = (path = '') => `${site.url}${path}`;

/** Document title for a sub-page: "Experience | <owner name>". */
export const pageTitle = (page) => (page ? `${page} | ${owner.name}` : site.title);

export default config;
