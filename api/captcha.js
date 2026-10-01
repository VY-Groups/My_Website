/**
 * hCaptcha Server-Side Verification
 * Requires HCAPTCHA_SECRET_KEY in environment
 */

const HCAPTCHA_SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY;
const HCAPTCHA_VERIFY_URL = 'https://hcaptcha.com/siteverify';

export async function verifyHCaptcha(token) {
  // If no secret key configured, skip verification (dev mode)
  if (!HCAPTCHA_SECRET_KEY) {
    return { success: true, skipped: true };
  }

  if (!token) {
    return { success: false, error: 'Captcha token is required' };
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', HCAPTCHA_SECRET_KEY);
    params.append('response', token);

    const response = await fetch(HCAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();
    return {
      success: data.success,
      error: data['error-codes']?.join(', ') || undefined,
    };
  } catch (error) {
    console.error('hCaptcha verification error:', error.message);
    // Fail open in case of network issues (better UX) but log it
    return { success: true, warning: 'Captcha verification failed, passed due to network error' };
  }
}