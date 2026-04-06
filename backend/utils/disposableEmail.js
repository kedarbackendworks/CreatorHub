const { AppSetting } = require('../models/AdminData');
const mailchecker = require('mailchecker');
const dns = require('dns').promises;

const DISPOSABLE_EMAIL_BLOCK_MESSAGE =
  'Disposable email addresses are not allowed. Please use a permanent email address.';
const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISPOSABLE_CACHE_TTL_MS = 5 * 60 * 1000;
const REMOTE_DISPOSABLE_LOOKUP_PRIMARY_URL =
  process.env.DISPOSABLE_EMAIL_LOOKUP_URL ||
  process.env.DISPOSABLE_EMAIL_LOOKUP_PRIMARY_URL ||
  'https://disify.com/api/email/';
const REMOTE_DISPOSABLE_LOOKUP_SECONDARY_URL =
  process.env.DISPOSABLE_EMAIL_LOOKUP_SECONDARY_URL || 'https://api.mailcheck.ai/email/';
const REMOTE_DISPOSABLE_LOOKUP_TERTIARY_URL =
  process.env.DISPOSABLE_EMAIL_LOOKUP_TERTIARY_URL || 'https://www.validator.pizza/email/';

const toPositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const REMOTE_DISPOSABLE_LOOKUP_ENABLED =
  String(process.env.DISPOSABLE_EMAIL_REMOTE_CHECK || 'true').toLowerCase() !== 'false';
const REMOTE_DISPOSABLE_LOOKUP_TIMEOUT_MS = toPositiveInt(
  process.env.DISPOSABLE_EMAIL_REMOTE_TIMEOUT_MS,
  1800
);
const REMOTE_DISPOSABLE_LOOKUP_TRUE_CACHE_TTL_MS = toPositiveInt(
  process.env.DISPOSABLE_EMAIL_REMOTE_CACHE_TRUE_MS,
  24 * 60 * 60 * 1000
);
const REMOTE_DISPOSABLE_LOOKUP_FALSE_CACHE_TTL_MS = toPositiveInt(
  process.env.DISPOSABLE_EMAIL_REMOTE_CACHE_FALSE_MS,
  30 * 60 * 1000
);
const REMOTE_DISPOSABLE_LOOKUP_ERROR_CACHE_TTL_MS = toPositiveInt(
  process.env.DISPOSABLE_EMAIL_REMOTE_CACHE_ERROR_MS,
  3 * 60 * 1000
);
const DISPOSABLE_EMAIL_DNS_HEURISTIC_ENABLED =
  String(process.env.DISPOSABLE_EMAIL_DNS_HEURISTIC || 'true').toLowerCase() !== 'false';
const DISPOSABLE_EMAIL_DNS_TIMEOUT_MS = toPositiveInt(
  process.env.DISPOSABLE_EMAIL_DNS_TIMEOUT_MS,
  1400
);

const REMOTE_DISPOSABLE_PROVIDER_URLS = [
  REMOTE_DISPOSABLE_LOOKUP_PRIMARY_URL,
  REMOTE_DISPOSABLE_LOOKUP_SECONDARY_URL,
  REMOTE_DISPOSABLE_LOOKUP_TERTIARY_URL,
].filter((value, index, array) => Boolean(value) && array.indexOf(value) === index);

