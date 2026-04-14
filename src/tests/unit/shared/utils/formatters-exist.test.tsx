import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('shared formatters module exists', () => {
  const source = readFileSync(
    new URL('../../../../shared/utils/formatters.ts', import.meta.url),
    'utf8'
  )

  assert.ok(source.length > 0)
})
