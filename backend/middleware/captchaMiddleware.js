const { AppSetting } = require('../models/AdminData');

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];

  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0]);
  }

  return req.ip || req.socket?.remoteAddress || '';
};

const getCaptchaRuntimeConfig = async () => {
  const settings = await AppSetting.findOne().select('botProtectionEnabled');
  const enabled = Boolean(settings?.botProtectionEnabled);

  return {
    enabled,
    siteKey: process.env.TURNSTILE_SITE_KEY || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
    secretKey: process.env.TURNSTILE_SECRET_KEY || '',
  };
};

const verifyTurnstileToken = async (token, req, secretKey) => {
  const body = new URLSearchParams();
  body.set('secret', secretKey);
  body.set('response', token);

  const clientIp = getClientIp(req);
  if (clientIp) {
    body.set('remoteip', clientIp);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    return { success: false, errorCodes: ['verification_request_failed'] };
  }

  const data = await response.json();
  return {
    success: Boolean(data?.success),
    errorCodes: Array.isArray(data?.['error-codes']) ? data['error-codes'] : [],
  };
};

const getCaptchaToken = (req) => {
  const headerValue = req.headers['x-captcha-token'];
  const headerToken = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  return String(req.body?.captchaToken || headerToken || '').trim();
};

const getCaptchaConfig = async (req, res) => {
  try {
    const { enabled, siteKey, secretKey } = await getCaptchaRuntimeConfig();

    return res.status(200).json({
      enabled,
      provider: 'turnstile',
      siteKey: enabled ? siteKey : '',
      configured: enabled ? Boolean(siteKey && secretKey) : true,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load CAPTCHA configuration' });
  }
};

const requireCaptchaIfEnabled = (actionLabel = 'this action') => {
  return async (req, res, next) => {
    try {
      const { enabled, siteKey, secretKey } = await getCaptchaRuntimeConfig();

      if (!enabled) {
        return next();
      }

      if (!siteKey || !secretKey) {
        return res.status(503).json({
          message: 'Bot protection is enabled, but CAPTCHA is not configured on the server.',
        });
      }

      const captchaToken = getCaptchaToken(req);
      if (!captchaToken) {
        return res.status(400).json({
          message: `Please complete CAPTCHA verification before ${actionLabel}.`,
        });
      }

      const verification = await verifyTurnstileToken(captchaToken, req, secretKey);
      if (!verification.success) {
        return res.status(400).json({
          message: 'CAPTCHA verification failed. Please try again.',
          errorCodes: verification.errorCodes,
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({ message: 'Unable to validate CAPTCHA at the moment' });
    }
  };
};

module.exports = {
  getCaptchaConfig,
  requireCaptchaIfEnabled,
};