const DEFAULT_DISPOSABLE_DOMAINS = [
  '0815.ru',
  '10mail.org',
  '10minutemail.com',
  '10minutemail.net',
  '10minutemail.org',
  '20minutemail.com',
  '2prong.com',
  '33mail.com',
  'afrobacon.com',
  'anonbox.net',
  'anonmails.de',
  'bccto.me',
  'binkmail.com',
  'bodhi.lawlita.com',
  'burnermail.io',
  'chacuo.net',
  'cosmorph.com',
  'courrieltemporaire.com',
  'cuvox.de',
  'dayrep.com',
  'discard.email',
  'dispostable.com',
  'dodgeit.com',
  'dropmail.me',
  'emailondeck.com',
  'emailtemporario.com.br',
  'fakeinbox.com',
  'filzmail.com',
  'fivemail.de',
  'gishpuppy.com',
  'getairmail.com',
  'getnada.com',
  'gmx.us',
  'goemailgo.com',
  'guerrillamail.biz',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'h8s.org',
  'hidingmail.com',
  'inboxbear.com',
  'incognitomail.com',
  'jetable.com',
  'kasmail.com',
  'kismail.ru',
  'mail-temporaire.fr',
  'mailcatch.com',
  'maildrop.cc',
  'maildrop.cf',
  'maildrop.ga',
  'maildrop.gq',
  'maildrop.ml',
  'maildrop.tk',
  'mailinator.com',
  'mailinator.net',
  'marvetos.com',
  'mailnesia.com',
  'mailnull.com',
  'mailsac.com',
  'meltmail.com',
  'mintemail.com',
  'my10minutemail.com',
  'mytrashmail.com',
  'no-spam.ws',
  'nowmymail.com',
  'objectmail.com',
  'opayq.com',
  'ozvmail.com',
  'owlpic.com',
  'pookmail.com',
  'privatdemail.net',
  'proxymail.eu',
  'rcpt.at',
  'replycatch.com',
  'sharklasers.com',
  'spambog.com',
  'spambog.de',
  'spambog.ru',
  'spamhereplease.com',
  'spamgourmet.com',
  'spammotel.com',
  'spamspot.com',
  'temp-mail.org',
  'tempail.com',
  'tempemail.net',
  'tempinbox.com',
  'tempmail.com',
  'tempmail.net',
  'tempmailo.com',
  'temporaryemail.net',
  'throwam.com',
  'throwaway.email',
  'throwawaymail.com',
  'trash-mail.com',
  'trashmail.at',
  'trashmail.com',
  'trashmail.io',
  'trashmail.me',
  'trashmail.net',
  'wegwerfemail.de',
  'wegwerfmail.de',
  'xmail.net',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'yuurok.com',
  'zehnminutenmail.de',
];

let disposableDomainCache = {
  expiresAt: 0,
  domainSet: new Set(DEFAULT_DISPOSABLE_DOMAINS),
};
let remoteLookupCache = new Map();
let remoteLookupFailureUntil = 0;

const getMailcheckerBlacklist = () => {
  try {
    const blacklist = mailchecker.blacklist();
    return blacklist && typeof blacklist.has === 'function' ? blacklist : new Set();
  } catch {
    return new Set();
  }
};

const MAILCHECKER_BLACKLIST = getMailcheckerBlacklist();

const normalizeEmailAddress = (email) => String(email || '').trim().toLowerCase();

const normalizeDomain = (domain) =>
  String(domain || '')
    .trim()
    .toLowerCase()
    .replace(/^\.+/, '')
    .replace(/\.+$/, '');

const isValidEmailFormat = (email) => EMAIL_FORMAT_REGEX.test(normalizeEmailAddress(email));

const extractEmailDomain = (email) => {
  const normalizedEmail = normalizeEmailAddress(email);
  const atIndex = normalizedEmail.lastIndexOf('@');

  if (atIndex <= 0 || atIndex === normalizedEmail.length - 1) {
    return '';
  }

  return normalizeDomain(normalizedEmail.slice(atIndex + 1));
};

const parseCommaSeparatedDomains = (rawValue) =>
  String(rawValue || '')
    .split(',')
    .map((domain) => normalizeDomain(domain))
    .filter(Boolean);

const getDomainsFromEnv = () => parseCommaSeparatedDomains(process.env.DISPOSABLE_EMAIL_DOMAINS);

const getDomainsFromSettings = async () => {
  if (AppSetting?.db?.readyState !== 1) {
    return [];
  }

  try {
    const settings = await AppSetting.findOne().select('blockedEmailDomains').lean();
    return Array.isArray(settings?.blockedEmailDomains)
      ? settings.blockedEmailDomains.map((domain) => normalizeDomain(domain)).filter(Boolean)
      : [];
  } catch {
    return [];
  }
};

