export const VIEWED_CATEGORY_HISTORY_KEY = 'viewedCategoryHistory:v1';

function normalizeEntry(entry) {
  if (!entry?.id || !entry?.name) return null;
  return {
    id: entry.id,
    name: entry.name,
    image: entry.image || '',
    count: Number(entry.count || 0),
    viewedAt: Number(entry.viewedAt || 0),
  };
}

export function readViewedCategories() {
  try {
    const raw = localStorage.getItem(VIEWED_CATEGORY_HISTORY_KEY);
    const parsed = JSON.parse(raw || '[]');
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normalizeEntry)
      .filter(Boolean)
      .sort((a, b) => b.count - a.count || b.viewedAt - a.viewedAt)
      .slice(0, 8);
  } catch {
    return [];
  }
}

export function recordViewedCategory(category) {
  const nextEntry = normalizeEntry({
    ...category,
    count: 1,
    viewedAt: Date.now(),
  });
  if (!nextEntry) return;

  const current = readViewedCategories();
  const existing = current.find((entry) => String(entry.id) === String(nextEntry.id));
  const next = [
    {
      ...nextEntry,
      image: nextEntry.image || existing?.image || '',
      count: (existing?.count || 0) + 1,
      viewedAt: Date.now(),
    },
    ...current.filter((entry) => String(entry.id) !== String(nextEntry.id)),
  ]
    .sort((a, b) => b.count - a.count || b.viewedAt - a.viewedAt)
    .slice(0, 12);

  try {
    localStorage.setItem(VIEWED_CATEGORY_HISTORY_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('viewed-categories-changed'));
  } catch {
    // Ignore storage quota/private mode failures.
  }
}
