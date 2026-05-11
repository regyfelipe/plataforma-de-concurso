const blockedHtmlPattern = /<\s*(script|style|iframe|object|embed|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi
const blockedVoidHtmlPattern = /<\s*(script|style|iframe|object|embed|link|meta|base|input|button)[^>]*\/?>/gi
const unsafeAttributePattern = /\s(?:on\w+|style)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const unsafeUrlPattern = /\s(?:href|src)\s*=\s*(?:"\s*(?:javascript:|data:text\/html)[^"]*"|'\s*(?:javascript:|data:text\/html)[^']*'|(?:javascript:|data:text\/html)[^\s>]*)/gi

export function sanitizeHtml(value?: string | null) {
  if (!value) return ""

  return value
    .replace(blockedHtmlPattern, "")
    .replace(blockedVoidHtmlPattern, "")
    .replace(unsafeAttributePattern, "")
    .replace(unsafeUrlPattern, "")
}
