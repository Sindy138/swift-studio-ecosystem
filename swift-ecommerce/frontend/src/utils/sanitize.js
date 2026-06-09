import DOMPurify from 'dompurify'

const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above|prior|system)/i,
  /jailbreak/i,
  /\bDAN\b/,
  /system\s*:/i,
  /<\|.*?\|>/,
  /\bact\s+as\b.*?\bno\s+restrictions?\b/i,
  /forget\s+your\s+(instructions|rules|guidelines)/i,
]

export const sanitizeHtml = (html) =>
  DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'code', 'pre'], ALLOWED_ATTR: ['href', 'target'] })

export const containsInjection = (text) =>
  INJECTION_PATTERNS.some((pattern) => pattern.test(text))
