/**
 * Resources data handler — CMS integration with fallback.
 *
 * Supports:
 *  - Notion   (NOTION_TOKEN + NOTION_DATABASE_ID)
 *  - Airtable (AIRTABLE_API_KEY + AIRTABLE_BASE_ID + AIRTABLE_TABLE_NAME)
 *  - Fallback: bundled static data in ./data/materials.js
 *
 * Results are cached for 5 minutes to avoid rate limits.
 */

import { studentMaterials } from './data/materials.js';

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache = { data: null, at: 0 };

async function fetchNotion() {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) return null;

  const res = await fetch('https://api.notion.com/v1/databases/' + databaseId + '/query', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 100 }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Notion API ${res.status}`);
  const json = await res.json();

  return json.results.map((page, i) => {
    const p = page.properties || {};
    const text = (v) => (v?.title?.[0]?.plain_text ?? v?.rich_text?.[0]?.plain_text ?? v?.select?.name ?? v?.email ?? '');
    return {
      id: i + 1,
      title: text(p.Title) || text(p.Name) || 'Untitled',
      category: text(p.Category) || 'General',
      description: text(p.Description) || '',
      fileType: text(p.FileType) || 'PDF',
      fileSize: text(p.FileSize) || 'PDF',
      downloadLink: text(p.Link) || text(p.URL) || '#',
    };
  });
}

async function fetchAirtable() {
  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_NAME || 'Resources';
  if (!key || !baseId) return null;

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?maxRecords=100`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Airtable API ${res.status}`);
  const json = await res.json();

  return json.records.map((rec, i) => {
    const f = rec.fields || {};
    const cell = (name) => {
      const v = f[name];
      if (Array.isArray(v)) return v[0]?.url || v[0]?.text || '';
      return v ?? '';
    };
    return {
      id: i + 1,
      title: cell('Title') || cell('Name') || 'Untitled',
      category: cell('Category') || 'General',
      description: cell('Description') || '',
      fileType: cell('FileType') || 'PDF',
      fileSize: cell('FileSize') || 'PDF',
      downloadLink: cell('Link') || cell('URL') || '#',
    };
  });
}

/**
 * GET /api/resources
 * Returns: { source: 'notion' | 'airtable' | 'static', materials: [...] }
 */
export async function handleGetResources(req, res) {
  // Serve from cache
  if (cache.data && Date.now() - cache.at < CACHE_TTL_MS) {
    return res.status(200).json(cache.data);
  }

  try {
    // Try Notion first, then Airtable, then static
    const notionData = await fetchNotion();
    if (notionData) {
      const payload = { source: 'notion', materials: notionData };
      cache = { data: payload, at: Date.now() };
      return res.status(200).json(payload);
    }

    const airtableData = await fetchAirtable();
    if (airtableData) {
      const payload = { source: 'airtable', materials: airtableData };
      cache = { data: payload, at: Date.now() };
      return res.status(200).json(payload);
    }
  } catch (error) {
    console.warn('CMS fetch failed, using static fallback:', error.message);
  }

  // Static fallback (never fails)
  const payload = { source: 'static', materials: studentMaterials };
  cache = { data: payload, at: Date.now() };
  return res.status(200).json(payload);
}