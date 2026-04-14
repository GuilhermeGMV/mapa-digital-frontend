import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('school module exposes dashboard route entry', () => {
  const source = readFileSync(
    new URL('../../../../modules/school/route.tsx', import.meta.url),
    'utf8'
  )

  assert.match(source, /school\.dashboard/)
  assert.match(source, /allowedRoles=\{\['escola'\]\}/)
})
