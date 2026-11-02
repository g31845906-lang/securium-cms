/**
 * Copies existing files from the local media directory to Vercel Blob, using the
 * same pathname (the filename) that the storage adapter looks up, so media records
 * and their URLs keep working without any database change.
 *
 * Previews by default. Blobs that already exist are skipped, never overwritten,
 * so it is safe to re-run. Local files are not deleted.
 *
 *   npx tsx scripts/migrate-media-to-blob.ts           # preview
 *   npx tsx scripts/migrate-media-to-blob.ts --apply   # upload
 */
import { list, put } from '@vercel/blob'
import 'dotenv/config'
import { readdir, readFile } from 'fs/promises'
import path from 'path'

const MEDIA_DIR = path.resolve(process.cwd(), 'media')
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

const token = process.env.BLOB_READ_WRITE_TOKEN
const apply = process.argv.includes('--apply')

if (!token) {
  console.error('BLOB_READ_WRITE_TOKEN is not set.')
  process.exit(1)
}

const listExistingPathnames = async (): Promise<Set<string>> => {
  const pathnames = new Set<string>()
  let cursor: string | undefined

  do {
    const page = await list({ cursor, limit: 1000, token })
    page.blobs.forEach((blob) => pathnames.add(blob.pathname))
    cursor = page.cursor
  } while (cursor)

  return pathnames
}

const entries = await readdir(MEDIA_DIR, { withFileTypes: true })
const filenames = entries.filter((entry) => entry.isFile()).map((entry) => entry.name)
const existing = await listExistingPathnames()
const pending = filenames.filter((filename) => !existing.has(filename))

console.log(
  `${filenames.length} local files, ${existing.size} blobs in the store, ${pending.length} to upload.`,
)

let failed = 0

for (const filename of pending) {
  if (!apply) {
    console.log(`would upload ${filename}`)
    continue
  }

  try {
    const body = await readFile(path.join(MEDIA_DIR, filename))
    // Content type is inferred from the file extension.
    await put(filename, body, {
      access: 'public',
      addRandomSuffix: false,
      cacheControlMaxAge: ONE_YEAR_IN_SECONDS,
      token,
    })
    console.log(`uploaded ${filename}`)
  } catch (error) {
    failed += 1
    console.error(`FAILED ${filename}:`, error)
  }
}

if (!apply) {
  console.log('Preview only. Re-run with --apply to upload.')
}

if (failed > 0) {
  console.error(`${failed} uploads failed. Re-run to retry them.`)
  process.exit(1)
}
