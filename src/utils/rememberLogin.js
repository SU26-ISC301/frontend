const STORAGE_KEYS = {
  buyer: 'rememberedBuyerLogins',
  vendor: 'rememberedVendorLogins',
};

const normalizeIdentifier = (identifier) => identifier.trim().toLowerCase();

const readStore = (scope) => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS[scope]) || '{}');
  } catch {
    return {};
  }
};

const writeStore = (scope, store) => {
  localStorage.setItem(STORAGE_KEYS[scope], JSON.stringify(store));
};

export const getRememberedLogin = (scope, identifier) => {
  if (!identifier?.trim() || !STORAGE_KEYS[scope]) return null;
  const store = readStore(scope);
  return store[normalizeIdentifier(identifier)] || null;
};

export const saveRememberedLogin = (scope, identifier, password) => {
  if (!identifier?.trim() || !password || !STORAGE_KEYS[scope]) return;
  const key = normalizeIdentifier(identifier);
  writeStore(scope, {
    ...readStore(scope),
    [key]: {
      identifier: identifier.trim(),
      password,
    },
  });
};

export const removeRememberedLogin = (scope, identifier) => {
  if (!identifier?.trim() || !STORAGE_KEYS[scope]) return;
  const store = readStore(scope);
  delete store[normalizeIdentifier(identifier)];
  writeStore(scope, store);
};