const getDisposableDomainSet = async () => {
  const now = Date.now();
  if (disposableDomainCache.expiresAt > now) {
    return disposableDomainCache.domainSet;
  }

  const nextDomainSet = new Set(MAILCHECKER_BLACKLIST);

  for (const bundledDomain of DEFAULT_DISPOSABLE_DOMAINS) {
    nextDomainSet.add(bundledDomain);
  }

  for (const envDomain of getDomainsFromEnv()) {
    nextDomainSet.add(envDomain);
  }

  const customDomains = await getDomainsFromSettings();
  for (const customDomain of customDomains) {
    nextDomainSet.add(customDomain);
  }

  disposableDomainCache = {
    expiresAt: now + DISPOSABLE_CACHE_TTL_MS,
    domainSet: nextDomainSet,
  };

  return disposableDomainCache.domainSet;
};

const getRemoteLookupCacheValue = (domain) => {
  const cached = remoteLookupCache.get(domain);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    remoteLookupCache.delete(domain);
    return null;
  }

  return cached.isDisposable;
};

const setRemoteLookupCacheValue = (domain, isDisposable, ttlMs) => {
  remoteLookupCache.set(domain, {
    expiresAt: Date.now() + ttlMs,
    isDisposable,
  });
};

const withTimeout = (promise, timeoutMs) =>
  new Promise((resolve, reject) => {
    const timerId = setTimeout(() => {
      reject(new Error('TIMEOUT'));
    }, timeoutMs);

    Promise.resolve(promise)
      .then((value) => {
        clearTimeout(timerId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timerId);
        reject(error);
      });
  });

const isLikelyDisposableByDnsProfile = async (domain) => {
  if (!DISPOSABLE_EMAIL_DNS_HEURISTIC_ENABLED) {
    return false;
  }

  const normalizedDomain = normalizeDomain(domain);
  if (!normalizedDomain) {
    return false;
  }

  try {
    const [mxRecords, aRecords] = await Promise.all([
      withTimeout(dns.resolveMx(normalizedDomain), DISPOSABLE_EMAIL_DNS_TIMEOUT_MS).catch(() => []),
      withTimeout(dns.resolve4(normalizedDomain), DISPOSABLE_EMAIL_DNS_TIMEOUT_MS).catch(() => []),
    ]);

    const mxList = Array.isArray(mxRecords) ? mxRecords : [];
    const hasMx = mxList.length > 0;
    const hasARecords = Array.isArray(aRecords) && aRecords.length > 0;

    if (!hasMx || hasARecords) {
      return false;
    }

    const normalizedMxHosts = mxList
      .map((record) => normalizeDomain(record?.exchange || ''))
      .filter(Boolean);

    if (!normalizedMxHosts.length) {
      return false;
    }

    const allMxSelfHosted = normalizedMxHosts.every((host) =>
      host === normalizedDomain || host.endsWith(`.${normalizedDomain}`)
    );
    const hasMailLikeMxHost = normalizedMxHosts.some(
      (host) =>
        host === `mail.${normalizedDomain}` ||
        host === `mx.${normalizedDomain}` ||
        host.startsWith(`mail.`) ||
        host.startsWith(`mx.`)
    );

    return allMxSelfHosted && hasMailLikeMxHost;
  } catch {
    return false;
  }
};

