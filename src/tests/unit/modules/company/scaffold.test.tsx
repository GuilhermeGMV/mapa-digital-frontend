import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('company module exposes dashboard route entry', () => {
  const source = readFileSync(
    new URL('../../../../modules/company/route.tsx', import.meta.url),
    'utf8'
  )

  assert.match(source, /company\.dashboard/)
  assert.match(source, /allowedRoles=\{\['empresa'\]\}/)
})
