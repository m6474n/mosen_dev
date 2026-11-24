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
 * Strips Markdown syntax characters at runtime to produce clean plain prose.
 * Removes headers, bold/italic symbols, code fences, inline code, links, images, and blockquotes.
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return '';
  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove images: ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    // Remove links: [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Remove markdown headers (# Title)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove blockquotes (> text)
    .replace(/^>\s+/gm, '')
    // Remove bold and italic markers (*text*, **text**, _text_, __text__)
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove strikethrough (~~text~~)
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove horizontal rules
    .replace(/^(?:[-*_]\s*){3,}$/gm, '')
    // Remove HTML tags if mixed
    .replace(/<[^>]*>/g, '')
    // Clean list bullets (- item, * item, 1. item)
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Replace multiple newlines with single paragraph break
    .replace(/\n{2,}/g, '\n\n')
    // Trim extra spaces
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/**
 * Returns true if the string contains HTML tags (i.e., was saved from rich text editor).
 */
export function isHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}
