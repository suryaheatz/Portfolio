import type { FieldHook } from 'payload'

/**
 * coerceLexical - afterRead field hook for richText fields
 *
 * Converts legacy plain-text values (stored when field was textarea) to
 * minimal valid Lexical JSON so the admin editor initialises correctly.
 *
 * Why: commit 3b771e1 switched body/description fields from textarea to
 * richText. Existing plain-text content in those columns causes Payload's
 * Lexical editor component to fail silently -- the field disappears from
 * the admin UI. This hook coerces on every read so the editor always
 * receives a valid structure without requiring a data migration.
 *
 * Idempotent: already-valid Lexical objects are passed through unchanged.
 */

function plainToLexical(text: string): LexicalRoot {
  const raw = text.trim()
  const paragraphs = raw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
  const children = (paragraphs.length ? paragraphs : [raw]).map((para): LexicalParagraph => ({
    children: [{
      detail: 0, format: 0, mode: 'normal', style: '',
      text: para, type: 'text', version: 1,
    }],
    direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1,
  }))
  return {
    root: {
      children,
      direction: 'ltr', format: '', indent: 0, type: 'root', version: 1,
    },
  }
}

export const coerceLexical: FieldHook = ({ value }) => {
  if (value == null) return value

  // Already a valid Lexical object -- pass through
  if (typeof value === 'object' && 'root' in (value as Record<string, unknown>)) {
    return value
  }

  // Stored as a JSON string (e.g. from a different serialisation path) -- parse it
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return value
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed) as Record<string, unknown>
        if (parsed && 'root' in parsed) return parsed
      } catch {
        // Fall through to plain-text path
      }
    }
    // Plain text -- convert to Lexical paragraphs
    return plainToLexical(trimmed)
  }

  return value
}

// Minimal Lexical types (avoids importing the full lexical package)
type LexicalText = {
  detail: number; format: number; mode: string; style: string;
  text: string; type: 'text'; version: number;
}
type LexicalParagraph = {
  children: LexicalText[]; direction: string; format: string;
  indent: number; type: 'paragraph'; version: number;
}
type LexicalRoot = {
  root: {
    children: LexicalParagraph[]; direction: string; format: string;
    indent: number; type: 'root'; version: number;
  };
}
