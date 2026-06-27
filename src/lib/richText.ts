/**
 * Strips HTML tags and decodes basic HTML entities from a rich-text string.
 * Use for short descriptions/summaries where plain text display is needed.
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  // Remove all HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, ' ');
  // Decode common HTML entities
  return withoutTags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
    .trim();
}

/**
 * Returns true if the string contains HTML tags (i.e., was saved from rich text editor).
 */
export function isHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}