const queryDisposableProvider = async (baseUrl, email) => {
  if (!baseUrl) {
    return {
      disposable: null,
      isDefinitive: false,
    };
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), REMOTE_DISPOSABLE_LOOKUP_TIMEOUT_MS);

  try {
    const requestUrl = `${baseUrl}${encodeURIComponent(email)}`;
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: abortController.signal,
    });

    if (!response.ok) {
      return {
        disposable: null,
        isDefinitive: false,
        statusCode: response.status,
      };
    }

    const payload = await response.json();
    if (typeof payload?.disposable === 'boolean') {
      return {
        disposable: payload.disposable,
        isDefinitive: true,
      };
    }

    return {
      disposable: null,
      isDefinitive: false,
    };
  } catch {
    return {
      disposable: null,
      isDefinitive: false,
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

const getRemoteDisposableStatus = async (email, domain) => {
  if (
    !REMOTE_DISPOSABLE_LOOKUP_ENABLED ||
    typeof fetch !== 'function' ||
    REMOTE_DISPOSABLE_PROVIDER_URLS.length === 0
  ) {
    return null;
  }

  const cachedStatus = getRemoteLookupCacheValue(domain);
  if (typeof cachedStatus === 'boolean') {
    return cachedStatus;
  }

  if (remoteLookupFailureUntil > Date.now()) {
    return null;
  }

  const providerResults = await Promise.all(
    REMOTE_DISPOSABLE_PROVIDER_URLS.map((providerUrl) => queryDisposableProvider(providerUrl, email))
  );

  let sawDisposable = false;
  let definitiveFalseCount = 0;
  let unknownCount = 0;

  for (const result of providerResults) {
    if (!result?.isDefinitive || typeof result.disposable !== 'boolean') {
      unknownCount += 1;
      continue;
    }

    if (result.disposable) {
      sawDisposable = true;
      break;
    }

    definitiveFalseCount += 1;
  }

  if (sawDisposable) {
    setRemoteLookupCacheValue(domain, true, REMOTE_DISPOSABLE_LOOKUP_TRUE_CACHE_TTL_MS);
    return true;
  }

  const hasHighConfidenceNonDisposable =
    definitiveFalseCount > 1 || (definitiveFalseCount === 1 && unknownCount === 0);

  if (hasHighConfidenceNonDisposable) {
    setRemoteLookupCacheValue(domain, false, REMOTE_DISPOSABLE_LOOKUP_FALSE_CACHE_TTL_MS);
    return false;
  }

  if (definitiveFalseCount === 0 && unknownCount > 0) {
    remoteLookupFailureUntil = Date.now() + REMOTE_DISPOSABLE_LOOKUP_ERROR_CACHE_TTL_MS;
    return null;
  }

  // Single false with other providers unavailable is treated as unknown.
  return null;
};

const isDomainDisposable = (domain, domainSet) => {
  const normalizedDomain = normalizeDomain(domain);
  if (!normalizedDomain) return false;

  const domainParts = normalizedDomain.split('.').filter(Boolean);
  if (domainParts.length < 2) return false;

  // Match full domain and any parent domain to catch disposable subdomains.
  for (let i = 0; i < domainParts.length - 1; i += 1) {
    const candidate = domainParts.slice(i).join('.');
    if (domainSet.has(candidate)) {
      return true;
    }
  }

  return false;
};

const evaluateDisposableEmail = async (email) => {
  const normalizedEmail = normalizeEmailAddress(email);
  const domain = extractEmailDomain(normalizedEmail);

  if (!normalizedEmail || !isValidEmailFormat(normalizedEmail) || !domain) {
    return {
      email: normalizedEmail,
      domain,
      isValidEmail: false,
      isDisposable: false,
    };
  }

  const disposableDomainSet = await getDisposableDomainSet();
  const isLocallyDisposable = isDomainDisposable(domain, disposableDomainSet);

  if (isLocallyDisposable) {
    return {
      email: normalizedEmail,
      domain,
      isValidEmail: true,
      isDisposable: true,
      detectionSource: 'local',
    };
  }

  const isRemotelyDisposable = await getRemoteDisposableStatus(normalizedEmail, domain);
  if (isRemotelyDisposable === true) {
    // Keep hot cache aware of newly discovered disposable domains.
    disposableDomainSet.add(domain);

    return {
      email: normalizedEmail,
      domain,
      isValidEmail: true,
      isDisposable: true,
      detectionSource: 'remote',
    };
  }

  if (isRemotelyDisposable === null) {
    const isDnsLikelyDisposable = await isLikelyDisposableByDnsProfile(domain);
    if (isDnsLikelyDisposable) {
      return {
        email: normalizedEmail,
        domain,
        isValidEmail: true,
        isDisposable: true,
        detectionSource: 'dns-heuristic',
      };
    }
  }

  return {
    email: normalizedEmail,
    domain,
    isValidEmail: true,
    isDisposable: false,
    detectionSource:
      isRemotelyDisposable === false
        ? 'remote'
        : isRemotelyDisposable === null
          ? 'remote-unknown'
          : 'local',
  };
};

const invalidateDisposableEmailCache = () => {
  disposableDomainCache = {
    expiresAt: 0,
    domainSet: new Set(DEFAULT_DISPOSABLE_DOMAINS),
  };
  remoteLookupCache = new Map();
  remoteLookupFailureUntil = 0;
};

module.exports = {
  DISPOSABLE_EMAIL_BLOCK_MESSAGE,
  normalizeEmailAddress,
  isValidEmailFormat,
  evaluateDisposableEmail,
  invalidateDisposableEmailCache,
};
