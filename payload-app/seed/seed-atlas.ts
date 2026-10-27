import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import type { Payload } from 'payload'

/**
 * Invoke once from the configured Payload application after initialization.
 * Do not run automatically on deploy; explicit invocation avoids overwriting
 * later edits made in the CMS.
 */
export async function seedAtlasFromApprovedSource(payload: Payload) {
  const here = dirname(fileURLToPath(import.meta.url))
  const raw = await readFile(resolve(here, 'atlas-source.json'), 'utf8')
  const sourceData = JSON.parse(raw)

  const keys = ['practice', 'teach', 'play', 'explore', 'recognition', 'freelance'] as const
  const counts = keys.map((key) => (key === 'practice' ? sourceData.practice : sourceData.layouts[key]).nodes.length)
  if (counts.join(',') !== '4,4,2,6,6,5') {
    throw new Error('Atlas seed content failed original 27-node count verification')
  }

  await payload.updateGlobal({
    slug: 'atlasContent',
    data: { sourceData },
  })

  return { categories: keys.length, nodes: counts.reduce((sum, count) => sum + count, 0) }
}
