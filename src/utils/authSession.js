function readStorageValue(key) {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const [, payload] = token.split('.');
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}

export function getRoleAccessToken(mode = 'buyer') {
  if (mode === 'vendor') {
    return readStorageValue('vendorAccessToken');
  }
  if (mode === 'admin') {
    return readStorageValue('adminAccessToken');
  }
  return readStorageValue('buyerAccessToken');
}

export function hasAuthenticatedSession(mode = 'buyer') {
  return Boolean(getRoleAccessToken(mode));
}

export function getSessionAccountKey(mode = 'buyer') {
  const token = getRoleAccessToken(mode);
  const payload = decodeJwtPayload(token) || {};
  const tokenIdentity =
    payload.email ||
    payload.sub ||
    payload.user_id ||
    payload.userId ||
    payload.id;

  if (tokenIdentity) {
    return `${mode}:${String(tokenIdentity).trim().toLowerCase()}`;
  }

  if (mode === 'vendor') {
    try {
      const vendorInfo = JSON.parse(window.localStorage.getItem('vendorInfo') || '{}');
      const vendorIdentity =
        vendorInfo.email ||
        vendorInfo.profileEmail ||
        vendorInfo.profileId ||
        vendorInfo.vendorId ||
        vendorInfo.id;
      if (vendorIdentity) {
        return `${mode}:${String(vendorIdentity).trim().toLowerCase()}`;
      }
    } catch {
      // Ignore invalid vendorInfo payloads.
    }
  }

  return token ? `${mode}:${token.slice(-24)}` : `${mode}:guest`;
}

export function subscribeAuthSessionChanges(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener('focus', handler);
  window.addEventListener('buyer-auth-changed', handler);
  window.addEventListener('vendor-auth-changed', handler);

  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('focus', handler);
    window.removeEventListener('buyer-auth-changed', handler);
    window.removeEventListener('vendor-auth-changed', handler);
  };
}
