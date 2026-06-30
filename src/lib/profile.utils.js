const PROFILE_COMPLETENESS_FIELDS = [
  { key: "avatarUrl", label: "Avatar" },
  { key: "bio", label: "Bio" },
  { key: "headline", label: "Headline" },
  { key: "domain", label: "Domain" },
  { key: "githubUrl", label: "GitHub" },
  { key: "leetcodeUsername", label: "LeetCode" },
  { key: "codeforcesUsername", label: "Codeforces" },
  { key: "linkedinUrl", label: "LinkedIn" },
  { key: "replitUrl", label: "Replit" },
  { key: "websiteUrl", label: "Website" },
];

function cleanValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasScheme(value) {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);
}

function tryCreateUrl(value) {
  const trimmed = cleanValue(value);

  if (!trimmed) {
    return null;
  }

  const candidate = hasScheme(trimmed)
    ? trimmed
    : trimmed.includes(".") || trimmed.includes("/")
    ? `https://${trimmed}`
    : null;

  if (!candidate) {
    return null;
  }

  try {
    return new URL(candidate);
  } catch {
    return null;
  }
}

function getPathSegments(url) {
  return url.pathname.split("/").filter(Boolean);
}

function normalizeHandle(handle) {
  return cleanValue(handle).replace(/^[@~]/, "").replace(/^\/+|\/+$/g, "");
}

function isLikelyHandle(value) {
  return /^[A-Za-z0-9._-]+$/.test(value);
}

function canonicalizeUrl(url, { keepTrailingSlash = false } = {}) {
  const pathname = keepTrailingSlash
    ? url.pathname.replace(/\/+$/, "/")
    : url.pathname.replace(/\/+$/, "");
  const search = url.search || "";

  if (!pathname || pathname === "/") {
    return `${url.origin}${search}`;
  }

  return `${url.origin}${pathname}${search}`;
}

function normalizeGitHub(value) {
  const trimmed = cleanValue(value);
  const handle = normalizeHandle(trimmed);

  if (handle && !trimmed.includes("/") && !trimmed.includes(".") && isLikelyHandle(handle)) {
    return `https://github.com/${handle}`;
  }

  const url = tryCreateUrl(trimmed);

  if (!url || !/(^|\.)github\.com$/i.test(url.hostname)) {
    return trimmed;
  }

  const [segment] = getPathSegments(url);
  const normalized = normalizeHandle(segment);

  return normalized ? `https://github.com/${normalized}` : trimmed;
}

function normalizeLeetCode(value) {
  const trimmed = cleanValue(value);
  const handle = normalizeHandle(trimmed);

  if (handle && !trimmed.includes("/") && !trimmed.includes(".") && isLikelyHandle(handle)) {
    return `https://leetcode.com/u/${handle}/`;
  }

  const url = tryCreateUrl(trimmed);

  if (!url || !/(^|\.)leetcode\.com$/i.test(url.hostname)) {
    return trimmed;
  }

  const segments = getPathSegments(url);
  const handleFromUrl =
    segments[0] === "u" && segments[1]
      ? normalizeHandle(segments[1])
      : normalizeHandle(segments[0]);

  return handleFromUrl ? `https://leetcode.com/u/${handleFromUrl}/` : trimmed;
}

function normalizeCodeforces(value) {
  const trimmed = cleanValue(value);
  const handle = normalizeHandle(trimmed);

  if (handle && !trimmed.includes("/") && !trimmed.includes(".") && isLikelyHandle(handle)) {
    return `https://codeforces.com/profile/${handle}`;
  }

  const url = tryCreateUrl(trimmed);

  if (!url || !/(^|\.)codeforces\.com$/i.test(url.hostname)) {
    return trimmed;
  }

  const segments = getPathSegments(url);
  const handleFromUrl =
    segments[0] === "profile" && segments[1]
      ? normalizeHandle(segments[1])
      : normalizeHandle(segments[0]);

  return handleFromUrl ? `https://codeforces.com/profile/${handleFromUrl}` : trimmed;
}

function normalizeLinkedIn(value) {
  const trimmed = cleanValue(value);
  const handle = normalizeHandle(trimmed);

  if (handle && !trimmed.includes("/") && !trimmed.includes(".") && isLikelyHandle(handle)) {
    return `https://www.linkedin.com/in/${handle}`;
  }

  const url = tryCreateUrl(trimmed);

  if (!url || !/(^|\.)linkedin\.com$/i.test(url.hostname)) {
    return trimmed;
  }

  const segments = getPathSegments(url);

  if (!segments.length) {
    return trimmed;
  }

  if (["in", "company", "pub"].includes(segments[0]) && segments[1]) {
    return `https://www.linkedin.com/${segments[0]}/${normalizeHandle(segments[1])}`;
  }

  const normalized = normalizeHandle(segments[0]);

  return normalized ? `https://www.linkedin.com/in/${normalized}` : trimmed;
}

function normalizeReplit(value) {
  const trimmed = cleanValue(value);
  const handle = normalizeHandle(trimmed);

  if (handle && !trimmed.includes("/") && !trimmed.includes(".") && isLikelyHandle(handle)) {
    return `https://replit.com/@${handle}`;
  }

  const url = tryCreateUrl(trimmed);

  if (!url || !/(^|\.)replit\.com$/i.test(url.hostname)) {
    return trimmed;
  }

  const [segment] = getPathSegments(url);
  const normalized = normalizeHandle(segment);

  return normalized ? `https://replit.com/@${normalized}` : trimmed;
}

function normalizeWebsite(value) {
  const trimmed = cleanValue(value);
  const url = tryCreateUrl(trimmed);

  return url ? canonicalizeUrl(url) : trimmed;
}

function normalizeAvatarUrl(value) {
  const trimmed = cleanValue(value);
  const url = tryCreateUrl(trimmed);

  return url ? canonicalizeUrl(url) : trimmed;
}

export function normalizeProfileLinks(data) {
  return {
    ...data,
    githubUrl: normalizeGitHub(data.githubUrl),
    leetcodeUsername: normalizeLeetCode(data.leetcodeUsername),
    codeforcesUsername: normalizeCodeforces(data.codeforcesUsername),
    linkedinUrl: normalizeLinkedIn(data.linkedinUrl),
    replitUrl: normalizeReplit(data.replitUrl),
    websiteUrl: normalizeWebsite(data.websiteUrl),
    avatarUrl: normalizeAvatarUrl(data.avatarUrl),
  };
}

export function calculateProfileCompleteness(profile) {
  const completedCount = PROFILE_COMPLETENESS_FIELDS.filter(({ key }) =>
    Boolean(cleanValue(profile?.[key]))
  ).length;

  return {
    completedCount,
    totalCount: PROFILE_COMPLETENESS_FIELDS.length,
    percentage: Math.round(
      (completedCount / PROFILE_COMPLETENESS_FIELDS.length) * 100
    ),
    missing: PROFILE_COMPLETENESS_FIELDS.filter(
      ({ key }) => !cleanValue(profile?.[key])
    ).map(({ label }) => label),
  };
}

export function formatProfileLinkLabel(value) {
  const trimmed = cleanValue(value);

  if (!trimmed) {
    return "";
  }

  return trimmed.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}
