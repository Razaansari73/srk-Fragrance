const API_BASE = (import.meta.env.VITE_AUTH_API_BASE_URL || '').replace(/\/$/, '');

export class AuthError extends Error {
  constructor(message, code = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

const messages = {
  INVALID_OTP: 'That code is not correct. Please check it and try again.',
  OTP_EXPIRED: 'That code has expired. Request a new one to continue.',
  ACCOUNT_EXISTS: 'An account already exists with these details. Try signing in.',
  ACCOUNT_NOT_FOUND: 'We could not find an account with those details.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  OAUTH_CANCELLED: 'Sign-in was cancelled. You can try again whenever you are ready.',
};

function requireConfiguration() {
  if (!API_BASE) {
    throw new AuthError('Authentication is not configured yet. Please contact SRK Fragrance support.', 'NOT_CONFIGURED');
  }
}

async function request(path, options = {}) {
  requireConfiguration();
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch {
    throw new AuthError('We could not connect. Check your internet connection and try again.', 'NETWORK_ERROR');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const code = payload.code || 'AUTH_ERROR';
    throw new AuthError(messages[code] || payload.message || 'Something went wrong. Please try again.', code);
  }
  return payload;
}

export const authService = {
  isConfigured: Boolean(API_BASE),
  async getSession() {
    if (!API_BASE) return null;
    try { return await request('/auth/session'); } catch (error) {
      if (error.code === 'SESSION_EXPIRED' || error.code === 'AUTH_ERROR') return null;
      throw error;
    }
  },
  beginOAuth(provider, returnTo = '/') {
    requireConfiguration();
    if (!['google', 'apple'].includes(provider)) throw new AuthError('Unsupported sign-in provider.');
    const callback = new URL('/auth/callback', window.location.origin);
    callback.searchParams.set('returnTo', returnTo);
    const url = new URL(`${API_BASE}/auth/oauth/${provider}`, window.location.origin);
    url.searchParams.set('redirect_uri', callback.toString());
    window.location.assign(url.toString());
  },
  requestOtp(identifier, intent) {
    return request('/auth/otp/request', { method: 'POST', body: JSON.stringify({ identifier, intent }) });
  },
  verifyOtp(challengeId, code, intent) {
    return request('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ challengeId, code, intent }) });
  },
  completeRegistration(details, verificationToken) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify({ ...details, verificationToken }) });
  },
};
