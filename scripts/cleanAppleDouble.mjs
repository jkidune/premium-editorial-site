import { readdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

async function cleanDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true })

  await Promise.all(entries.map(async (entry) => {
    const entryPath = join(directory, entry.name)

    if (entry.name.startsWith('._') || entry.name === '.DS_Store') {
      await rm(entryPath, { force: true, recursive: entry.isDirectory() })
      return
    }

    if (entry.isDirectory()) {
      await cleanDirectory(entryPath)
    }
  }))
}

await cleanDirectory(fileURLToPath(new URL('../dist', import.meta.url)))
